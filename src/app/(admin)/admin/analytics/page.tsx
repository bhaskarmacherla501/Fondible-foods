import type { Metadata } from 'next'
import { TrendingUp, Users, Package } from 'lucide-react'
import prisma from '@/lib/prisma'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { TopProductsChart } from '@/components/dashboard/TopProductsChart'
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'

export const metadata: Metadata = { title: 'Analytics | Fondible Admin' }
export const dynamic = 'force-dynamic'

const DAYS = 30

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default async function AdminAnalyticsPage() {
  const since = new Date()
  since.setDate(since.getDate() - (DAYS - 1))
  since.setHours(0, 0, 0, 0)

  const [orders, orderItems, newCustomers] = await Promise.all([
    prisma.order.findMany({
      where:   { createdAt: { gte: since } },
      select:  { createdAt: true, total: true, paymentStatus: true, status: true },
    }),
    prisma.orderItem.findMany({
      where:   { order: { createdAt: { gte: since }, paymentStatus: 'PAID' } },
      select:  { productId: true, name: true, total: true, quantity: true },
    }),
    prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: since } } }),
  ])

  // Daily revenue series (PAID orders only)
  const revenueByDay = new Map<string, number>()
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(since)
    d.setDate(d.getDate() + i)
    revenueByDay.set(dayKey(d), 0)
  }
  let totalRevenue = 0
  for (const order of orders) {
    if (order.paymentStatus !== 'PAID') continue
    const key = dayKey(order.createdAt)
    if (revenueByDay.has(key)) revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + order.total)
    totalRevenue += order.total
  }
  const revenueSeries = Array.from(revenueByDay.entries()).map(([date, revenue]) => ({
    date, revenue,
    label: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  }))

  // Order status breakdown
  const statusCounts = new Map<string, number>()
  for (const order of orders) {
    statusCounts.set(order.status, (statusCounts.get(order.status) ?? 0) + 1)
  }
  const statusBreakdown = Array.from(statusCounts.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count)
  const maxStatusCount = Math.max(...statusBreakdown.map(s => s.count), 1)

  // Top products by revenue
  const productMap = new Map<string, { name: string; revenue: number; unitsSold: number }>()
  for (const item of orderItems) {
    const existing = productMap.get(item.productId) ?? { name: item.name, revenue: 0, unitsSold: 0 }
    existing.revenue += item.total
    existing.unitsSold += item.quantity
    productMap.set(item.productId, existing)
  }
  const topProducts = Array.from(productMap.entries())
    .map(([productId, v]) => ({ productId, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)

  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.filter(o => o.paymentStatus === 'PAID').length || 0 : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brown">Analytics</h1>
        <p className="text-sm text-brown/60 mt-1">Last {DAYS} days</p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="stat-card">
          <TrendingUp className="w-5 h-5 text-gold" />
          <p className="font-display text-2xl font-semibold text-brown mt-2">{formatPrice(totalRevenue)}</p>
          <p className="text-xs text-brown/50">Total Revenue</p>
        </div>
        <div className="stat-card">
          <Package className="w-5 h-5 text-gold" />
          <p className="font-display text-2xl font-semibold text-brown mt-2">{formatPrice(Math.round(avgOrderValue))}</p>
          <p className="text-xs text-brown/50">Avg Order Value</p>
        </div>
        <div className="stat-card">
          <Users className="w-5 h-5 text-gold" />
          <p className="font-display text-2xl font-semibold text-brown mt-2">{newCustomers}</p>
          <p className="text-xs text-brown/50">New Customers</p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="card-base p-6">
        <RevenueChart data={revenueSeries} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="card-base p-6">
          <h2 className="font-semibold text-brown mb-5">Top Products by Revenue</h2>
          <TopProductsChart data={topProducts} />
        </div>

        {/* Order status breakdown */}
        <div className="card-base p-6">
          <h2 className="font-semibold text-brown mb-5">Orders by Status</h2>
          {statusBreakdown.length === 0 ? (
            <p className="text-sm text-brown/50 py-8 text-center">No orders in this period yet.</p>
          ) : (
            <div className="space-y-3">
              {statusBreakdown.map(s => (
                <div key={s.status} className="flex items-center gap-3">
                  <span className={`badge w-32 flex-shrink-0 justify-center ${ORDER_STATUS_COLORS[s.status] ?? 'bg-gray-100 text-gray-800'}`}>
                    {ORDER_STATUS_LABELS[s.status] ?? s.status}
                  </span>
                  <div className="flex-1 h-3 bg-cream rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-brown/70" style={{ width: `${Math.max((s.count / maxStatusCount) * 100, 4)}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-brown w-6 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
