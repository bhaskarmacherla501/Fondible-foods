import { MessageCircle, ShoppingCart, CreditCard, Truck } from 'lucide-react'

const STEPS = [
  { icon: ShoppingCart, title: 'Pick Your Cookies', desc: 'Browse the shop and choose your favourite flavours.' },
  { icon: CreditCard, title: 'Checkout Securely', desc: 'Pay via UPI, card, or cash on delivery.' },
  { icon: Truck, title: 'Freshly Baked & Shipped', desc: 'We bake your order and ship it within 24-48 hours.' },
  { icon: MessageCircle, title: 'Need Help?', desc: 'Message us on WhatsApp anytime — we reply fast.' },
]

export function HowToOrder() {
  return (
    <section className="page-container py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="section-label">Simple & Fast</span>
        <h2 className="section-title text-brown mt-2">How to Order</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative card-base p-6 text-center">
            <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gold text-brown font-bold text-sm flex items-center justify-center shadow-brand-sm">
              {i + 1}
            </span>
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gold/10 flex items-center justify-center mb-4">
              <s.icon className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-semibold text-brown mb-2">{s.title}</h3>
            <p className="text-sm text-brown/60">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
