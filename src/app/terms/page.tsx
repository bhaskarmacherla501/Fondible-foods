import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Terms & Conditions',
  description: 'Terms and conditions for using the Fondible website and placing orders.',
  alternates:  { canonical: 'https://fondible.in/terms' },
}

export default function TermsPage() {
  return (
    <div className="page-container py-16 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <span className="section-label">Legal</span>
        <h1 className="section-title text-brown mt-2">Terms & Conditions</h1>
        <p className="mt-4 text-sm text-brown/50">Last updated: July 2026</p>
      </div>

      <div className="space-y-8 text-brown/80 leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using the Fondible website and placing an order, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">2. Orders & Pricing</h2>
          <p>All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices at any time; the price at the time of order confirmation applies to that order. Orders are subject to product availability.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">3. Payments</h2>
          <p>We accept payments via UPI, credit/debit cards, and other methods offered through Razorpay, as well as Cash on Delivery where available. Your order is confirmed only once payment is successfully processed, or immediately for Cash on Delivery orders.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">4. Product Information</h2>
          <p>We describe our ingredients and products as accurately as possible. Because our cookies are baked in small batches with whole ingredients, minor variation in appearance between batches is normal and not a defect.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">5. Intellectual Property</h2>
          <p>All content on this website — including the Fondible name, logo, product photography, and written content — is the property of Fondible and may not be reproduced without permission.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">6. Limitation of Liability</h2>
          <p>Fondible is not liable for delays caused by circumstances beyond our reasonable control, including courier delays, weather, or other force majeure events. Our liability for any claim is limited to the value of the order in question.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">7. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts of Hyderabad, Telangana.</p>
        </section>
      </div>
    </div>
  )
}
