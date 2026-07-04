import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Return Policy',
  description: 'Fondible\'s return, replacement, and refund policy for perishable baked goods.',
  alternates:  { canonical: 'https://fondible.in/return-policy' },
}

export default function ReturnPolicyPage() {
  return (
    <div className="page-container py-16 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <span className="section-label">Returns & Refunds</span>
        <h1 className="section-title text-brown mt-2">Return Policy</h1>
        <p className="mt-4 text-sm text-brown/50">Last updated: July 2026</p>
      </div>

      <div className="space-y-8 text-brown/80 leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">Why Our Policy Is Different</h2>
          <p>Our cookies are freshly baked with real butter and no preservatives, which means they&apos;re perishable and cannot be resold once they leave our kitchen. For this reason, we cannot accept returns or exchanges simply due to a change of mind.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">When We Will Make It Right</h2>
          <p>We will offer a full replacement or refund if:</p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 text-brown/70">
            <li>Your order arrives damaged or visibly spoiled</li>
            <li>You received the wrong product or pack size</li>
            <li>Your order didn&apos;t arrive within a reasonable window past the estimated delivery date</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">How to Request a Replacement or Refund</h2>
          <p>Contact us within 48 hours of delivery with your order number and a photo of the issue, via the Contact page, email, or WhatsApp. We&apos;ll review and respond within 1-2 business days.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">Refund Processing</h2>
          <p>Approved refunds are issued to your original payment method and typically reflect within 5-7 business days, depending on your bank. Cash on Delivery refunds are processed via bank transfer or store credit.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">Cancellations</h2>
          <p>Orders can be cancelled free of charge before they enter baking. Once your order status shows &ldquo;Confirmed&rdquo; or later, we&apos;ve likely already started baking and cannot cancel it — reach out immediately if you need to make a change.</p>
        </section>
      </div>
    </div>
  )
}
