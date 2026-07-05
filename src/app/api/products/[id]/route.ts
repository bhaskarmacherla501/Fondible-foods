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
  const { id } = await params
  const product = await prisma.product.findUnique({
    where:   { id },
    include: { category: true, variants: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: product })
}

const updateSchema = z.object({
  name:         z.string().min(2).optional(),
  shortDesc:    z.string().optional(),
  isActive:     z.boolean().optional(),
  isFeatured:   z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isNew:        z.boolean().optional(),
  seoTitle:     z.string().optional(),
  seoDesc:      z.string().optional(),
  variant: z.object({
    id:    z.string(),
    price: z.number().positive().optional(),
    stock: z.number().int().min(0).optional(),
  }).optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { variant, ...productFields } = updateSchema.parse(await req.json())

    if (Object.keys(productFields).length > 0) {
      await prisma.product.update({ where: { id }, data: productFields })
    }
    if (variant) {
      const { id: variantId, ...variantFields } = variant
      await prisma.productVariant.update({ where: { id: variantId }, data: variantFields })
    }

    const updated = await prisma.product.findUnique({
      where: { id }, include: { category: true, variants: { orderBy: { sortOrder: 'asc' } } },
    })
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.product.update({ where: { id }, data: { isActive: false } })
  return NextResponse.json({ success: true })
}
