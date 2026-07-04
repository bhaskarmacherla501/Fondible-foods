const BENEFITS = [
  { icon: '🌾', title: 'Whole Wheat & Real Grains', desc: 'Stone-ground whole wheat and ancient grain flours — never maida, never bleached, never refined.' },
  { icon: '🧈', title: 'Real Butter. Always.', desc: 'Fresh churned butter in every batch. Not vanaspati. Not margarine. The real thing.' },
  { icon: '🍯', title: 'Jaggery Sweetened', desc: 'Zero refined sugar. Unrefined jaggery only — iron-rich, lower glycemic, and deeply delicious.' },
  { icon: '🥜', title: 'Whole Nuts & Real Ingredients', desc: 'Every nut is whole. Every add-in is real. No extracts, no pastes, no imitation anything.' },
]

export function BenefitsSection() {
  return (
    <section className="page-container py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="section-label">Why Fondible</span>
        <h2 className="section-title text-brown mt-2">Good for you, by design</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {BENEFITS.map(b => (
          <div key={b.title} className="card-base card-hover p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gold/10 flex items-center justify-center mb-4 text-2xl">
              {b.icon}
            </div>
            <h3 className="benefit-card-title text-brown mb-2">{b.title}</h3>
            <p className="text-sm text-brown/60">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
