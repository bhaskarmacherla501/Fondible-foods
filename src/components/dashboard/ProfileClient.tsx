'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, Copy } from 'lucide-react'

interface UserData {
  name: string | null
  email: string | null
  phone: string | null
  referralCode: string | null
}

export function ProfileClient({ user }: { user: UserData }) {
  const router = useRouter()
  const [name, setName]   = useState(user.name ?? '')
  const [phone, setPhone] = useState(user.phone ?? '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res  = await fetch('/api/user/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: phone || undefined }),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Failed to update profile'); return }
      toast.success('Profile updated')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const copyReferral = () => {
    if (!user.referralCode) return
    navigator.clipboard.writeText(user.referralCode)
    toast.success('Referral code copied')
  }

  return (
    <div className="max-w-lg space-y-6">
      <form onSubmit={handleSubmit} className="card-base p-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-brown block mb-1.5">Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="input-base" />
        </div>
        <div>
          <label className="text-sm font-semibold text-brown block mb-1.5">Email</label>
          <input value={user.email ?? ''} disabled className="input-base opacity-60 cursor-not-allowed" />
        </div>
        <div>
          <label className="text-sm font-semibold text-brown block mb-1.5">Phone Number</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit phone number" className="input-base" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
        </button>
      </form>

      {user.referralCode && (
        <div className="card-base p-6">
          <h2 className="font-semibold text-brown mb-2">Your Referral Code</h2>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-cream px-4 py-2.5 rounded-xl text-sm font-mono text-brown">{user.referralCode}</code>
            <button onClick={copyReferral} className="p-2.5 rounded-xl bg-brown text-cream hover:bg-gold transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
