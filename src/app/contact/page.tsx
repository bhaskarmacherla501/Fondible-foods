'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Loader2, Mail, Phone, MapPin } from 'lucide-react'
import { validateEmail } from '@/lib/utils'

export default function ContactPage() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(email)) { toast.error('Please enter a valid email address'); return }
    setSending(true)
    try {
      const res  = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || undefined, subject, message }),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Failed to send message'); return }
      toast.success('Message sent!')
      setSent(true)
      setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('')
    } finally {
      setSending(false)
    }
  }

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
            <p className="text-sm text-brown/60">hello@fondible.in</p>
          </div>
          <div className="card-base p-5">
            <Phone className="w-5 h-5 text-gold mb-2" />
            <p className="text-sm font-semibold text-brown">WhatsApp / Phone</p>
            <p className="text-sm text-brown/60">+91 80197 30055</p>
          </div>
          <div className="card-base p-5">
            <MapPin className="w-5 h-5 text-gold mb-2" />
            <p className="text-sm font-semibold text-brown">Based in</p>
            <p className="text-sm text-brown/60">Hyderabad, India — shipping pan-India</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card-base p-8">
            {sent ? (
              <div className="text-center py-10">
                <h2 className="font-display text-2xl font-semibold text-brown mb-2">Thanks for reaching out!</h2>
                <p className="text-brown/60 mb-6">We usually reply within 24 hours.</p>
                <button onClick={() => setSent(false)} className="btn-secondary">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input required placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="input-base" />
                  <input required type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="input-base" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} className="input-base" />
                  <input required placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="input-base" />
                </div>
                <textarea required rows={6} placeholder="How can we help?" value={message} onChange={e => setMessage(e.target.value)} className="input-base" />
                <button type="submit" disabled={sending} className="btn-primary">
                  {sending && <Loader2 className="w-4 h-4 animate-spin" />} Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
