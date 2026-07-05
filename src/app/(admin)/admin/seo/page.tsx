import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { SeoSettingsForm } from '@/components/dashboard/SeoSettingsForm'

export const metadata: Metadata = { title: 'SEO | Fondible Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminSeoPage() {
  const settings = await prisma.seoSetting.findFirst() ?? await prisma.seoSetting.create({ data: {} })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brown">SEO</h1>
        <p className="text-sm text-brown/60 mt-1">Site-wide search & social sharing defaults</p>
      </div>
      <SeoSettingsForm settings={settings} />
    </div>
  )
}
