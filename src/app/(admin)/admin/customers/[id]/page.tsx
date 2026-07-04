import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, ChevronRight, Mail, Phone, Star, MapPin } from 'lucide-react'
import prisma from '@/lib/prisma'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = await prisma.user.findUnique({
    where:   { id },
    include: {
      orders:    { orderBy: { createdAt: 'desc' }, include: { items: true } },
      addresses: true,
    },
  })
  if (!customer) notFound()

  const totalSpent = customer.orders.filter(o => o.paymentStatus === 'PAID').reduce((s, o) => s + o.total, 0)

  return (
    <div>
      <Link href="/admin/customers" className="inline-flex items-center gap-1 text-sm text-brown/60 hover:text-gold mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Customers
      </Link>

      <h1 className="font-display text-2xl font-semibold text-brown mb-1">{customer.name ?? 'Unnamed Customer'}</h1>
      <p className="text-sm text-brown/50 mb-6">Customer since {formatDate(customer.createdAt)}</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Orders */}
          <div className="card-base p-6">
            <h2 className="font-semibold text-brown mb-4">Order History ({customer.orders.length})</h2>
            {customer.orders.length === 0 ? (
              <p className="text-sm text-brown/50">No orders yet.</p>
            ) : (
              <div className="divide-y divide-cream-dark">
                {customer.orders.map(order => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between gap-4 py-4 hover:bg-cream/40 transition-colors -mx-2 px-2 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-brown">{order.orderNumber}</p>
                      <p className="text-xs text-brown/50">{formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${ORDER_STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                        {ORDER_STATUS_LABELS[order.status] ?? order.status}
                      </span>
                      <span className="text-sm font-semibold text-brown w-20 text-right">{formatPrice(order.total)}</span>
                      <ChevronRight className="w-4 h-4 text-brown/40" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Addresses */}
          {customer.addresses.length > 0 && (
            <div className="card-base p-6">
              <h2 className="font-semibold text-brown mb-4">Saved Addresses</h2>
              <div className="space-y-3">
                {customer.addresses.map(addr => (
                  <div key={addr.id} className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-brown">{addr.name} <span className="text-brown/50">({addr.label})</span></p>
                      <p className="text-brown/60">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} — {addr.pincode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Contact */}
          <div className="card-base p-6">
            <h2 className="font-semibold text-brown mb-3">Contact</h2>
            <div className="space-y-2 text-sm text-brown/70">
              {customer.email && <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-brown/40" /> {customer.email}</p>}
              {customer.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-brown/40" /> {customer.phone}</p>}
            </div>
          </div>

          {/* Stats */}
          <div className="card-base p-6">
            <h2 className="font-semibold text-brown mb-3">Stats</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-brown/60">Total Orders</span><span className="font-semibold text-brown">{customer.orders.length}</span></div>
              <div className="flex justify-between"><span className="text-brown/60">Total Spent</span><span className="font-semibold text-brown">{formatPrice(totalSpent)}</span></div>
              <div className="flex justify-between items-center"><span className="text-brown/60">Reward Points</span><span className="font-semibold text-brown flex items-center gap-1"><Star className="w-3.5 h-3.5 text-gold" /> {customer.rewardPoints}</span></div>
              {customer.referralCode && (
                <div className="flex justify-between"><span className="text-brown/60">Referral Code</span><code className="text-xs bg-cream px-2 py-0.5 rounded">{customer.referralCode}</code></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
