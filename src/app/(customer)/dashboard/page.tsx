import Link from 'next/link'
import { ShoppingBag, Star, MapPin, Heart } from 'lucide-react'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'

export default async function DashboardOverviewPage() {
  const session = await auth()
  const userId = session!.user.id

  const [user, recentOrders, addressCount, wishlistCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { rewardPoints: true, referralCode: true } }),
    prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5, include: { items: true } }),
    prisma.address.count({ where: { userId } }),
    prisma.wishlistItem.count({ where: { userId } }),
  ])

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown mb-6">Welcome back{session?.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}!</h1>

      {/* Quick stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <ShoppingBag className="w-5 h-5 text-gold" />
          <p className="text-2xl font-bold text-brown">{recentOrders.length}</p>
          <p className="text-xs text-brown/50">Recent Orders</p>
        </div>
        <div className="stat-card">
          <Star className="w-5 h-5 text-gold" />
          <p className="text-2xl font-bold text-brown">{user?.rewardPoints ?? 0}</p>
          <p className="text-xs text-brown/50">Reward Points</p>
        </div>
        <div className="stat-card">
          <MapPin className="w-5 h-5 text-gold" />
          <p className="text-2xl font-bold text-brown">{addressCount}</p>
          <p className="text-xs text-brown/50">Saved Addresses</p>
        </div>
        <div className="stat-card">
          <Heart className="w-5 h-5 text-gold" />
          <p className="text-2xl font-bold text-brown">{wishlistCount}</p>
          <p className="text-xs text-brown/50">Wishlist Items</p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card-base p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-brown">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-gold font-semibold hover:underline">View All</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-brown/60 mb-4">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <ul className="divide-y divide-cream-dark">
            {recentOrders.map(order => (
              <li key={order.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-brown text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-brown/50">{formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${ORDER_STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <span className="text-sm font-semibold text-brown">{formatPrice(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
