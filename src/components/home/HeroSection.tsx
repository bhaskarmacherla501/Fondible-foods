import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const HERO_PILLS = [
  { emoji: '🧈', label: 'Real Butter' },
  { emoji: '🌾', label: 'Whole Wheat' },
  { emoji: '🍯', label: 'Jaggery Only' },
  { emoji: '🥜', label: 'Whole Nuts' },
  { emoji: '✨', label: 'Zero Chemicals' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient pt-8 pb-20 md:pt-16 md:pb-28">
      <div className="page-container grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="section-label">Better Food. Better Living.</span>
          <h1 className="section-title text-brown mt-2">
            Cookies that love you back
          </h1>
          <p className="mt-6 text-brown/70 text-lg max-w-md">
            Baked with whole wheat, real butter, whole nuts and jaggery — nothing hidden,
            nothing artificial. Just honest indulgence, delivered across Hyderabad.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/shop" className="btn-primary">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/our-ingredients" className="btn-secondary">
              Our Ingredients
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-2.5">
            {HERO_PILLS.map(pill => (
              <span key={pill.label} className="badge-gold">
                {pill.emoji} {pill.label}
              </span>
            ))}
          </div>
        </div>
        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-brand-lg bg-card-gradient">
          <Image src="/images/hero-cookies.jpg" alt="Fondible cookies baked with whole ingredients" fill className="object-cover" priority />
        </div>
      </div>
    </section>
  )
}
