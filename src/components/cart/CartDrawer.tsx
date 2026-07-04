'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag, Trash2, Tag, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart.store'
import { formatPrice, buildWASupportMessage } from '@/lib/utils'
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

  const chatWithSupport = () => {
    window.open(`https://wa.me/918019730055?text=${buildWASupportMessage()}`, '_blank')
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
                  <p className="flex items-center justify-center gap-1.5 text-xs text-brown/50">
                    <Lock className="w-3 h-3" /> Secure checkout · Razorpay · UPI · Cards · COD
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={clearCart} className="text-center text-xs text-brown/40 hover:text-red-500 transition-colors">
                    Clear cart
                  </button>
                  <button onClick={chatWithSupport} className="text-xs text-brown/50 hover:text-gold transition-colors">
                    Questions about your order? Chat with us →
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
