import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import prisma from '@/lib/prisma'

export const metadata: Metadata = { title: 'Banners | Fondible Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brown">Banners</h1>
          <p className="text-sm text-brown/60 mt-1">{banners.length} banners</p>
        </div>
        <Link href="/admin/banners/new" className="btn-primary py-2 px-4 text-sm">
          <Plus className="w-4 h-4" /> New Banner
        </Link>
      </div>

      <div className="card-base overflow-hidden">
        {banners.length === 0 ? (
          <p className="text-center text-brown/50 py-12">No banners yet. Create your first one.</p>
        ) : (
          <div className="divide-y divide-cream-dark">
            {banners.map(banner => (
              <Link key={banner.id} href={`/admin/banners/${banner.id}`}
                className="flex items-center gap-4 p-5 hover:bg-cream/60 transition-colors">
                <div className="relative w-20 h-12 flex-shrink-0 rounded-md overflow-hidden bg-cream">
                  <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brown truncate">{banner.title}</p>
                  <p className="text-xs text-brown/50">Sort {banner.sortOrder} {banner.link ? `· Links to ${banner.link}` : ''}</p>
                </div>
                <span className={`badge flex-shrink-0 ${banner.isActive ? 'badge-green' : 'bg-gray-100 text-gray-600'}`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
