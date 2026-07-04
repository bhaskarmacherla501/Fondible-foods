import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronLeft, Check } from 'lucide-react'
import { auth } from '@/lib/auth'
import { OrderService } from '@/services/order.service'
import { formatPrice, formatDateTime, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params
  const order = await OrderService.getById(id, session!.user.id)
  if (!order) notFound()

  return (
    <div>
      <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-sm text-brown/60 hover:text-gold mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brown">{order.orderNumber}</h1>
          <p className="text-sm text-brown/50">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <span className={`badge ${ORDER_STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Items */}
          <div className="card-base p-6">
            <h2 className="font-semibold text-brown mb-4">Items</h2>
            <ul className="space-y-4">
              {order.items.map(item => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                    {item.image && <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brown">{item.name}</p>
                    <p className="text-xs text-brown/50">Qty {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="text-sm font-semibold text-brown">{formatPrice(item.total)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div className="card-base p-6">
            <h2 className="font-semibold text-brown mb-4">Order Timeline</h2>
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
        </div>

        <div className="space-y-6">
          {/* Address */}
          <div className="card-base p-6">
            <h2 className="font-semibold text-brown mb-3">Delivery Address</h2>
            <p className="text-sm text-brown/70">{order.address.name}</p>
            <p className="text-sm text-brown/60">{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}, {order.address.city}, {order.address.state} — {order.address.pincode}</p>
            <p className="text-sm text-brown/50 mt-1">{order.address.phone}</p>
          </div>

          {/* Summary */}
          <div className="card-base p-6">
            <h2 className="font-semibold text-brown mb-3">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-brown/70"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-700"><span>Discount</span><span>−{formatPrice(order.discountAmount)}</span></div>
              )}
              <div className="flex justify-between text-brown/70"><span>Shipping</span><span>{order.shippingAmount === 0 ? 'FREE' : formatPrice(order.shippingAmount)}</span></div>
              <div className="flex justify-between font-bold text-brown pt-2 border-t border-cream-dark"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
            <p className="text-xs text-brown/50 mt-3">Payment Method: {order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
