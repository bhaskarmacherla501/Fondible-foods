'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, Trash2 } from 'lucide-react'

interface Variant {
  id: string
  name: string
  price: number
  stock: number
}

interface ProductData {
  id: string
  name: string
  shortDesc: string | null
  isActive: boolean
  isFeatured: boolean
  isBestseller: boolean
  isNew: boolean
  variants: Variant[]
}

export function ProductEditForm({ product }: { product: ProductData }) {
  const router = useRouter()
  const [name, setName] = useState(product.name)
  const [shortDesc, setShortDesc] = useState(product.shortDesc ?? '')
  const [isActive, setIsActive] = useState(product.isActive)
  const [isFeatured, setIsFeatured] = useState(product.isFeatured)
  const [isBestseller, setIsBestseller] = useState(product.isBestseller)
  const [isNew, setIsNew] = useState(product.isNew)
  const [variants, setVariants] = useState(product.variants)
  const [saving, setSaving] = useState(false)

  const updateVariantField = (id: string, field: 'price' | 'stock', value: number) => {
    setVariants(vs => vs.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save product-level fields
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, shortDesc, isActive, isFeatured, isBestseller, isNew }),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Failed to save'); return }

      // Save each variant's price/stock
      for (const v of variants) {
        const original = product.variants.find(o => o.id === v.id)
        if (original && (original.price !== v.price || original.stock !== v.stock)) {
          await fetch(`/api/products/${product.id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ variant: { id: v.id, price: v.price, stock: v.stock } }),
          })
        }
      }

      toast.success('Product updated')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async () => {
    if (!confirm(`Deactivate "${product.name}"? It will no longer appear in the shop.`)) return
    const res  = await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!data.success) { toast.error(data.error ?? 'Failed to deactivate'); return }
    toast.success('Product deactivated')
    setIsActive(false)
    router.refresh()
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="card-base p-6 space-y-4">
          <h2 className="font-semibold text-brown">Basic Info</h2>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input-base" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Short Description</label>
            <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} rows={3} className="input-base" />
          </div>
        </div>

        <div className="card-base p-6">
          <h2 className="font-semibold text-brown mb-4">Variants (Price & Stock)</h2>
          <div className="space-y-3">
            {variants.map(v => (
              <div key={v.id} className="flex items-center gap-3">
                <span className="text-sm text-brown/70 flex-1">{v.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-brown/50">₹</span>
                  <input type="number" value={v.price} onChange={e => updateVariantField(v.id, 'price', Number(e.target.value))}
                    className="input-base w-24 py-2 text-sm" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-brown/50">Stock</span>
                  <input type="number" value={v.stock} onChange={e => updateVariantField(v.id, 'stock', Number(e.target.value))}
                    className="input-base w-20 py-2 text-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-base p-6 space-y-3">
          <h2 className="font-semibold text-brown mb-1">Flags</h2>
          <label className="flex items-center justify-between text-sm text-brown/80">
            Active <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="accent-[#C8820A] w-4 h-4" />
          </label>
          <label className="flex items-center justify-between text-sm text-brown/80">
            Featured <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="accent-[#C8820A] w-4 h-4" />
          </label>
          <label className="flex items-center justify-between text-sm text-brown/80">
            Bestseller <input type="checkbox" checked={isBestseller} onChange={e => setIsBestseller(e.target.checked)} className="accent-[#C8820A] w-4 h-4" />
          </label>
          <label className="flex items-center justify-between text-sm text-brown/80">
            New <input type="checkbox" checked={isNew} onChange={e => setIsNew(e.target.checked)} className="accent-[#C8820A] w-4 h-4" />
          </label>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
        </button>

        {isActive && (
          <button onClick={handleDeactivate} className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" /> Deactivate Product
          </button>
        )}
      </div>
    </div>
  )
}
