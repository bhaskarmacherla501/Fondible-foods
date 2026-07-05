'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  image: string
  mobileImage: string | null
  link: string | null
}

export function PromoBanner({ banners }: { banners: Banner[] }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (banners.length < 2) return
    const timer = setInterval(() => setActive(i => (i + 1) % banners.length), 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (banners.length === 0) return null

  return (
    <section className="relative w-full overflow-hidden bg-cream">
      {banners.map((banner, i) => {
        const content = (
          <div className="relative w-full aspect-[16/6] md:aspect-[21/6]">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              priority={i === 0}
              className="object-cover hidden md:block"
            />
            <Image
              src={banner.mobileImage || banner.image}
              alt={banner.title}
              fill
              priority={i === 0}
              className="object-cover md:hidden"
            />
            {banner.subtitle && (
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 bg-gradient-to-r from-black/40 via-black/10 to-transparent">
                <h2 className="font-display text-xl md:text-3xl font-semibold text-white drop-shadow-sm">{banner.title}</h2>
                <p className="text-xs md:text-base text-white/90 mt-1">{banner.subtitle}</p>
              </div>
            )}
          </div>
        )

        return (
          <div key={banner.id} className={i === active ? 'block' : 'hidden'}>
            {banner.link ? <Link href={banner.link}>{content}</Link> : content}
          </div>
        )
      })}

      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((b, i) => (
            <button
              key={b.id}
              aria-label={`Show banner ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
