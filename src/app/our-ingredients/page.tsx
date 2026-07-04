import type { Metadata } from 'next'
import Link from 'next/link'
import { X } from 'lucide-react'

export const metadata: Metadata = {
  title:       'Our Ingredients — Whole, Real, Honest',
  description: 'Every ingredient in a Fondible cookie is chosen with intention — whole wheat, real butter, whole nuts and jaggery. No maida, no refined sugar, no artificial anything.',
  alternates:  { canonical: 'https://fondible.in/our-ingredients' },
}

const PILLARS = [
  {
    icon: '🌾', title: 'Whole Wheat & Real Grains', heading: 'Whole, not refined',
    body: 'We use stone-ground whole wheat flour and real grain flours like ragi and jowar — never maida, never bleached flour. The full grain, the full nutrition.',
  },
  {
    icon: '🧈', title: 'Real Butter', heading: 'Real butter. Always.',
    body: 'We use fresh, churned butter — not vanaspati, not margarine, not hydrogenated fats. Real butter gives our cookies their signature richness and that unmistakable homemade aroma.',
  },
  {
    icon: '🍯', title: 'Jaggery Sweetness', heading: 'Jaggery, not sugar',
    body: 'Every Fondible cookie is sweetened with unrefined jaggery — rich in iron and minerals, lower glycemic than refined sugar, and carrying a deep caramel warmth that refined sugar simply cannot replicate.',
  },
  {
    icon: '🥜', title: 'Whole Nuts & Real Add-ins', heading: 'Whole, not processed',
    body: 'Cashews, almonds, walnuts, pistachios — we use them whole or roughly chopped. No nut pastes, no flavoring extracts. What you see studded in our cookie is exactly what you taste.',
  },
]

const NEVER_LIST = [
  'Maida (refined flour)',
  'Refined white sugar',
  'Vanaspati or margarine',
  'Artificial flavors or essences',
  'Chemical preservatives',
  'Synthetic food colors',
  'High-fructose corn syrup',
  'Palm oil',
  'Emulsifiers or stabilizers',
  '"Nature-identical" anything',
]

export default function OurIngredientsPage() {
  return (
    <>
      {/* Section 1 — Hero */}
      <section className="page-container pt-16 pb-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="section-title text-brown">We read every label. So you don&apos;t have to.</h1>
          <p className="mt-6 text-brown/70 text-lg">
            At Fondible, every ingredient is chosen with intention. If we wouldn&apos;t eat it ourselves,
            it doesn&apos;t go in your cookie.
          </p>
        </div>
      </section>

      {/* Section 2 — Ingredient Philosophy */}
      <section className="page-container py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">Our Philosophy</span>
          <h2 className="section-title text-brown mt-2">Four ingredients. Zero compromises.</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {PILLARS.map(p => (
            <div key={p.title} className="card-base card-hover p-8">
              <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-5 text-3xl">
                {p.icon}
              </div>
              <h3 className="font-display text-2xl font-semibold text-brown mb-2">{p.heading}</h3>
              <p className="text-sm text-brown/60 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — The Never List */}
      <section className="bg-brown text-cream py-20">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-label">The Clean Promise</span>
            <h2 className="section-title mt-2">Our Never List</h2>
            <p className="mt-4 text-cream/60">These ingredients will never be in a Fondible cookie.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {NEVER_LIST.map(item => (
              <div key={item} className="flex items-center gap-3 bg-white/5 border border-cream/10 rounded-xl px-4 py-3.5">
                <X className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-sm text-cream/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Millets Story, Reframed */}
      <section className="page-container py-20">
        <div className="max-w-2xl mx-auto text-center">
          <span className="section-label">A Chapter, Not the Whole Book</span>
          <h2 className="section-title text-brown mt-2 mb-6">We love millets — but they&apos;re not the whole story</h2>
          <p className="text-brown/70 leading-relaxed">
            Ragi, jowar, bajra — ancient Indian grains with extraordinary nutrition. We bake with them
            because they genuinely make better cookies, not because they&apos;re trendy. But at Fondible,
            millets are one chapter, not the whole book. The real story is simpler: whole ingredients,
            clean process, honest baking.
          </p>
        </div>
      </section>

      {/* Section 5 — Transparency Promise */}
      <section className="bg-cream-dark py-20">
        <div className="page-container text-center max-w-2xl mx-auto">
          <h2 className="section-title text-brown mb-6">No asterisks. No fine print.</h2>
          <p className="text-brown/70 leading-relaxed mb-8">
            Every ingredient we use is listed on every pack. No hidden additives disguised as
            &ldquo;permitted emulsifiers&rdquo;. No preservatives buried at the bottom of the list.
            If it&apos;s in your cookie, it&apos;s on the label — in plain language.
          </p>
          <Link href="/shop" className="btn-primary">Shop Our Cookies</Link>
        </div>
      </section>
    </>
  )
}
