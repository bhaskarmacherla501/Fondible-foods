import Image from 'next/image'
import { Clock, PackageCheck, Truck } from 'lucide-react'

const STEPS = [
  { icon: Clock, title: 'Baked to Order', desc: 'Every batch is baked fresh once your order is placed — never sitting on a shelf.' },
  { icon: PackageCheck, title: 'Sealed for Freshness', desc: 'Packed in air-tight pouches within hours of baking.' },
  { icon: Truck, title: 'Delivered Fast', desc: 'On your doorstep within 2-5 business days depending on your location.' },
]

export function FreshBatchSection() {
  return (
    <section className="bg-cream-dark py-20">
      <div className="page-container grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-brand-md">
          <Image src="/images/fresh-batch.jpg" alt="Freshly baked cookies" fill className="object-cover" />
        </div>
        <div>
          <span className="section-label">Fresh Batch Promise</span>
          <h2 className="section-title text-brown mt-2 mb-8">From our oven to your door</h2>
          <div className="space-y-6">
            {STEPS.map(s => (
              <div key={s.title} className="flex gap-4">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gold/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-brown">{s.title}</h3>
                  <p className="text-sm text-brown/60">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
