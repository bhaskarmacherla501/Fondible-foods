'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface Coupon {
  id: string
  code: string
  type: string
  value: number
  minOrderAmount: number | null
  maxDiscount: number | null
  usageLimit: number | null
  usageCount: number
  isActive: boolean
  description: string | null
  expiresAt: string | null
  createdAt: string
}

const emptyForm = { code: '', type: 'PERCENTAGE', value: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', description: '', expiresAt: '' }

export function CouponsClient({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    if (!form.code || !form.value) { toast.error('Code and value are required'); return }
    setSaving(true)
    try {
      const res  = await fetch('/api/coupons', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code, type: form.type, value: Number(form.value),
          minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
          description: form.description || undefined,
          expiresAt: form.expiresAt || undefined,
        }),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Failed to create coupon'); return }
      toast.success(`Coupon ${data.data.code} created`)
      setForm(emptyForm)
      setAdding(false)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (coupon: Coupon) => {
    const res  = await fetch(`/api/coupons/${coupon.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    })
    const data = await res.json()
    if (!data.success) { toast.error(data.error ?? 'Failed to update'); return }
    toast.success(coupon.isActive ? 'Coupon deactivated' : 'Coupon activated')
    router.refresh()
  }

  const handleDelete = async (coupon: Coupon) => {
    if (!confirm(`Delete coupon "${coupon.code}"?`)) return
    const res  = await fetch(`/api/coupons/${coupon.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!data.success) { toast.error(data.error ?? 'Failed to delete'); return }
    toast.success(data.data?.deactivated ? 'Coupon has been used before — deactivated instead of deleted' : 'Coupon deleted')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="card-base overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-cream text-xs font-bold uppercase tracking-wider text-brown/50">
          <span>Coupon</span>
          <span className="w-24 text-right">Value</span>
          <span className="w-24 text-right">Used</span>
          <span className="w-20 text-center">Status</span>
          <span className="w-20 text-right">Action</span>
        </div>
        <div className="divide-y divide-cream-dark">
          {coupons.map(c => (
            <div key={c.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-brown">{c.code}</p>
                <p className="text-xs text-brown/50 truncate">{c.description ?? '—'}{c.minOrderAmount ? ` · Min ${formatPrice(c.minOrderAmount)}` : ''}{c.expiresAt ? ` · Expires ${formatDate(c.expiresAt)}` : ''}</p>
              </div>
              <span className="w-24 text-right text-sm text-brown/70">
                {c.type === 'PERCENTAGE' ? `${c.value}%` : c.type === 'FLAT' ? formatPrice(c.value) : c.type === 'FREE_SHIPPING' ? 'Free Ship' : `${c.value}`}
              </span>
              <span className="w-24 text-right text-sm text-brown/70">{c.usageCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</span>
              <div className="w-20 flex justify-center">
                <button onClick={() => toggleActive(c)} className={`badge ${c.isActive ? 'badge-green' : 'bg-gray-100 text-gray-600'}`}>
                  {c.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
              <div className="w-20 flex justify-end">
                <button onClick={() => handleDelete(c)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {adding ? (
        <div className="card-base p-6 space-y-3">
          <h2 className="font-semibold text-brown mb-1">New Coupon</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Code (e.g. SAVE20)" value={form.code} className="input-base"
              onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
            <select value={form.type} className="input-base" onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="PERCENTAGE">Percentage Off</option>
              <option value="FLAT">Flat Amount Off</option>
              <option value="FREE_SHIPPING">Free Shipping</option>
            </select>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <input type="number" placeholder={form.type === 'PERCENTAGE' ? 'Value (%)' : 'Value (₹)'} value={form.value} className="input-base"
              onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
            <input type="number" placeholder="Min order amount" value={form.minOrderAmount} className="input-base"
              onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))} />
            <input type="number" placeholder="Max discount (optional)" value={form.maxDiscount} className="input-base"
              onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value }))} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input type="number" placeholder="Usage limit (optional)" value={form.usageLimit} className="input-base"
              onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} />
            <input type="date" placeholder="Expires on (optional)" value={form.expiresAt} className="input-base"
              onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
          </div>
          <input placeholder="Description (shown to customers)" value={form.description} className="input-base"
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="flex gap-3">
            <button onClick={handleCreate} disabled={saving} className="btn-primary">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create Coupon
            </button>
            <button onClick={() => setAdding(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="btn-secondary">
          <Plus className="w-4 h-4" /> New Coupon
        </button>
      )}
    </div>
  )
}
