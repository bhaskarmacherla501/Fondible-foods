import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title:       'About Fondible — Our Story',
  description: 'Fondible started because we couldn\'t find a cookie we trusted. Real butter, whole wheat, jaggery — no hidden ingredients, no shortcuts.',
  alternates:  { canonical: 'https://fondible.in/about' },
}

const STANDARD_COLUMNS = [
  {
    title: 'We name every ingredient',
    body:  'No "permitted emulsifiers". No "nature-identical flavoring". Every ingredient in a Fondible cookie has a real name and a real source.',
  },
  {
    title: 'We use real butter',
    body:  'Fresh churned butter in every single batch. It costs more, it goes rancid faster, it makes the process harder. We do it anyway — because it makes a better cookie.',
  },
  {
    title: 'We sweeten with jaggery only',
    body:  'Unrefined, mineral-rich jaggery from verified sources. Not brown sugar (which is just white sugar with molasses added back). Real jaggery. Real sweetness.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Section 1 — Origin Story */}
      <section className="page-container pt-16 pb-12 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="section-label">Our Story</span>
          <h1 className="section-title text-brown mt-2">
            We started Fondible because we couldn&apos;t find a cookie we trusted.
          </h1>
          <p className="mt-6 text-brown/70 text-lg leading-relaxed">
            Every cookie on the shelf had something to hide — refined flour, hydrogenated fats,
            artificial flavors, sugar disguised as &ldquo;permitted sweeteners&rdquo;. We wanted a
            cookie that was honest. So we baked one.
          </p>
        </div>
      </section>

      {/* Section 2 — The Fondible Standard */}
      <section className="page-container py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">The Fondible Standard</span>
          <h2 className="section-title text-brown mt-2">Three things we never compromise on</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {STANDARD_COLUMNS.map(col => (
            <div key={col.title} className="card-base card-hover p-8">
              <h3 className="font-display text-xl font-semibold text-brown mb-3">{col.title}</h3>
              <p className="text-sm text-brown/60 leading-relaxed">{col.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — Why This Matters */}
      <section className="bg-brown text-cream py-20">
        <div className="page-container max-w-2xl mx-auto text-center">
          <h2 className="section-title mt-2 mb-6">Most &ldquo;healthy&rdquo; cookies are just less unhealthy.</h2>
          <p className="text-cream/70 leading-relaxed">
            They swap maida for oats but keep the refined sugar. They add protein powder but keep the
            artificial flavors. At Fondible, we started from scratch — asking &ldquo;what would a
            genuinely good cookie look like if we used only ingredients we&apos;d find in a real
            kitchen?&rdquo; That question is the entire brand.
          </p>
        </div>
      </section>

      {/* Section 4 — Our Promise */}
      <section className="page-container py-20 text-center max-w-2xl mx-auto">
        <h2 className="section-title text-brown mb-6">What you see is what you eat.</h2>
        <p className="text-brown/70 leading-relaxed mb-8">
          Scan our ingredient list. Every item is a real food with a real name. No code numbers.
          No chemical names. No asterisks leading to fine print. If you can&apos;t pronounce it,
          it&apos;s not in our cookies.
        </p>
        <Link href="/our-ingredients" className="btn-primary">See Our Ingredients</Link>
      </section>
    </>
  )
}
