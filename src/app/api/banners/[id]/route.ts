import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) return null
  return session
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const banner = await prisma.banner.findUnique({ where: { id } })
  if (!banner) return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: banner })
}

const updateSchema = z.object({
  title:       z.string().min(2).optional(),
  subtitle:    z.string().optional(),
  image:       z.string().min(1).optional(),
  mobileImage: z.string().optional(),
  link:        z.string().optional(),
  sortOrder:   z.number().int().optional(),
  startsAt:    z.string().optional(),
  endsAt:      z.string().optional(),
  isActive:    z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const data = updateSchema.parse(await req.json())
    const banner = await prisma.banner.update({
      where: { id },
      data:  {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        endsAt:   data.endsAt ? new Date(data.endsAt) : undefined,
      },
    })
    return NextResponse.json({ success: true, data: banner })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to update banner' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.banner.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
