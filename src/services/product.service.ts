import prisma from '@/lib/prisma'
import { getPaginationMeta } from '@/lib/utils'
import type { PaginationParams } from '@/types'

export class ProductService {
  static async getAll(params: PaginationParams & {
    category?: string
    featured?: boolean
    bestseller?: boolean
    minPrice?: number
    maxPrice?: number
    tags?: string[]
  }) {
    const { page = 1, limit = 12, search, sortBy = 'createdAt', sortOrder = 'desc',
      category, featured, bestseller, minPrice, maxPrice } = params

    const where: Record<string, unknown> = { isActive: true }
    if (search)     where.name        = { contains: search, mode: 'insensitive' }
    if (category)   where.category    = { slug: category }
    if (featured)   where.isFeatured  = true
    if (bestseller) where.isBestseller = true

    if (minPrice || maxPrice) {
      where.variants = {
        some: {
          isActive: true,
          price:    {
            ...(minPrice ? { gte: minPrice } : {}),
            ...(maxPrice ? { lte: maxPrice } : {}),
          },
        },
      }
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
          _count:   { select: { reviews: { where: { isApproved: true } } } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip:    (page - 1) * limit,
        take:    limit,
      }),
    ])

    return { products, pagination: getPaginationMeta(total, page, limit) }
  }

  static async getBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        reviews: {
          where:   { isApproved: true },
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
          take:    20,
        },
      },
    })
  }

  static async getRelated(productId: string, categoryId: string, limit = 4) {
    return prisma.product.findMany({
      where: { categoryId, isActive: true, id: { not: productId } },
      include: { variants: { where: { isActive: true }, take: 1, orderBy: { sortOrder: 'asc' } } },
      take: limit,
    })
  }

  static async create(data: {
    name: string; slug: string; shortDesc?: string; description?: string
    categoryId: string; images: string[]; tags: string[]
    healthBenefits: string[]; allergens: string[]; certifications: string[]
    ingredients?: string; storageInfo?: string; nutritionFacts?: object
    isFeatured?: boolean; isBestseller?: boolean; isNew?: boolean
    seoTitle?: string; seoDesc?: string; seoKeywords?: string[]
  }) {
    return prisma.product.create({ data, include: { category: true, variants: true } })
  }

  static async update(id: string, data: Partial<Parameters<typeof ProductService.create>[0]>) {
    return prisma.product.update({ where: { id }, data, include: { category: true, variants: true } })
  }

  static async delete(id: string) {
    return prisma.product.update({ where: { id }, data: { isActive: false } })
  }

  static async updateRating(productId: string) {
    const reviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    })
    if (!reviews.length) return
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    await prisma.product.update({
      where: { id: productId },
      data:  { averageRating: parseFloat(avg.toFixed(1)), reviewCount: reviews.length },
    })
  }

  static async checkVariantStock(variantId: string, quantity: number) {
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } })
    if (!variant) throw new Error('Variant not found')
    if (variant.stock < quantity) throw new Error(`Only ${variant.stock} units available`)
    return variant
  }

  static async decrementStock(variantId: string, quantity: number, orderId: string) {
    await prisma.$transaction([
      prisma.productVariant.update({
        where: { id: variantId },
        data:  { stock: { decrement: quantity } },
      }),
      prisma.inventory.create({
        data: { variantId, quantity: -quantity, type: 'out', reason: 'sale', reference: orderId },
      }),
    ])
  }
}
