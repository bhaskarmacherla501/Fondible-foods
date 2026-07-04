'use client'
import { useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Loader2, Search, Check, Package } from 'lucide-react'
import { formatPrice, formatDateTime, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'

interface TrackedOrder {
  id: string
  orderNumber: string
  status: string
  paymentMethod: string
  total: number
  createdAt: string
  expectedDelivery: string | null
  items: { id: string; name: string; image: string | null; quantity: number; total: number }[]
  address: { city: string; state: string; pincode: string }
  timeline: { id: string; status: string; note: string | null; createdAt: string }[]
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [order, setOrder]             = useState<TrackedOrder | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setOrder(null)
    try {
      const res  = await fetch('/api/orders/track', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, phone }),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Order not found'); return }
      setOrder(data.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="section-label">Track Your Order</span>
        <h1 className="section-title text-brown mt-2">Where&apos;s My Order?</h1>
        <p className="mt-4 text-brown/70">Enter your order number and the phone number used at checkout.</p>
      </div>

      <form onSubmit={handleTrack} className="max-w-md mx-auto card-base p-6 space-y-4 mb-10">
        <input required placeholder="Order number (e.g. FND-XXXXX-XXX)" value={orderNumber}
          onChange={e => setOrderNumber(e.target.value)} className="input-base" />
        <input required placeholder="Phone number" value={phone}
          onChange={e => setPhone(e.target.value)} className="input-base" />
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Track Order
        </button>
      </form>

      {order && (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-brown">{order.orderNumber}</h2>
              <p className="text-sm text-brown/50">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
            <span className={`badge ${ORDER_STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
              {ORDER_STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="card-base p-6">
                <h3 className="font-semibold text-brown mb-4">Order Timeline</h3>
                <ul className="space-y-4">
                  {order.timeline.map(t => (
                    <li key={t.id} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brown">{ORDER_STATUS_LABELS[t.status] ?? t.status}</p>
                        {t.note && <p className="text-xs text-brown/50">{t.note}</p>}
                        <p className="text-xs text-brown/40">{formatDateTime(t.createdAt)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-base p-6">
                <h3 className="font-semibold text-brown mb-3 flex items-center gap-2"><Package className="w-4 h-4 text-gold" /> Delivering To</h3>
                <p className="text-sm text-brown/70">{order.address.city}, {order.address.state} — {order.address.pincode}</p>
                {order.expectedDelivery && (
                  <p className="text-sm text-brown/50 mt-1">Expected by {formatDateTime(order.expectedDelivery)}</p>
                )}
              </div>
            </div>

            <div className="card-base p-6">
              <h3 className="font-semibold text-brown mb-4">Items</h3>
              <ul className="space-y-4 mb-4">
                {order.items.map(item => (
                  <li key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                      {item.image && <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brown truncate">{item.name}</p>
                      <p className="text-xs text-brown/50">Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-brown">{formatPrice(item.total)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold text-brown pt-3 border-t border-cream-dark">
                <span>Total</span><span>{formatPrice(order.total)}</span>
              </div>
              <p className="text-xs text-brown/50 mt-2">Payment Method: {order.paymentMethod}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
