'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { ORDER_STATUS_LABELS } from '@/lib/utils'

const STATUSES = ['PLACED', 'CONFIRMED', 'PACKED', 'DISPATCHED', 'IN_TRANSIT',
  'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED']

export function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const res  = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: note || undefined }),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Failed to update order'); return }
      toast.success('Order status updated')
      setNote('')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card-base p-6">
      <h2 className="font-semibold text-brown mb-4">Update Status</h2>
      <div className="space-y-3">
        <select value={status} onChange={e => setStatus(e.target.value)} className="input-base">
          {STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUS_LABELS[s] ?? s}</option>)}
        </select>
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note for timeline"
          className="input-base" />
        <button onClick={handleUpdate} disabled={saving || status === currentStatus} className="btn-primary w-full justify-center">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Update Status
        </button>
      </div>
    </div>
  )
}
