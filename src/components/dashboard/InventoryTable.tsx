'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

interface VariantRow {
  id: string
  productId: string
  productName: string
  name: string
  sku: string
  stock: number
  lowStockAt: number
}

export function InventoryTable({ variants }: { variants: VariantRow[] }) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(variants.map(v => [v.id, v.stock]))
  )
  const [savingId, setSavingId] = useState<string | null>(null)

  const handleSave = async (v: VariantRow) => {
    setSavingId(v.id)
    try {
      const res  = await fetch(`/api/products/${v.productId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant: { id: v.id, stock: values[v.id] } }),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Failed to update stock'); return }
      toast.success(`${v.productName} — ${v.name} stock updated`)
      router.refresh()
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="card-base overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 bg-cream text-xs font-bold uppercase tracking-wider text-brown/50">
        <span>Product</span>
        <span className="w-32 text-right">Stock</span>
        <span className="w-24 text-right">Action</span>
      </div>
      <div className="divide-y divide-cream-dark">
        {variants.map(v => {
          const changed = values[v.id] !== v.stock
          const low = v.stock <= v.lowStockAt
          return (
            <div key={v.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brown truncate">{v.productName}</p>
                <p className="text-xs text-brown/50">{v.name} · {v.sku} {low && <span className="text-red-500 font-semibold">· Low stock</span>}</p>
              </div>
              <input type="number" value={values[v.id]}
                onChange={e => setValues(s => ({ ...s, [v.id]: Number(e.target.value) }))}
                className={`input-base w-32 py-2 text-sm text-right ${low ? 'border-red-300' : ''}`} />
              <button onClick={() => handleSave(v)} disabled={!changed || savingId === v.id}
                className="btn-secondary w-24 justify-center py-2 text-xs disabled:opacity-30">
                {savingId === v.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
