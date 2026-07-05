import type { Metadata } from 'next'
import { Mail, Phone, MapPin } from 'lucide-react'
import { getStoreSettings } from '@/lib/settings'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title:       'Contact Us',
  description: 'Get in touch with Fondible for order questions, bulk pricing, or anything else.',
  alternates:  { canonical: 'https://fondible.in/contact' },
}
export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const settings = await getStoreSettings()

  return (
    <div className="page-container py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="section-label">Get In Touch</span>
        <h1 className="section-title text-brown mt-2">Contact Us</h1>
        <p className="mt-4 text-brown/70">Questions about an order, bulk pricing, or just want to say hi? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="card-base p-5">
            <Mail className="w-5 h-5 text-gold mb-2" />
            <p className="text-sm font-semibold text-brown">Email</p>
            <p className="text-sm text-brown/60">{settings.supportEmail}</p>
          </div>
          <div className="card-base p-5">
            <Phone className="w-5 h-5 text-gold mb-2" />
            <p className="text-sm font-semibold text-brown">WhatsApp / Phone</p>
            <p className="text-sm text-brown/60">{settings.supportPhone}</p>
          </div>
          <div className="card-base p-5">
            <MapPin className="w-5 h-5 text-gold mb-2" />
            <p className="text-sm font-semibold text-brown">Based in</p>
            <p className="text-sm text-brown/60">{settings.address} — shipping pan-India</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
