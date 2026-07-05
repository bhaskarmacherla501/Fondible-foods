import type { Metadata } from 'next'
import { getStoreSettings } from '@/lib/settings'
import { StoreSettingsForm } from '@/components/dashboard/StoreSettingsForm'

export const metadata: Metadata = { title: 'Settings | Fondible Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brown">Settings</h1>
        <p className="text-sm text-brown/60 mt-1">Store-wide contact, shipping, and tax configuration</p>
      </div>
      <StoreSettingsForm settings={settings} />
    </div>
  )
}
