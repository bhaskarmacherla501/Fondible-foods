import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, Star } from 'lucide-react'
import prisma from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Customers | Fondible Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams

  const customers = await prisma.user.findMany({
    where: {
      role: 'CUSTOMER',
      ...(search ? {
        OR: [
          { name:  { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
    },
    include: {
      orders: { select: { total: true, paymentStatus: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brown">Customers</h1>
          <p className="text-sm text-brown/60 mt-1">{customers.length} customers</p>
        </div>
        <form action="/admin/customers" method="get" className="relative">
          <Search className="w-4 h-4 text-brown/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" name="search" defaultValue={search} placeholder="Search name, email, phone..."
            className="input-base pl-9 py-2 text-sm w-72" />
        </form>
      </div>

      <div className="card-base overflow-hidden">
        {customers.length === 0 ? (
          <p className="text-center text-brown/50 py-12">No customers found.</p>
        ) : (
          <div className="divide-y divide-cream-dark">
            {customers.map(customer => {
              const totalSpent = customer.orders
                .filter(o => o.paymentStatus === 'PAID')
                .reduce((s, o) => s + o.total, 0)
              return (
                <Link key={customer.id} href={`/admin/customers/${customer.id}`}
                  className="flex items-center justify-between gap-4 p-5 hover:bg-cream/60 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-brown truncate">{customer.name ?? 'Unnamed Customer'}</p>
                    <p className="text-xs text-brown/50 truncate">
                      {customer.email ?? customer.phone ?? '—'} · Joined {formatDate(customer.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0 text-sm">
                    <span className="flex items-center gap-1 text-brown/60 w-16">
                      <Star className="w-3.5 h-3.5 text-gold" /> {customer.rewardPoints}
                    </span>
                    <span className="text-brown/70 w-16 text-right">{customer._count.orders} order{customer._count.orders !== 1 ? 's' : ''}</span>
                    <span className="font-semibold text-brown w-24 text-right">{formatPrice(totalSpent)}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
