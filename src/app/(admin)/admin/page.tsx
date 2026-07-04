import type { Metadata } from 'next'
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, Clock } from 'lucide-react'
import { OrderService } from '@/services/order.service'
import { formatPrice } from '@/lib/utils'
import prisma from '@/lib/prisma'

export const metadata: Metadata = { title: 'Admin Dashboard | Fondible' }
export const dynamic = 'force-dynamic'

async function getRecentOrders() {
  return prisma.order.findMany({
    include: { user: { select: { name: true, email: true } }, items: true },
    orderBy: { createdAt: 'desc' },
    take:    10,
  })
}

async function getLowStockProducts() {
  return prisma.productVariant.findMany({
    where:   { stock: { lte: 10 }, isActive: true },
    include: { product: { select: { name: true } } },
    orderBy: { stock: 'asc' },
    take:    8,
  })
}

export default async function AdminDashboard() {
  const [stats, recentOrders, lowStock] = await Promise.all([
    OrderService.getDashboardStats(),
    getRecentOrders(),
    getLowStockProducts(),
  ])

  const statCards = [
    { label: 'Monthly Revenue', value: formatPrice(stats.totalRevenue), icon: TrendingUp, growth: stats.revenueGrowth, color: 'text-gold' },
    { label: 'Total Orders',    value: stats.totalOrders.toString(),    icon: ShoppingBag, growth: stats.ordersGrowth, color: 'text-blue-600' },
    { label: 'Customers',       value: stats.totalCustomers.toString(), icon: Users,       growth: stats.customersGrowth, color: 'text-purple-600' },
    { label: 'Avg Order Value', value: formatPrice(stats.avgOrderValue), icon: Package,  growth: 0, color: 'text-green-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brown">Dashboard</h1>
        <p className="text-sm text-brown/60 mt-1">Welcome back. Here&apos;s what&apos;s happening with Fondible.</p>
      </div>

      {/* Alerts */}
      {(stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.pendingOrders > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800"><strong>{stats.pendingOrders}</strong> orders pending fulfillment</p>
            </div>
          )}
          {stats.lowStockProducts > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800"><strong>{stats.lowStockProducts}</strong> variants with low stock</p>
            </div>
          )}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(card => (
          <div key={card.label} className="stat-card">
            <div className="flex items-center justify-between">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              {card.growth !== 0 && (
                <span className={`text-xs font-bold ${card.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {card.growth > 0 ? '+' : ''}{card.growth.toFixed(1)}%
                </span>
              )}
            </div>
            <p className="font-display text-2xl font-semibold text-brown mt-2">{card.value}</p>
            <p className="text-xs text-brown/50">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card-base p-6">
          <h2 className="font-semibold text-brown mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-cream-dark last:border-0">
                <div>
                  <p className="text-sm font-semibold text-brown">{order.orderNumber}</p>
                  <p className="text-xs text-brown/50">{order.user.name} · {order.items.length} item(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gold">{formatPrice(order.total)}</p>
                  <span className={`badge text-2xs px-2 py-0.5 rounded-full ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="card-base p-6">
          <h2 className="font-semibold text-brown mb-4">Low Stock Alert</h2>
          <div className="space-y-3">
            {lowStock.map(variant => (
              <div key={variant.id} className="flex items-center justify-between py-2 border-b border-cream-dark last:border-0">
                <div>
                  <p className="text-sm font-medium text-brown">{variant.product.name}</p>
                  <p className="text-xs text-brown/50">{variant.name}</p>
                </div>
                <span className={`text-sm font-bold ${variant.stock <= 3 ? 'text-red-600' : 'text-amber-600'}`}>
                  {variant.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
