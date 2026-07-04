import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { CouponsClient } from '@/components/dashboard/CouponsClient'

export const metadata: Metadata = { title: 'Coupons | Fondible Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brown">Coupons</h1>
        <p className="text-sm text-brown/60 mt-1">{coupons.length} coupons</p>
      </div>
      <CouponsClient
        coupons={coupons.map(c => ({
          ...c,
          expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
          createdAt: c.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}
