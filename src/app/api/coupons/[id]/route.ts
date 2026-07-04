import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) return null
  return session
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { isActive } = z.object({ isActive: z.boolean() }).parse(await req.json())
    const coupon = await prisma.coupon.update({ where: { id }, data: { isActive } })
    return NextResponse.json({ success: true, data: coupon })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to update coupon' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const usageCount = await prisma.couponUsage.count({ where: { couponId: id } })
  if (usageCount > 0) {
    // Preserve history — just deactivate rather than delete a coupon that's been used
    await prisma.coupon.update({ where: { id }, data: { isActive: false } })
    return NextResponse.json({ success: true, data: { deactivated: true } })
  }
  await prisma.coupon.delete({ where: { id } })
  return NextResponse.json({ success: true, data: { deleted: true } })
}
