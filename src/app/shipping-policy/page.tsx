import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Shipping Policy',
  description: 'Delivery timelines and shipping costs for Fondible orders across India.',
  alternates:  { canonical: 'https://fondible.in/shipping-policy' },
}

const ROWS = [
  { area: 'Hyderabad', days: '1 day', cost: 'Free' },
  { area: 'Mumbai, Delhi, Bangalore, Chennai, Pune', days: '3 days', cost: '₹60 (free above ₹499)' },
  { area: 'Rest of India', days: '4-5 business days', cost: '₹60 (free above ₹499)' },
]

export default function ShippingPolicyPage() {
  return (
    <div className="page-container py-16 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <span className="section-label">Delivery</span>
        <h1 className="section-title text-brown mt-2">Shipping Policy</h1>
        <p className="mt-4 text-sm text-brown/50">Last updated: July 2026</p>
      </div>

      <div className="space-y-8 text-brown/80 leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">Where We Deliver</h2>
          <p>We ship pan-India. Every 6-digit Indian pincode is serviceable — enter yours at checkout to see the exact delivery estimate and cost for your location.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-4">Delivery Timelines & Cost</h2>
          <div className="card-base overflow-hidden">
            <div className="grid grid-cols-3 bg-cream text-xs font-bold uppercase tracking-wider text-brown/50 px-5 py-3">
              <span>Area</span><span>Delivery Time</span><span>Shipping Cost</span>
            </div>
            <div className="divide-y divide-cream-dark">
              {ROWS.map(row => (
                <div key={row.area} className="grid grid-cols-3 px-5 py-4 text-sm">
                  <span className="font-medium text-brown">{row.area}</span>
                  <span className="text-brown/70">{row.days}</span>
                  <span className="text-brown/70">{row.cost}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">Order Processing</h2>
          <p>We bake fresh once your order is confirmed. Orders are typically dispatched within 24 hours of confirmation, and the delivery estimate above begins from dispatch, not order placement.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">Tracking Your Order</h2>
          <p>Once your order ships, you&apos;ll receive tracking information via email and WhatsApp. You can also view live order status anytime from your account dashboard.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">Delays</h2>
          <p>While we aim to meet every delivery estimate, occasional delays can happen due to courier network issues, weather, or high-demand periods. We&apos;ll always keep you informed if your order is running behind schedule.</p>
        </section>
      </div>
    </div>
  )
}
