'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Trash2, Star } from 'lucide-react'
import { validatePhone, validatePincode } from '@/lib/utils'

interface Address {
  id: string
  label: string
  name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

const emptyForm = { label: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' }

export function AddressesClient({ addresses }: { addresses: Address[] }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (!form.name || !validatePhone(form.phone) || !form.line1 || !form.city || !form.state || !validatePincode(form.pincode)) {
      toast.error('Please fill in a valid address')
      return
    }
    setSaving(true)
    try {
      const res  = await fetch('/api/addresses', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Failed to save address'); return }
      toast.success('Address added')
      setForm(emptyForm)
      setAdding(false)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    const res  = await fetch(`/api/addresses/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isDefault: true }),
    })
    const data = await res.json()
    if (!data.success) { toast.error(data.error ?? 'Failed to update'); return }
    toast.success('Default address updated')
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    const res  = await fetch(`/api/addresses/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!data.success) { toast.error(data.error ?? 'Failed to delete'); return }
    toast.success('Address removed')
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {addresses.map(addr => (
        <div key={addr.id} className="card-base p-5 flex items-start justify-between gap-4">
          <div className="text-sm">
            <p className="font-semibold text-brown">
              {addr.name} <span className="badge-gold ml-2">{addr.label}</span>
              {addr.isDefault && <span className="badge-green ml-2">Default</span>}
            </p>
            <p className="text-brown/60">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} — {addr.pincode}</p>
            <p className="text-brown/50">{addr.phone}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!addr.isDefault && (
              <button onClick={() => handleSetDefault(addr.id)} className="p-2 rounded-lg hover:bg-gold/10 text-brown/50 hover:text-gold transition-colors" title="Set as default">
                <Star className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => handleDelete(addr.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {adding ? (
        <div className="card-base p-6 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Full name" value={form.name} className="input-base" onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input placeholder="Phone number" value={form.phone} className="input-base" onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <input placeholder="Address line 1" value={form.line1} className="input-base" onChange={e => setForm(f => ({ ...f, line1: e.target.value }))} />
          <input placeholder="Address line 2 (optional)" value={form.line2} className="input-base" onChange={e => setForm(f => ({ ...f, line2: e.target.value }))} />
          <div className="grid sm:grid-cols-3 gap-3">
            <input placeholder="City" value={form.city} className="input-base" onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            <input placeholder="State" value={form.state} className="input-base" onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
            <input placeholder="Pincode" value={form.pincode} className="input-base" onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={saving} className="btn-primary">Save Address</button>
            <button onClick={() => setAdding(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="btn-secondary">
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      )}
    </div>
  )
}
