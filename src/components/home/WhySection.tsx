import { Check, X } from 'lucide-react'

const ROWS = [
  { label: 'Fat Used', fondible: 'Real Butter', regular: 'Vanaspati / Margarine' },
  { label: 'Artificial Flavors', fondible: 'None', regular: 'Often Added' },
  { label: 'Main Flour', fondible: 'Whole Wheat & Real Grains', regular: 'Refined Maida' },
  { label: 'Sweetener', fondible: 'Jaggery', regular: 'Refined White Sugar' },
  { label: 'Preservatives', fondible: 'None', regular: 'Often Added' },
  { label: 'Fiber Content', fondible: 'High', regular: 'Low' },
  { label: 'Glycemic Index', fondible: 'Low-Medium', regular: 'High' },
]

export function WhySection() {
  return (
    <section className="bg-brown text-cream py-20">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">The Difference</span>
          <h2 className="section-title mt-2">Fondible vs. Regular Cookies</h2>
        </div>
        <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-gold/20">
          <div className="grid grid-cols-3 bg-brown-mid text-gold-pale text-xs uppercase tracking-widest font-bold">
            <div className="p-4">Aspect</div>
            <div className="p-4 text-gold">Fondible</div>
            <div className="p-4">Regular Cookies</div>
          </div>
          {ROWS.map((row, i) => (
            <div key={row.label} className={`grid grid-cols-3 text-sm ${i % 2 ? 'bg-white/5' : ''}`}>
              <div className="p-4 font-medium">{row.label}</div>
              <div className="p-4 flex items-center gap-2 text-gold-pale"><Check className="w-4 h-4 text-gold flex-shrink-0" /> {row.fondible}</div>
              <div className="p-4 flex items-center gap-2 text-cream/50"><X className="w-4 h-4 flex-shrink-0" /> {row.regular}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
