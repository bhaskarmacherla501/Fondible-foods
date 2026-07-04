import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) return null
  return session
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const search = req.nextUrl.searchParams.get('search')
  const blogs = await prisma.blog.findMany({
    where:   search ? { title: { contains: search, mode: 'insensitive' } } : {},
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ success: true, data: blogs })
}

const createSchema = z.object({
  title:       z.string().min(3),
  excerpt:     z.string().optional(),
  content:     z.string().min(10),
  coverImage:  z.string().optional(),
  category:    z.string().optional(),
  authorName:  z.string().optional(),
  tags:        z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const data = createSchema.parse(await req.json())
    const slug = slugify(data.title)
    const existing = await prisma.blog.findUnique({ where: { slug } })
    if (existing) return NextResponse.json({ success: false, error: 'A post with this title already exists' }, { status: 409 })

    const blog = await prisma.blog.create({
      data: {
        ...data, slug,
        tags: data.tags ?? [],
        publishedAt: data.isPublished ? new Date() : null,
      },
    })
    return NextResponse.json({ success: true, data: blog }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 })
  }
}
