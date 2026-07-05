'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

interface SeoSettingsData {
  siteTitle: string
  titleTemplate: string
  metaDescription: string
  ogImage: string
  keywords: string[]
  googleAnalyticsId: string | null
  googleSiteVerification: string | null
  robotsIndex: boolean
}

export function SeoSettingsForm({ settings }: { settings: SeoSettingsData }) {
  const router = useRouter()
  const [siteTitle, setSiteTitle]           = useState(settings.siteTitle)
  const [titleTemplate, setTitleTemplate]   = useState(settings.titleTemplate)
  const [metaDescription, setMetaDescription] = useState(settings.metaDescription)
  const [ogImage, setOgImage]               = useState(settings.ogImage)
  const [keywords, setKeywords]             = useState(settings.keywords.join(', '))
  const [gaId, setGaId]                     = useState(settings.googleAnalyticsId ?? '')
  const [gsc, setGsc]                       = useState(settings.googleSiteVerification ?? '')
  const [robotsIndex, setRobotsIndex]       = useState(settings.robotsIndex)
  const [saving, setSaving]                 = useState(false)

  const handleSave = async () => {
    if (!siteTitle || !metaDescription) { toast.error('Site title and meta description are required'); return }
    setSaving(true)
    try {
      const payload = {
        siteTitle, titleTemplate, metaDescription, ogImage,
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        googleAnalyticsId: gaId || undefined,
        googleSiteVerification: gsc || undefined,
        robotsIndex,
      }
      const res  = await fetch('/api/settings/seo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Failed to save SEO settings'); return }
      toast.success('SEO settings saved')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="card-base p-6 space-y-4">
          <h2 className="font-semibold text-brown">Global Defaults</h2>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Site Title</label>
            <input value={siteTitle} onChange={e => setSiteTitle(e.target.value)} className="input-base" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Title Template</label>
            <input value={titleTemplate} onChange={e => setTitleTemplate(e.target.value)} className="input-base" placeholder="%s | Fondible" />
            <p className="text-xs text-brown/50 mt-1">Use <code>%s</code> for the page-specific title, e.g. product or blog names.</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Meta Description</label>
            <textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} rows={3} className="input-base" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Default Share Image (OG Image)</label>
            <input value={ogImage} onChange={e => setOgImage(e.target.value)} className="input-base" placeholder="/images/og-image.jpg" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Keywords (comma separated)</label>
            <input value={keywords} onChange={e => setKeywords(e.target.value)} className="input-base" placeholder="whole wheat cookies, jaggery cookies" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-base p-6 space-y-4">
          <h2 className="font-semibold text-brown">Integrations</h2>
          <div>
            <label className="text-xs font-semibold text-brown/70 block mb-1.5">Google Analytics ID</label>
            <input value={gaId} onChange={e => setGaId(e.target.value)} className="input-base text-sm" placeholder="G-XXXXXXXXXX" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brown/70 block mb-1.5">Google Search Console Verification</label>
            <input value={gsc} onChange={e => setGsc(e.target.value)} className="input-base text-sm" placeholder="verification code" />
          </div>
          <label className="flex items-center justify-between text-sm text-brown/80 pt-2 border-t border-cream-dark">
            Allow search engines to index the site
            <input type="checkbox" checked={robotsIndex} onChange={e => setRobotsIndex(e.target.checked)} className="accent-[#C8820A] w-4 h-4" />
          </label>
          {!robotsIndex && (
            <p className="text-xs text-red-500">Warning: the entire site will be marked noindex,nofollow — it won't appear in Google search results.</p>
          )}
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
        </button>
      </div>
    </div>
  )
}
