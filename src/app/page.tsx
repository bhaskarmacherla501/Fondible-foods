import type { Metadata } from 'next'
import { Suspense } from 'react'
import { HeroSection }       from '@/components/home/HeroSection'
import { TrustStrip }        from '@/components/home/TrustStrip'
import { BenefitsSection }   from '@/components/home/BenefitsSection'
import { FreshBatchSection } from '@/components/home/FreshBatchSection'
import { FeaturedProducts }  from '@/components/home/FeaturedProducts'
import { WhySection }        from '@/components/home/WhySection'
import { Testimonials }      from '@/components/home/Testimonials'
import { HowToOrder }        from '@/components/home/HowToOrder'
import { BlogPreview }       from '@/components/home/BlogPreview'
import { StickyWA }          from '@/components/common/StickyWA'
import prisma                from '@/lib/prisma'

export const metadata: Metadata = {
  title:       'Fondible — Better Food. Better Living.',
  description: 'Premium cookies baked with whole wheat, real butter, whole nuts and jaggery — zero refined sugar, zero artificial ingredients, zero shortcuts. Freshly baked and delivered in Hyderabad.',
  alternates:  { canonical: 'https://fondible.in' },
}

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where:   { isActive: true, isFeatured: true },
    include: { variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
    take:    6,
  })
}

async function getTestimonials() {
  return prisma.review.findMany({
    where:   { isApproved: true, rating: 5 },
    include: { user: { select: { name: true, image: true } }, product: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take:    6,
  })
}

async function getLatestBlogs() {
  return prisma.blog.findMany({
    where:   { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take:    3,
  })
}

export default async function HomePage() {
  const [products, testimonials, blogs] = await Promise.all([
    getFeaturedProducts(),
    getTestimonials(),
    getLatestBlogs(),
  ])

  return (
    <>
      {/* Schema.org structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type':    'Organization',
        name:       'Fondible',
        url:        'https://fondible.in',
        logo:       'https://fondible.in/images/logo.png',
        description: 'Premium cookies baked with whole wheat, real butter, whole nuts and jaggery. Better Food. Better Living.',
        address:    { '@type': 'PostalAddress', addressLocality: 'Hyderabad', addressCountry: 'IN' },
        contactPoint: { '@type': 'ContactPoint', telephone: '+91-80197-30055', contactType: 'customer service' },
        sameAs:     ['https://www.instagram.com/fondible', 'https://www.facebook.com/fondible'],
      })}} />

      <HeroSection />
      <TrustStrip />

      <Suspense>
        <FeaturedProducts products={products} />
      </Suspense>

      <BenefitsSection />
      <FreshBatchSection />

      <Suspense>
        <WhySection />
      </Suspense>

      <Suspense>
        <Testimonials reviews={testimonials} />
      </Suspense>

      <HowToOrder />

      <Suspense>
        <BlogPreview blogs={blogs} />
      </Suspense>

      <StickyWA />
    </>
  )
}
