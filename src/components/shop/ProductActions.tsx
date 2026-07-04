'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cart.store'
import { formatPrice, buildWAOrderMessage } from '@/lib/utils'

interface Variant {
  id: string
  name: string
  price: number
  comparePrice: number | null
  stock: number
}

export function ProductActions({
  productId, productName, image, variants,
}: {
  productId: string
  productName: string
  image: string
  variants: Variant[]
}) {
  const router = useRouter()
  const [variantId, setVariantId] = useState(variants[0]?.id)
  const [qty, setQty] = useState(1)
  const addItem = useCartStore(s => s.addItem)

  const variant = variants.find(v => v.id === variantId) ?? variants[0]
  if (!variant) return <p className="text-sm text-red-500">Currently unavailable</p>

  const outOfStock = variant.stock <= 0

  const handleAddToCart = () => {
    addItem({
      productId, variantId: variant.id, name: productName,
      variantName: variant.name, price: variant.price, image, stock: variant.stock,
    }, qty)
    toast.success(`${productName} added to cart`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  const handleWhatsAppOrder = () => {
    const msg = buildWAOrderMessage([{ name: `${productName} (${variant.name})`, quantity: qty, price: variant.price }], variant.price * qty)
    window.open(`https://wa.me/918019730055?text=${msg}`, '_blank')
  }

  return (
    <div>
      {/* Variant selector */}
      {variants.length > 1 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-brown mb-2">Pack Size</p>
          <div className="flex flex-wrap gap-2">
            {variants.map(v => (
              <button key={v.id} onClick={() => setVariantId(v.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  v.id === variant.id
                    ? 'bg-brown text-cream border-brown'
                    : 'bg-white text-brown/70 border-brown/15 hover:border-gold'
                }`}>
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-display text-3xl font-semibold text-brown">{formatPrice(variant.price)}</span>
        {variant.comparePrice && variant.comparePrice > variant.price && (
          <span className="text-brown/40 line-through text-lg">{formatPrice(variant.comparePrice)}</span>
        )}
      </div>

      {outOfStock ? (
        <p className="text-sm font-semibold text-red-500 mb-6">Out of stock</p>
      ) : (
        <>
          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-brown mb-2">Quantity</p>
            <div className="inline-flex items-center gap-2 bg-white rounded-xl border border-brown/15">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-3 hover:bg-cream rounded-l-xl transition-colors">
                <Minus className="w-4 h-4 text-brown" />
              </button>
              <span className="text-sm font-bold text-brown w-8 text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(variant.stock, q + 1))} className="p-3 hover:bg-cream rounded-r-xl transition-colors">
                <Plus className="w-4 h-4 text-brown" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleAddToCart} className="btn-secondary">
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="btn-primary">
              Buy Now
            </button>
            <button onClick={handleWhatsAppOrder} className="btn-wa">
              Order on WhatsApp
            </button>
          </div>
        </>
      )}
    </div>
  )
}
