'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

interface StoreSettingsData {
  supportPhone: string
  supportEmail: string
  whatsappNumber: string
  address: string
  shippingFee: number
  freeShippingThreshold: number
  taxRate: number
  instagramUrl: string | null
  facebookUrl: string | null
}

export function StoreSettingsForm({ settings }: { settings: StoreSettingsData }) {
  const router = useRouter()
  const [supportPhone, setSupportPhone]     = useState(settings.supportPhone)
  const [supportEmail, setSupportEmail]     = useState(settings.supportEmail)
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber)
  const [address, setAddress]               = useState(settings.address)
  const [shippingFee, setShippingFee]       = useState(settings.shippingFee)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold)
  const [taxRatePercent, setTaxRatePercent] = useState(settings.taxRate * 100)
  const [instagramUrl, setInstagramUrl]     = useState(settings.instagramUrl ?? '')
  const [facebookUrl, setFacebookUrl]       = useState(settings.facebookUrl ?? '')
  const [saving, setSaving]                 = useState(false)

  const handleSave = async () => {
    if (!supportPhone || !supportEmail || !whatsappNumber) { toast.error('Phone, email, and WhatsApp number are required'); return }
    setSaving(true)
    try {
      const payload = {
        supportPhone, supportEmail, whatsappNumber, address,
        shippingFee, freeShippingThreshold,
        taxRate: taxRatePercent / 100,
        instagramUrl: instagramUrl || undefined,
        facebookUrl: facebookUrl || undefined,
      }
      const res  = await fetch('/api/settings/store', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Failed to save settings'); return }
      toast.success('Store settings saved')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="card-base p-6 space-y-4">
          <h2 className="font-semibold text-brown">Contact Info</h2>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Support Phone (display)</label>
            <input value={supportPhone} onChange={e => setSupportPhone(e.target.value)} className="input-base" placeholder="+91 80197 30055" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Support Email</label>
            <input value={supportEmail} onChange={e => setSupportEmail(e.target.value)} className="input-base" placeholder="hello@fondible.in" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)} className="input-base" placeholder="Hyderabad, India" />
          </div>
        </div>

        <div className="card-base p-6 space-y-4">
          <h2 className="font-semibold text-brown">WhatsApp & Social</h2>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">WhatsApp Number (digits only, with country code)</label>
            <input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} className="input-base" placeholder="918019730055" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Instagram URL</label>
            <input value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} className="input-base" placeholder="https://www.instagram.com/fondible" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Facebook URL</label>
            <input value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} className="input-base" placeholder="https://www.facebook.com/fondible" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-base p-6 space-y-4">
          <h2 className="font-semibold text-brown">Shipping & Tax</h2>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Shipping Fee (₹)</label>
            <input type="number" value={shippingFee} onChange={e => setShippingFee(Number(e.target.value))} className="input-base" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Free Shipping Threshold (₹)</label>
            <input type="number" value={freeShippingThreshold} onChange={e => setFreeShippingThreshold(Number(e.target.value))} className="input-base" />
            <p className="text-xs text-brown/50 mt-1">Orders at or above this subtotal ship free.</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Tax Rate (%)</label>
            <input type="number" step="0.01" value={taxRatePercent} onChange={e => setTaxRatePercent(Number(e.target.value))} className="input-base" />
            <p className="text-xs text-brown/50 mt-1">Set to 0 if GST is already included in product prices.</p>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
        </button>
      </div>
    </div>
  )
}
