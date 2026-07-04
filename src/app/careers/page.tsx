import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, Sparkles, Users } from 'lucide-react'

export const metadata: Metadata = {
  title:       'Careers at Fondible',
  description: 'Join the Fondible team — we\'re building a clean-ingredient cookie brand from Hyderabad, one honest batch at a time.',
  alternates:  { canonical: 'https://fondible.in/careers' },
}

const VALUES = [
  { icon: Heart, title: 'Honesty over hype', desc: 'We\'d rather tell you the truth about an ingredient than sell you a story about it.' },
  { icon: Sparkles, title: 'Craft over shortcuts', desc: 'Small batches, real butter, real time. We don\'t take shortcuts to scale faster.' },
  { icon: Users, title: 'Small team, real ownership', desc: 'Everyone here shapes the product, not just their one slice of it.' },
]

export default function CareersPage() {
  return (
    <div className="page-container py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="section-label">Join Us</span>
        <h1 className="section-title text-brown mt-2">Careers at Fondible</h1>
        <p className="mt-4 text-brown/70">We&apos;re a small, growing team building a clean-ingredient cookie brand from Hyderabad — one honest batch at a time.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-16 max-w-4xl mx-auto">
        {VALUES.map(v => (
          <div key={v.title} className="card-base p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gold/10 flex items-center justify-center mb-4">
              <v.icon className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-semibold text-brown mb-2">{v.title}</h3>
            <p className="text-sm text-brown/60">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center card-base p-10">
        <h2 className="font-display text-2xl font-semibold text-brown mb-4">No open roles right now</h2>
        <p className="text-brown/70 mb-8">
          We&apos;re a lean team and don&apos;t have active openings at the moment. But we&apos;re growing, and we&apos;d
          love to hear from people who care about baking, whole ingredients, or building a D2C brand the honest way —
          especially for roles in baking/production, customer support, and logistics as we expand beyond Hyderabad.
        </p>
        <Link href="/contact" className="btn-primary">Reach Out Anyway</Link>
      </div>
    </div>
  )
}
