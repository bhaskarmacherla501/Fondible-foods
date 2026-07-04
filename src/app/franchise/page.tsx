import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title:       'Franchise With Fondible',
  description: 'Bring Fondible\'s clean-ingredient cookie brand to your city. Franchise opportunities now open.',
  alternates:  { canonical: 'https://fondible.in/franchise' },
}

const WHY_POINTS = [
  'A genuine point of difference — whole wheat, real butter, jaggery only, in a market full of "healthy-washed" cookies',
  'Proven recipes and a small-batch production process, ready to be replicated',
  'Brand identity, packaging, and marketing assets provided',
  'Support with sourcing, training, and initial setup',
]

const REQUIREMENTS = [
  'A commercial kitchen space or the ability to set one up',
  'Commitment to sourcing real butter, whole wheat, and jaggery — no substitutions',
  'Local delivery capability (own fleet or third-party logistics)',
  'Investment details shared directly during the application process',
]

export default function FranchisePage() {
  return (
    <div className="page-container py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="section-label">Partner With Us</span>
        <h1 className="section-title text-brown mt-2">Franchise With Fondible</h1>
        <p className="mt-4 text-brown/70">Bring our clean-ingredient cookie brand to your city.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-14">
        <div className="card-base p-8">
          <h2 className="font-display text-xl font-semibold text-brown mb-4">Why Fondible</h2>
          <ul className="space-y-3">
            {WHY_POINTS.map(point => (
              <li key={point} className="flex items-start gap-3 text-sm text-brown/70">
                <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" /> {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-base p-8">
          <h2 className="font-display text-xl font-semibold text-brown mb-4">What We Look For</h2>
          <ul className="space-y-3">
            {REQUIREMENTS.map(point => (
              <li key={point} className="flex items-start gap-3 text-sm text-brown/70">
                <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" /> {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-2xl mx-auto text-center card-base p-10">
        <h2 className="font-display text-2xl font-semibold text-brown mb-4">Interested in franchising?</h2>
        <p className="text-brown/70 mb-8">
          Tell us about your city, your background, and why you&apos;d be a good fit — we review every enquiry personally.
        </p>
        <Link href="/contact" className="btn-primary">Start a Conversation</Link>
      </div>
    </div>
  )
}
