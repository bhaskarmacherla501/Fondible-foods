import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import prisma from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = { title: 'Products | Fondible Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams

  const products = await prisma.product.findMany({
    where:   search ? { name: { contains: search, mode: 'insensitive' } } : {},
    include: { category: true, variants: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brown">Products</h1>
          <p className="text-sm text-brown/60 mt-1">{products.length} products</p>
        </div>
        <form action="/admin/products" method="get" className="relative">
          <Search className="w-4 h-4 text-brown/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" name="search" defaultValue={search} placeholder="Search products..."
            className="input-base pl-9 py-2 text-sm w-64" />
        </form>
      </div>

      <div className="card-base overflow-hidden">
        <div className="divide-y divide-cream-dark">
          {products.map(product => {
            const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
            const minPrice = Math.min(...product.variants.map(v => v.price), Infinity)
            return (
              <Link key={product.id} href={`/admin/products/${product.id}`}
                className="flex items-center gap-4 p-4 hover:bg-cream/60 transition-colors">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                  {product.images[0] && <Image src={product.images[0]} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brown truncate">{product.name}</p>
                  <p className="text-xs text-brown/50">{product.category.name}</p>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0 text-sm">
                  <span className="text-brown/70 w-16 text-right">{Number.isFinite(minPrice) ? formatPrice(minPrice) : '—'}</span>
                  <span className={`w-20 text-right ${totalStock <= 10 ? 'text-red-600 font-semibold' : 'text-brown/70'}`}>{totalStock} in stock</span>
                  <div className="flex gap-1.5 w-32 justify-end">
                    {product.isFeatured && <span className="badge-gold">Featured</span>}
                    {product.isBestseller && <span className="badge-green">Bestseller</span>}
                  </div>
                  <span className={`badge ${product.isActive ? 'badge-green' : 'bg-gray-100 text-gray-600'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
