import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { validatePincode, validatePhone } from '@/lib/utils'
import { z } from 'zod'

const addressSchema = z.object({
  label:     z.string().default('Home'),
  name:      z.string().min(2),
  phone:     z.string().refine(validatePhone, 'Invalid phone number'),
  line1:     z.string().min(3),
  line2:     z.string().optional(),
  city:      z.string().min(2),
  state:     z.string().min(2),
  pincode:   z.string().refine(validatePincode, 'Invalid pincode'),
  isDefault: z.boolean().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const addresses = await prisma.address.findMany({
    where:   { userId: session.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json({ success: true, data: addresses })
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const data = addressSchema.parse(await req.json())

    if (data.isDefault) {
      await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } })
    }

    const existingCount = await prisma.address.count({ where: { userId: session.user.id } })

    const address = await prisma.address.create({
      data: { ...data, userId: session.user.id, isDefault: data.isDefault ?? existingCount === 0 },
    })

    return NextResponse.json({ success: true, data: address }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to save address' }, { status: 500 })
  }
}
