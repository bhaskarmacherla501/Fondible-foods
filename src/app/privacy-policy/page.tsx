import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Privacy Policy',
  description: 'How Fondible collects, uses, and protects your personal information.',
  alternates:  { canonical: 'https://fondible.in/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="page-container py-16 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <span className="section-label">Legal</span>
        <h1 className="section-title text-brown mt-2">Privacy Policy</h1>
        <p className="mt-4 text-sm text-brown/50">Last updated: July 2026</p>
      </div>

      <div className="space-y-8 text-brown/80 leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">1. Information We Collect</h2>
          <p>When you create an account, place an order, or contact us, we collect information such as your name, email address, phone number, delivery address, and order history. If you sign in with Google, we receive your name, email, and profile picture from Google.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">2. How We Use Your Information</h2>
          <p>We use your information to process and deliver orders, send order updates via email and WhatsApp, provide customer support, and improve our products and service. We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">3. Sharing With Third Parties</h2>
          <p>To fulfil your order, we share necessary information with our payment processor (Razorpay) for secure payment processing, and with our logistics partners for delivery. These partners are only given the information required to complete their part of the order.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">4. Cookies</h2>
          <p>We use cookies to keep you signed in, remember items in your cart, and understand how our site is used. You can disable cookies in your browser settings, though some features of the site may not work correctly without them.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">5. Data Security</h2>
          <p>We take reasonable technical and organisational measures to protect your personal information. Payment details are handled entirely by Razorpay and are never stored on our servers.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">6. Your Rights</h2>
          <p>You can access, update, or request deletion of your personal information at any time from your account dashboard, or by contacting us at hello@fondible.in.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-brown mb-3">7. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, reach out at hello@fondible.in or through our Contact page.</p>
        </section>
      </div>
    </div>
  )
}
