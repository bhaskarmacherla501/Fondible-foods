'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Star } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { formatPrice } from '@/lib/utils'

interface ProductCardData {
  id: string
  name: string
  slug: string
  shortDesc?: string | null
  images: string[]
  isBestseller: boolean
  isNew: boolean
  averageRating: number
  reviewCount: number
  variants: { id: string; name: string; price: number; stock: number }[]
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const addItem = useCartStore(s => s.addItem)
  const variant = product.variants[0]

  return (
    <div className="card-base card-hover overflow-hidden group">
      <Link href={`/shop/${product.slug}`} className="block relative aspect-square bg-cream-dark overflow-hidden">
        {product.images[0] && (
          <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
        {product.isBestseller && <span className="badge-gold absolute top-3 left-3">Bestseller</span>}
        {product.isNew && <span className="badge-brown absolute top-3 right-3">New</span>}
      </Link>
      <div className="p-5">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-semibold text-brown mb-1">{product.name}</h3>
        </Link>
        {product.shortDesc && <p className="text-sm text-brown/60 mb-3 line-clamp-2">{product.shortDesc}</p>}
        <div className="flex items-center gap-1 mb-3 text-xs text-brown/50">
          <Star className="w-3.5 h-3.5 text-gold fill-gold" />
          {product.averageRating.toFixed(1)} ({product.reviewCount})
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-semibold text-brown">
            {variant ? formatPrice(variant.price) : '—'}
          </span>
          {variant && (
            <button
              onClick={() => addItem({
                productId: product.id, variantId: variant.id, name: product.name,
                variantName: variant.name, price: variant.price,
                image: product.images[0] ?? '', stock: variant.stock,
              })}
              disabled={variant.stock <= 0}
              className="p-2.5 rounded-xl bg-brown text-cream hover:bg-gold transition-colors disabled:opacity-40 disabled:hover:bg-brown"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
        {variant && variant.stock <= 0 && (
          <p className="text-xs text-red-500 mt-2">Out of stock</p>
        )}
      </div>
    </div>
  )
}
