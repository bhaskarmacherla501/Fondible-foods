import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { BannerForm } from '@/components/dashboard/BannerForm'

export default function NewBannerPage() {
  return (
    <div>
      <Link href="/admin/banners" className="inline-flex items-center gap-1 text-sm text-brown/60 hover:text-gold mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Banners
      </Link>
      <h1 className="font-display text-2xl font-semibold text-brown mb-6">New Banner</h1>
      <BannerForm />
    </div>
  )
}
