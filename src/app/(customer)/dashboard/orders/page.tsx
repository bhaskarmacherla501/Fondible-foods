import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { auth } from '@/lib/auth'
import { OrderService } from '@/services/order.service'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const session = await auth()
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1') || 1)

  const { orders, pagination } = await OrderService.getByUser(session!.user.id, { page, limit: 10 })

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="card-base p-10 text-center">
          <p className="text-brown/60 mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="card-base divide-y divide-cream-dark">
          {orders.map(order => (
            <Link key={order.id} href={`/dashboard/orders/${order.id}`}
              className="flex items-center justify-between gap-4 p-5 hover:bg-cream/60 transition-colors">
              <div>
                <p className="font-semibold text-brown text-sm">{order.orderNumber}</p>
                <p className="text-xs text-brown/50">{formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${ORDER_STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </span>
                <span className="text-sm font-semibold text-brown">{formatPrice(order.total)}</span>
                <ChevronRight className="w-4 h-4 text-brown/40" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Link href={`/dashboard/orders?page=${page - 1}`}
            className={`btn-secondary ${!pagination.hasPrev ? 'pointer-events-none opacity-40' : ''}`}>Previous</Link>
          <span className="text-sm text-brown/60">Page {pagination.page} of {pagination.totalPages}</span>
          <Link href={`/dashboard/orders?page=${page + 1}`}
            className={`btn-secondary ${!pagination.hasNext ? 'pointer-events-none opacity-40' : ''}`}>Next</Link>
        </div>
      )}
    </div>
  )
}
