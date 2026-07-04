import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { validatePhone } from '@/lib/utils'
import { z } from 'zod'

const updateSchema = z.object({
  name:  z.string().min(2),
  phone: z.string().optional().refine(v => !v || validatePhone(v), 'Invalid phone number'),
})

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { name, phone } = updateSchema.parse(await req.json())

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data:  { name, ...(phone ? { phone } : {}) },
    })

    return NextResponse.json({ success: true, data: { name: user.name, phone: user.phone } })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
}
