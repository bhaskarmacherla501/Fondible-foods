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
  const blog = await prisma.blog.findUnique({ where: { id } })
  if (!blog) return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: blog })
}

const updateSchema = z.object({
  title:       z.string().min(3).optional(),
  excerpt:     z.string().optional(),
  content:     z.string().min(10).optional(),
  coverImage:  z.string().optional(),
  category:    z.string().optional(),
  authorName:  z.string().optional(),
  tags:        z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  seoTitle:    z.string().optional(),
  seoDesc:     z.string().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const data = updateSchema.parse(await req.json())
    const existing = await prisma.blog.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })

    const blog = await prisma.blog.update({
      where: { id },
      data:  {
        ...data,
        publishedAt: data.isPublished && !existing.publishedAt ? new Date() : undefined,
      },
    })
    return NextResponse.json({ success: true, data: blog })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.blog.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
