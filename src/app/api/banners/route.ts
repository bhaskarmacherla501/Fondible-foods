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
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json({ success: true, data: banners })
}

const createSchema = z.object({
  title:       z.string().min(2),
  subtitle:    z.string().optional(),
  image:       z.string().min(1),
  mobileImage: z.string().optional(),
  link:        z.string().optional(),
  sortOrder:   z.number().int().optional(),
  startsAt:    z.string().optional(),
  endsAt:      z.string().optional(),
  isActive:    z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const data = createSchema.parse(await req.json())
    const banner = await prisma.banner.create({
      data: {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        endsAt:   data.endsAt ? new Date(data.endsAt) : undefined,
      },
    })
    return NextResponse.json({ success: true, data: banner }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to create banner' }, { status: 500 })
  }
}
