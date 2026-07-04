import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Search } from 'lucide-react'
import { OrderService } from '@/services/order.service'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'

export const metadata: Metadata = { title: 'Orders | Fondible Admin' }
export const dynamic = 'force-dynamic'

const STATUS_TABS = ['ALL', 'PLACED', 'CONFIRMED', 'PACKED', 'DISPATCHED', 'IN_TRANSIT',
  'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED']

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>
}) {
  const { status, search, page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1') || 1)

  const { orders, pagination } = await OrderService.getAll({
    page, limit: 20, search,
    status: status && status !== 'ALL' ? status : undefined,
  })

  const qs = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = { status, search, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v) })
    return params.toString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brown">Orders</h1>
          <p className="text-sm text-brown/60 mt-1">{pagination.total} total orders</p>
        </div>
        <form action="/admin/orders" method="get" className="relative">
          {status && <input type="hidden" name="status" value={status} />}
          <Search className="w-4 h-4 text-brown/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" name="search" defaultValue={search} placeholder="Search order number..."
            className="input-base pl-9 py-2 text-sm w-64" />
        </form>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map(s => (
          <Link key={s} href={`/admin/orders?${qs({ status: s === 'ALL' ? undefined : s, page: undefined })}`}
            className={`badge ${(status ?? 'ALL') === s ? 'bg-brown text-cream' : 'bg-white text-brown/60 border border-brown/10 hover:border-gold'}`}>
            {s === 'ALL' ? 'All' : ORDER_STATUS_LABELS[s] ?? s}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        {orders.length === 0 ? (
          <p className="text-center text-brown/50 py-12">No orders found.</p>
        ) : (
          <div className="divide-y divide-cream-dark">
            {orders.map(order => (
              <Link key={order.id} href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between gap-4 p-5 hover:bg-cream/60 transition-colors">
                <div className="min-w-0">
                  <p className="font-semibold text-brown text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-brown/50 truncate">
                    {order.user.name ?? order.user.email ?? order.user.phone} · {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Link href={`/admin/orders?${qs({ page: String(page - 1) })}`}
            className={`btn-secondary ${!pagination.hasPrev ? 'pointer-events-none opacity-40' : ''}`}>Previous</Link>
          <span className="text-sm text-brown/60">Page {pagination.page} of {pagination.totalPages}</span>
          <Link href={`/admin/orders?${qs({ page: String(page + 1) })}`}
            className={`btn-secondary ${!pagination.hasNext ? 'pointer-events-none opacity-40' : ''}`}>Next</Link>
        </div>
      )}
    </div>
  )
}
