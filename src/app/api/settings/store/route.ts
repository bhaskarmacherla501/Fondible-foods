import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getStoreSettings } from '@/lib/settings'
import { z } from 'zod'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) return null
  return session
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const settings = await getStoreSettings()
  return NextResponse.json({ success: true, data: settings })
}

const updateSchema = z.object({
  supportPhone:          z.string().min(3).optional(),
  supportEmail:          z.string().email().optional(),
  whatsappNumber:        z.string().min(6).optional(),
  address:               z.string().min(2).optional(),
  shippingFee:           z.number().min(0).optional(),
  freeShippingThreshold: z.number().min(0).optional(),
  taxRate:               z.number().min(0).max(1).optional(),
  instagramUrl:          z.string().optional(),
  facebookUrl:           z.string().optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const data     = updateSchema.parse(await req.json())
    const existing = await getStoreSettings()
    const settings = await prisma.storeSetting.update({ where: { id: existing.id }, data })
    return NextResponse.json({ success: true, data: settings })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to update store settings' }, { status: 500 })
  }
}
