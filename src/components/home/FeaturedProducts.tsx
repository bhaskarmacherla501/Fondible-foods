'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Star } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { formatPrice } from '@/lib/utils'

interface FeaturedProduct {
  id: string
  name: string
  slug: string
  shortDesc: string | null
  images: string[]
  isBestseller: boolean
  isNew: boolean
  averageRating: number
  reviewCount: number
  variants: { id: string; name: string; price: number; stock: number }[]
}

export function FeaturedProducts({ products }: { products: FeaturedProduct[] }) {
  const addItem = useCartStore(s => s.addItem)

  if (products.length === 0) return null

  return (
    <section className="page-container py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="section-label">Bestsellers</span>
        <h2 className="section-title text-brown mt-2">Our Featured Cookies</h2>
      </div>

      <div className="product-grid">
        {products.map(p => {
          const variant = p.variants[0]
          return (
            <div key={p.id} className="card-base card-hover overflow-hidden group">
              <Link href={`/shop/${p.slug}`} className="block relative aspect-square bg-cream-dark overflow-hidden">
                {p.images[0] && (
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                {p.isBestseller && <span className="badge-gold absolute top-3 left-3">Bestseller</span>}
                {p.isNew && <span className="badge-brown absolute top-3 right-3">New</span>}
              </Link>
              <div className="p-5">
                <Link href={`/shop/${p.slug}`}>
                  <h3 className="product-card-title text-brown mb-1">{p.name}</h3>
                </Link>
                {p.shortDesc && <p className="product-card-meta text-brown/60 mb-3 line-clamp-2">{p.shortDesc}</p>}
                <div className="flex items-center gap-1 mb-3 text-xs text-brown/50">
                  <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                  {p.averageRating.toFixed(1)} ({p.reviewCount})
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl font-semibold text-brown">
                    {variant ? formatPrice(variant.price) : '—'}
                  </span>
                  {variant && (
                    <button
                      onClick={() => addItem({
                        productId: p.id, variantId: variant.id, name: p.name,
                        variantName: variant.name, price: variant.price,
                        image: p.images[0] ?? '', stock: variant.stock,
                      })}
                      className="p-2.5 rounded-xl bg-brown text-cream hover:bg-gold transition-colors"
                      aria-label={`Add ${p.name} to cart`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center mt-12">
        <Link href="/shop" className="btn-secondary">View All Products</Link>
      </div>
    </section>
  )
}
