const ITEMS = [
  'Real Butter',
  'Whole Wheat',
  'Jaggery Sweetened',
  'Whole Nuts',
  'No Refined Sugar',
  'No Preservatives',
  'No Artificial Flavors',
  'No Chemicals',
  'Stone-Ground Flour',
  'Freshly Baked Daily',
  'No Maida Ever',
  'Real Ingredients Only',
]

export function TrustStrip() {
  const loop = [...ITEMS, ...ITEMS]
  return (
    <div className="bg-brown py-3 overflow-hidden">
      <div className="flex gap-10 animate-marquee whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={i} className="trust-item">
            <span className="w-1 h-1 rounded-full bg-gold" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
