'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { formatPrice } from '@/lib/utils'

interface WishlistItemData {
  id: string
  product: {
    id: string
    name: string
    slug: string
    images: string[]
    variant: { id: string; name: string; price: number; stock: number } | null
  }
}

export function WishlistClient({ items }: { items: WishlistItemData[] }) {
  const router = useRouter()
  const addItem = useCartStore(s => s.addItem)

  const handleRemove = async (id: string) => {
    const res  = await fetch(`/api/wishlist/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!data.success) { toast.error(data.error ?? 'Failed to remove'); return }
    toast.success('Removed from wishlist')
    router.refresh()
  }

  const handleAddToCart = (item: WishlistItemData) => {
    if (!item.product.variant) return
    addItem({
      productId: item.product.id, variantId: item.product.variant.id, name: item.product.name,
      variantName: item.product.variant.name, price: item.product.variant.price,
      image: item.product.images[0] ?? '', stock: item.product.variant.stock,
    })
    toast.success(`${item.product.name} added to cart`)
  }

  return (
    <div className="product-grid">
      {items.map(item => (
        <div key={item.id} className="card-base overflow-hidden">
          <Link href={`/shop/${item.product.slug}`} className="block relative aspect-square bg-cream-dark">
            {item.product.images[0] && (
              <Image src={item.product.images[0]} alt={item.product.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            )}
          </Link>
          <div className="p-5">
            <Link href={`/shop/${item.product.slug}`}>
              <h3 className="product-card-title text-brown mb-2">{item.product.name}</h3>
            </Link>
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-brown">
                {item.product.variant ? formatPrice(item.product.variant.price) : '—'}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleAddToCart(item)} disabled={!item.product.variant || item.product.variant.stock <= 0}
                  className="p-2.5 rounded-xl bg-brown text-cream hover:bg-gold transition-colors disabled:opacity-40">
                  <ShoppingBag className="w-4 h-4" />
                </button>
                <button onClick={() => handleRemove(item.id)} className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
