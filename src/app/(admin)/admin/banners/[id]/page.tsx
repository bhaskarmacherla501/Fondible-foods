import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import prisma from '@/lib/prisma'
import { BannerForm } from '@/components/dashboard/BannerForm'

export const dynamic = 'force-dynamic'

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const banner = await prisma.banner.findUnique({ where: { id } })
  if (!banner) notFound()

  return (
    <div>
      <Link href="/admin/banners" className="inline-flex items-center gap-1 text-sm text-brown/60 hover:text-gold mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Banners
      </Link>
      <h1 className="font-display text-2xl font-semibold text-brown mb-6">{banner.title}</h1>
      <BannerForm
        banner={{
          id: banner.id,
          title: banner.title,
          subtitle: banner.subtitle,
          image: banner.image,
          mobileImage: banner.mobileImage,
          link: banner.link,
          sortOrder: banner.sortOrder,
          isActive: banner.isActive,
          startsAt: banner.startsAt ? banner.startsAt.toISOString() : null,
          endsAt: banner.endsAt ? banner.endsAt.toISOString() : null,
        }}
      />
    </div>
  )
}
