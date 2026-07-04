'use client'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'

interface DayPoint {
  date: string
  label: string
  revenue: number
}

export function RevenueChart({ data }: { data: DayPoint[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const max = Math.max(...data.map(d => d.revenue), 1)
  const hovered = hoverIdx !== null ? data[hoverIdx] : null

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-semibold text-brown">Revenue — Last 30 Days</h2>
        {hovered ? (
          <div className="text-right">
            <p className="text-lg font-bold text-brown">{formatPrice(hovered.revenue)}</p>
            <p className="text-xs text-brown/50">{hovered.label}</p>
          </div>
        ) : (
          <p className="text-lg font-bold text-brown">{formatPrice(data.reduce((s, d) => s + d.revenue, 0))} <span className="text-xs font-normal text-brown/50">total</span></p>
        )}
      </div>
      <div className="flex items-end gap-[3px] h-40" onMouseLeave={() => setHoverIdx(null)}>
        {data.map((d, i) => {
          const heightPct = Math.max((d.revenue / max) * 100, d.revenue > 0 ? 4 : 1.5)
          const active = hoverIdx === i
          return (
            <div key={d.date} className="flex-1 h-full flex items-end relative"
              onMouseEnter={() => setHoverIdx(i)} onFocus={() => setHoverIdx(i)} tabIndex={0}>
              <div
                className={`w-full rounded-t-[3px] transition-colors ${active ? 'bg-brown' : 'bg-gold'}`}
                style={{ height: `${heightPct}%` }}
              />
              {active && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-brown text-cream text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-brand-md z-10">
                  <span className="font-bold">{formatPrice(d.revenue)}</span>
                  <span className="text-cream/60 ml-1">{d.label}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-2 text-2xs text-brown/40">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  )
}
