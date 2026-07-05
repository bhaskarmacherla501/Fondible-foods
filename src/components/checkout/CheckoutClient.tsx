'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, MapPin, Tag, Plus } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { formatPrice, validatePincode, validatePhone } from '@/lib/utils'

interface Address {
  id: string
  label: string
  name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

const emptyAddressForm = { label: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' }

export function CheckoutClient({ addresses, razorpayKeyId }: { addresses: Address[]; razorpayKeyId: string }) {
  const router = useRouter()
  const { items, subtotal, discountAmount, couponCode, shippingAmount, taxAmount, total, applyCoupon, removeCoupon, clearCart } = useCartStore()

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(addresses[0]?.id ?? null)
  const [addingNew, setAddingNew] = useState(addresses.length === 0)
  const [addressForm, setAddressForm] = useState(emptyAddressForm)

  const [couponInput, setCouponInput] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD')
  const [placingOrder, setPlacingOrder] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setApplyingCoupon(true)
    try {
      const res  = await fetch('/api/coupons/validate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Invalid coupon'); return }
      applyCoupon(data.data.code, data.data.discount)
      toast.success(`Coupon applied: ${data.data.description ?? data.data.code}`)
    } finally {
      setApplyingCoupon(false)
    }
  }

  const resolveAddressId = async (): Promise<string | null> => {
    if (!addingNew) return selectedAddressId

    if (!addressForm.name || !validatePhone(addressForm.phone) || !addressForm.line1 ||
        !addressForm.city || !addressForm.state || !validatePincode(addressForm.pincode)) {
      toast.error('Please fill in a valid delivery address')
      return null
    }

    const res  = await fetch('/api/addresses', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressForm),
    })
    const data = await res.json()
    if (!data.success) { toast.error(data.error ?? 'Failed to save address'); return null }
    return data.data.id as string
  }

  const placeOrder = async (addressId: string) => {
    const res  = await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        addressId,
        items: items.map(i => ({
          productId: i.productId, variantId: i.variantId, name: i.name,
          variantName: i.variantName, price: i.price, image: i.image,
          quantity: i.quantity, stock: i.stock,
        })),
        paymentMethod,
        couponCode,
        subtotal, discountAmount, shippingAmount, taxAmount, total,
      }),
    })
    const data = await res.json()
    if (!data.success) { toast.error(data.error ?? 'Failed to place order'); return null }
    return data.data as { id: string; orderNumber: string; total: number }
  }

  const payWithRazorpay = (order: { id: string; orderNumber: string; total: number }, addressId: string) => {
    fetch('/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id }),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          toast.error('Online payment isn\'t available right now — please choose Cash on Delivery')
          return
        }
        const rzp = new window.Razorpay({
          key: data.data.keyId, amount: data.data.amount, currency: data.data.currency,
          order_id: data.data.razorpayOrderId, name: 'Fondible',
          description: `Order ${order.orderNumber}`,
          theme: { color: '#2C1810' },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            const verifyRes = await fetch('/api/payments', {
              method: 'PATCH', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()
            if (!verifyData.success) { toast.error('Payment verification failed'); return }
            clearCart()
            router.push(`/checkout/success?order=${order.orderNumber}`)
          },
        })
        rzp.open()
      })
      .catch(() => toast.error('Online payment isn\'t available right now — please choose Cash on Delivery'))
  }

  const handlePlaceOrder = async () => {
    if (items.length === 0) return
    setPlacingOrder(true)
    try {
      const addressId = await resolveAddressId()
      if (!addressId) return

      const order = await placeOrder(addressId)
      if (!order) return

      if (paymentMethod === 'RAZORPAY') {
        payWithRazorpay(order, addressId)
      } else {
        clearCart()
        router.push(`/checkout/success?order=${order.orderNumber}`)
      }
    } finally {
      setPlacingOrder(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <p className="text-brown/60 mb-6">Your cart is empty — add some cookies before checking out.</p>
        <Link href="/shop" className="btn-primary">Shop Now</Link>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {razorpayKeyId && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}

      {/* Left: address + payment */}
      <div className="lg:col-span-2 space-y-6">
        {/* Address */}
        <div className="card-base p-6">
          <h2 className="font-display text-xl font-semibold text-brown mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold" /> Delivery Address
          </h2>

          {addresses.length > 0 && !addingNew && (
            <div className="space-y-3 mb-4">
              {addresses.map(addr => (
                <label key={addr.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    selectedAddressId === addr.id ? 'border-gold bg-gold/5' : 'border-brown/10 hover:border-gold/40'
                  }`}>
                  <input type="radio" name="address" className="mt-1 accent-[#C8820A]"
                    checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} />
                  <div className="text-sm">
                    <p className="font-semibold text-brown">{addr.name} <span className="badge-gold ml-2">{addr.label}</span></p>
                    <p className="text-brown/60">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} — {addr.pincode}</p>
                    <p className="text-brown/50">{addr.phone}</p>
                  </div>
                </label>
              ))}
              <button onClick={() => setAddingNew(true)} className="text-sm text-gold font-semibold flex items-center gap-1 hover:underline">
                <Plus className="w-4 h-4" /> Add a new address
              </button>
            </div>
          )}

          {addingNew && (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input placeholder="Full name" value={addressForm.name} className="input-base"
                  onChange={e => setAddressForm(f => ({ ...f, name: e.target.value }))} />
                <input placeholder="Phone number" value={addressForm.phone} className="input-base"
                  onChange={e => setAddressForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <input placeholder="Address line 1" value={addressForm.line1} className="input-base"
                onChange={e => setAddressForm(f => ({ ...f, line1: e.target.value }))} />
              <input placeholder="Address line 2 (optional)" value={addressForm.line2} className="input-base"
                onChange={e => setAddressForm(f => ({ ...f, line2: e.target.value }))} />
              <div className="grid sm:grid-cols-3 gap-3">
                <input placeholder="City" value={addressForm.city} className="input-base"
                  onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))} />
                <input placeholder="State" value={addressForm.state} className="input-base"
                  onChange={e => setAddressForm(f => ({ ...f, state: e.target.value }))} />
                <input placeholder="Pincode" value={addressForm.pincode} className="input-base"
                  onChange={e => setAddressForm(f => ({ ...f, pincode: e.target.value }))} />
              </div>
              {addresses.length > 0 && (
                <button onClick={() => setAddingNew(false)} className="text-xs text-brown/50 hover:text-gold">
                  Cancel — use a saved address
                </button>
              )}
            </div>
          )}
        </div>

        {/* Payment method */}
        <div className="card-base p-6">
          <h2 className="font-display text-xl font-semibold text-brown mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
              paymentMethod === 'COD' ? 'border-gold bg-gold/5' : 'border-brown/10 hover:border-gold/40'
            }`}>
              <input type="radio" name="payment" className="accent-[#C8820A]" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
              <span className="text-sm font-semibold text-brown">Cash on Delivery</span>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
              paymentMethod === 'RAZORPAY' ? 'border-gold bg-gold/5' : 'border-brown/10 hover:border-gold/40'
            }`}>
              <input type="radio" name="payment" className="accent-[#C8820A]" checked={paymentMethod === 'RAZORPAY'} onChange={() => setPaymentMethod('RAZORPAY')} />
              <span className="text-sm font-semibold text-brown">Pay Online (UPI / Card / Wallet)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Right: order summary */}
      <div>
        <div className="card-base p-6 sticky top-28">
          <h2 className="font-display text-xl font-semibold text-brown mb-4">Order Summary</h2>
          <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {items.map(item => (
              <li key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0 text-sm">
                  <p className="font-medium text-brown truncate">{item.name}</p>
                  <p className="text-xs text-brown/50">{item.variantName} × {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-brown">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          {/* Coupon */}
          <div className="mb-4">
            {couponCode ? (
              <div className="flex items-center justify-between text-sm bg-green-50 text-green-700 rounded-xl px-3 py-2">
                <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {couponCode} applied</span>
                <button onClick={removeCoupon} className="text-xs underline">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input placeholder="Coupon code" value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  className="input-base flex-1 text-sm" />
                <button onClick={handleApplyCoupon} disabled={applyingCoupon} className="btn-secondary text-sm px-4">
                  {applyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm border-t border-cream-dark pt-4">
            <div className="flex justify-between text-brown/70"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-700"><span>Discount</span><span>−{formatPrice(discountAmount)}</span></div>
            )}
            <div className="flex justify-between text-brown/70">
              <span>Shipping</span><span>{shippingAmount === 0 ? 'FREE' : formatPrice(shippingAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-brown pt-2 border-t border-cream-dark">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>

          <button onClick={handlePlaceOrder} disabled={placingOrder} className="btn-primary w-full justify-center mt-6">
            {placingOrder && <Loader2 className="w-4 h-4 animate-spin" />} Place Order
          </button>
        </div>
      </div>
    </div>
  )
}
