import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title:       'Corporate Gifting — Premium Clean-Ingredient Cookies',
  description: 'Bulk and corporate gifting with premium clean-ingredient cookies. Real butter, whole wheat, jaggery sweetened. Custom branding available for orders of 20+ boxes.',
  alternates:  { canonical: 'https://fondible.in/corporate-gifting' },
}

const SELLING_POINTS = [
  'Real ingredients your recipients will notice and appreciate',
  'Packaging that looks premium and tells the clean-ingredient story',
  'Minimum 20 boxes. Custom branding available.',
  'Diabetic-friendly options available — jaggery sweetened, no refined sugar',
  'Bulk pricing with GST invoice',
]

export default function CorporateGiftingPage() {
  return (
    <>
      <section className="page-container pt-16 pb-12 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="section-label">Corporate Gifting</span>
          <h1 className="section-title text-brown mt-2">Give Gifts People Actually Want to Eat</h1>
          <p className="mt-6 text-brown/70 text-lg leading-relaxed">
            Premium clean-ingredient cookies — zero guilt, maximum delight. Perfect for clients,
            teams, and celebrations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">Enquire for Bulk Orders</Link>
            <Link href="/shop" className="btn-secondary">Browse Cookies</Link>
          </div>
        </div>
      </section>

      <section className="page-container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card-base p-8 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-brown mb-6">Why Businesses Choose Fondible</h2>
            <ul className="space-y-4">
              {SELLING_POINTS.map(point => (
                <li key={point} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-brown/80">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
