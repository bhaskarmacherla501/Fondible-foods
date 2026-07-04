import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) return null
  return session
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ success: true, data: coupons })
}

const createSchema = z.object({
  code:           z.string().min(3).transform(s => s.toUpperCase()),
  type:           z.enum(['PERCENTAGE', 'FLAT', 'FREE_SHIPPING', 'BUY_X_GET_Y']),
  value:          z.number().min(0),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscount:    z.number().min(0).optional(),
  usageLimit:     z.number().int().min(1).optional(),
  perUserLimit:   z.number().int().min(1).optional(),
  description:    z.string().optional(),
  expiresAt:      z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const data = createSchema.parse(await req.json())
    const existing = await prisma.coupon.findUnique({ where: { code: data.code } })
    if (existing) return NextResponse.json({ success: false, error: 'A coupon with this code already exists' }, { status: 409 })

    const coupon = await prisma.coupon.create({
      data: { ...data, expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined },
    })
    return NextResponse.json({ success: true, data: coupon }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to create coupon' }, { status: 500 })
  }
}
