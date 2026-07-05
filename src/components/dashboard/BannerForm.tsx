'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, Trash2 } from 'lucide-react'

interface BannerData {
  id?: string
  title: string
  subtitle: string | null
  image: string
  mobileImage: string | null
  link: string | null
  sortOrder: number
  isActive: boolean
  startsAt: string | null
  endsAt: string | null
}

function toDateInput(value: string | null): string {
  return value ? value.slice(0, 10) : ''
}

export function BannerForm({ banner }: { banner?: BannerData }) {
  const router = useRouter()
  const isEditing = !!banner?.id
  const [title, setTitle]             = useState(banner?.title ?? '')
  const [subtitle, setSubtitle]       = useState(banner?.subtitle ?? '')
  const [image, setImage]             = useState(banner?.image ?? '')
  const [mobileImage, setMobileImage] = useState(banner?.mobileImage ?? '')
  const [link, setLink]               = useState(banner?.link ?? '')
  const [sortOrder, setSortOrder]     = useState(banner?.sortOrder ?? 0)
  const [isActive, setIsActive]       = useState(banner?.isActive ?? true)
  const [startsAt, setStartsAt]       = useState(toDateInput(banner?.startsAt ?? null))
  const [endsAt, setEndsAt]           = useState(toDateInput(banner?.endsAt ?? null))
  const [saving, setSaving]           = useState(false)

  const handleSave = async () => {
    if (!title || !image) { toast.error('Title and image are required'); return }
    setSaving(true)
    try {
      const payload = {
        title, subtitle: subtitle || undefined, image,
        mobileImage: mobileImage || undefined, link: link || undefined,
        sortOrder, isActive,
        startsAt: startsAt || undefined, endsAt: endsAt || undefined,
      }
      const res  = await fetch(isEditing ? `/api/banners/${banner.id}` : '/api/banners', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Failed to save banner'); return }
      toast.success(isEditing ? 'Banner updated' : 'Banner created')
      router.push('/admin/banners')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!banner?.id || !confirm(`Delete "${banner.title}"?`)) return
    const res  = await fetch(`/api/banners/${banner.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!data.success) { toast.error(data.error ?? 'Failed to delete'); return }
    toast.success('Banner deleted')
    router.push('/admin/banners')
    router.refresh()
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="card-base p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="input-base" placeholder="e.g. Diwali Sale — 20% Off" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Subtitle</label>
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="input-base" placeholder="Optional supporting line" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Image URL</label>
            <input value={image} onChange={e => setImage(e.target.value)} className="input-base" placeholder="/images/banners/example.jpg" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Mobile Image URL (optional)</label>
            <input value={mobileImage} onChange={e => setMobileImage(e.target.value)} className="input-base" placeholder="/images/banners/example-mobile.jpg" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Link (where the banner goes when clicked)</label>
            <input value={link} onChange={e => setLink(e.target.value)} className="input-base" placeholder="/shop" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-base p-6 space-y-4">
          <h2 className="font-semibold text-brown">Schedule & Priority</h2>
          <div>
            <label className="text-xs font-semibold text-brown/70 block mb-1.5">Sort Order (lower shows first)</label>
            <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="input-base text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brown/70 block mb-1.5">Starts On (optional)</label>
            <input type="date" value={startsAt} onChange={e => setStartsAt(e.target.value)} className="input-base text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brown/70 block mb-1.5">Ends On (optional)</label>
            <input type="date" value={endsAt} onChange={e => setEndsAt(e.target.value)} className="input-base text-sm" />
          </div>
          <label className="flex items-center justify-between text-sm text-brown/80 pt-2 border-t border-cream-dark">
            Active <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="accent-[#C8820A] w-4 h-4" />
          </label>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} {isEditing ? 'Save Changes' : 'Create Banner'}
        </button>

        {isEditing && (
          <button onClick={handleDelete} className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete Banner
          </button>
        )}
      </div>
    </div>
  )
}
