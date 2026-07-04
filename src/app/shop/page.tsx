import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductService } from '@/services/product.service'
import prisma from '@/lib/prisma'
import { ProductCard } from '@/components/shop/ProductCard'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title:       'Shop — Whole Ingredient Cookies',
  description: 'Shop Fondible cookies — baked with whole wheat, real butter, whole nuts and jaggery. No refined sugar, no artificial ingredients.',
  alternates:  { canonical: 'https://fondible.in/shop' },
}

const PAGE_SIZE = 12

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { category, page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1') || 1)

  const [categories, { products, pagination }] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    ProductService.getAll({ page, limit: PAGE_SIZE, category }),
  ])

  return (
    <div className="page-container py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="section-label">Our Cookies</span>
        <h1 className="section-title text-brown mt-2">Shop Whole Ingredient Cookies</h1>
        <p className="mt-4 text-brown/70">Real butter. Whole wheat. Jaggery only. No maida, ever.</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <Link href="/shop"
          className={cn('badge', !category ? 'bg-brown text-cream' : 'bg-gold/10 text-brown/70 hover:bg-gold/15')}>
          All Cookies
        </Link>
        {categories.map(cat => (
          <Link key={cat.id} href={`/shop?category=${cat.slug}`}
            className={cn('badge', category === cat.slug ? 'bg-brown text-cream' : 'bg-gold/10 text-brown/70 hover:bg-gold/15')}>
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brown/60">No cookies found in this category yet.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <Link
            href={`/shop?${new URLSearchParams({ ...(category ? { category } : {}), page: String(page - 1) })}`}
            aria-disabled={!pagination.hasPrev}
            className={cn('btn-secondary', !pagination.hasPrev && 'pointer-events-none opacity-40')}
          >
            Previous
          </Link>
          <span className="text-sm text-brown/60">Page {pagination.page} of {pagination.totalPages}</span>
          <Link
            href={`/shop?${new URLSearchParams({ ...(category ? { category } : {}), page: String(page + 1) })}`}
            aria-disabled={!pagination.hasNext}
            className={cn('btn-secondary', !pagination.hasNext && 'pointer-events-none opacity-40')}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  )
}
