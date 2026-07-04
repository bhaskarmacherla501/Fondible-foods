'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Cart } from '@/types'

const SHIPPING_THRESHOLD = 499
const SHIPPING_COST      = 49
const TAX_RATE           = 0 // GST included in price

interface CartStore extends Cart {
  addItem:      (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeItem:   (productId: string, variantId: string) => void
  updateQty:    (productId: string, variantId: string, qty: number) => void
  clearCart:    () => void
  applyCoupon:  (code: string, discount: number) => void
  removeCoupon: () => void
  isInCart:     (productId: string, variantId: string) => boolean
  getItemQty:   (productId: string, variantId: string) => number
  itemCount:    number
}

function computeTotals(items: CartItem[], discountAmount: number, couponCode?: string) {
  const subtotal       = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shippingAmount = subtotal >= SHIPPING_THRESHOLD ? 0 : (items.length > 0 ? SHIPPING_COST : 0)
  const taxAmount      = Math.round(subtotal * TAX_RATE)
  const total          = Math.max(0, subtotal - discountAmount + shippingAmount + taxAmount)
  return { subtotal, shippingAmount, taxAmount, total }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items:          [],
      subtotal:       0,
      discountAmount: 0,
      couponCode:     undefined,
      shippingAmount: 0,
      taxAmount:      0,
      total:          0,
      itemCount:      0,

      addItem(item, qty = 1) {
        set(state => {
          const existing = state.items.find(
            i => i.productId === item.productId && i.variantId === item.variantId
          )
          const items = existing
            ? state.items.map(i =>
                i.productId === item.productId && i.variantId === item.variantId
                  ? { ...i, quantity: Math.min(i.quantity + qty, i.stock) }
                  : i
              )
            : [...state.items, { ...item, quantity: Math.min(qty, item.stock) }]

          const totals   = computeTotals(items, state.discountAmount, state.couponCode)
          const itemCount = items.reduce((s, i) => s + i.quantity, 0)
          return { items, itemCount, ...totals }
        })
      },

      removeItem(productId, variantId) {
        set(state => {
          const items     = state.items.filter(i => !(i.productId === productId && i.variantId === variantId))
          const totals    = computeTotals(items, state.discountAmount, state.couponCode)
          const itemCount = items.reduce((s, i) => s + i.quantity, 0)
          return { items, itemCount, ...totals }
        })
      },

      updateQty(productId, variantId, qty) {
        set(state => {
          const items = qty <= 0
            ? state.items.filter(i => !(i.productId === productId && i.variantId === variantId))
            : state.items.map(i =>
                i.productId === productId && i.variantId === variantId
                  ? { ...i, quantity: Math.min(qty, i.stock) }
                  : i
              )
          const totals    = computeTotals(items, state.discountAmount, state.couponCode)
          const itemCount = items.reduce((s, i) => s + i.quantity, 0)
          return { items, itemCount, ...totals }
        })
      },

      clearCart() {
        set({ items: [], subtotal: 0, discountAmount: 0, couponCode: undefined,
              shippingAmount: 0, taxAmount: 0, total: 0, itemCount: 0 })
      },

      applyCoupon(code, discount) {
        set(state => {
          const totals = computeTotals(state.items, discount, code)
          return { couponCode: code, discountAmount: discount, ...totals }
        })
      },

      removeCoupon() {
        set(state => {
          const totals = computeTotals(state.items, 0)
          return { couponCode: undefined, discountAmount: 0, ...totals }
        })
      },

      isInCart(productId, variantId) {
        return get().items.some(i => i.productId === productId && i.variantId === variantId)
      },

      getItemQty(productId, variantId) {
        return get().items.find(i => i.productId === productId && i.variantId === variantId)?.quantity ?? 0
      },
    }),
    {
      name:    'fondible-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
