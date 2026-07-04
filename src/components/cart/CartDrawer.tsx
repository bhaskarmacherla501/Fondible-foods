'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag, Trash2, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart.store'
import { formatPrice, buildWAOrderMessage } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function CartDrawer() {
  const { items, subtotal, discountAmount, couponCode, shippingAmount, total,
          updateQty, removeItem, clearCart, itemCount } = useCartStore()
  const open    = (useCartStore as unknown as { getState: () => { open?: boolean } }).getState().open ?? false
  const setOpen = (v: boolean) => useCartStore.setState({ open: v } as never)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const waCheckout = () => {
    const msg = buildWAOrderMessage(
      items.map(i => ({ name: `${i.name} (${i.variantName})`, quantity: i.quantity, price: i.price })),
      total
    )
    window.open(`https://wa.me/918019730055?text=${msg}`, '_blank')
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-brown/50 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white z-50 flex flex-col shadow-brand-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-dark">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brown" />
                <h2 className="font-display text-2xl font-semibold text-brown">Cookie Box</h2>
                {itemCount > 0 && (
                  <span className="badge badge-gold">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-cream transition-colors" aria-label="Close cart">
                <X className="w-5 h-5 text-brown" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center text-4xl">🍪</div>
                  <h3 className="font-display text-xl font-semibold text-brown">Your cookie box is empty</h3>
                  <p className="text-sm text-brown/60">Browse our freshly baked whole ingredient cookies and add your favourites</p>
                  <Link href="/shop" onClick={() => setOpen(false)} className="btn-primary">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map(item => (
                    <li key={`${item.productId}-${item.variantId}`}
                      className="flex gap-4 p-4 rounded-2xl bg-cream border border-cream-dark">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-cream-dark">
                        <Image src={item.image || '/images/placeholder.jpg'} alt={item.name}
                          width={64} height={64} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-brown truncate">{item.name}</p>
                        <p className="text-xs text-brown/60 mb-2">{item.variantName}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-white rounded-xl border border-cream-dark">
                            <button onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
                              className="p-1.5 hover:bg-cream rounded-l-xl transition-colors">
                              <Minus className="w-3 h-3 text-brown" />
                            </button>
                            <span className="text-sm font-bold text-brown w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="p-1.5 hover:bg-cream rounded-r-xl transition-colors disabled:opacity-40">
                              <Plus className="w-3 h-3 text-brown" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gold">{formatPrice(item.price * item.quantity)}</span>
                            <button onClick={() => removeItem(item.productId, item.variantId)}
                              className="p-1 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cream-dark px-6 py-5 space-y-4 bg-cream">
                {/* Shipping notice */}
                {shippingAmount === 0 ? (
                  <p className="text-xs text-center text-green-700 bg-green-50 rounded-full py-2 px-4">
                    🎉 You qualify for free shipping!
                  </p>
                ) : (
                  <p className="text-xs text-center text-brown/60">
                    Add {formatPrice(499 - subtotal)} more for free shipping
                  </p>
                )}

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-brown/70">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{couponCode}</span>
                      <span>−{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-brown/70">
                    <span>Shipping</span>
                    <span>{shippingAmount === 0 ? 'FREE' : formatPrice(shippingAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-brown pt-2 border-t border-cream-dark">
                    <span>Total</span><span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-2">
                  <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary w-full justify-center text-sm">
                    Proceed to Checkout
                  </Link>
                  <button onClick={waCheckout} className="btn-wa w-full justify-center text-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.552 4.116 1.515 5.849L.057 23.9a.5.5 0 00.611.611l6.051-1.458A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.806-.498-5.42-1.374l-.39-.22-4.04.975.997-3.965-.24-.383A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    Order on WhatsApp
                  </button>
                </div>
                <button onClick={clearCart} className="w-full text-center text-xs text-brown/40 hover:text-red-500 transition-colors">
                  Clear cart
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
