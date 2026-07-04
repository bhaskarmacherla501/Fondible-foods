'use client'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'

interface ProductPoint {
  productId: string
  name: string
  revenue: number
  unitsSold: number
}

export function TopProductsChart({ data }: { data: ProductPoint[] }) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const max = Math.max(...data.map(d => d.revenue), 1)

  if (data.length === 0) {
    return <p className="text-sm text-brown/50 py-8 text-center">No sales in this period yet.</p>
  }

  return (
    <div className="space-y-4">
      {data.map(d => {
        const widthPct = Math.max((d.revenue / max) * 100, 3)
        const active = hoverId === d.productId
        return (
          <div key={d.productId}
            onMouseEnter={() => setHoverId(d.productId)} onMouseLeave={() => setHoverId(null)}
            onFocus={() => setHoverId(d.productId)} tabIndex={0}
            className="group">
            <div className="flex items-center justify-between mb-1.5 text-sm">
              <span className="font-medium text-brown truncate pr-2">{d.name}</span>
              <span className="text-brown/70 flex-shrink-0">{formatPrice(d.revenue)}</span>
            </div>
            <div className="h-4 bg-cream rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-colors ${active ? 'bg-brown' : 'bg-gold'}`}
                style={{ width: `${widthPct}%` }}
              />
            </div>
            {active && (
              <p className="text-xs text-brown/50 mt-1">{d.unitsSold} unit{d.unitsSold !== 1 ? 's' : ''} sold</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
