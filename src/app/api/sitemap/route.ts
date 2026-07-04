// src/app/api/sitemap/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fondible.in'

  const [products, blogs] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.blog.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ])

  const staticPages = ['', '/about', '/shop', '/our-ingredients', '/ingredients',
    '/contact', '/faq', '/corporate-gifting', '/franchise', '/careers',
    '/privacy-policy', '/terms', '/shipping-policy', '/return-policy', '/blog', '/track-order']

  const urls = [
    ...staticPages.map(p => ({ loc: `${BASE}${p}`, changefreq: 'weekly', priority: p === '' ? '1.0' : '0.8' })),
    ...products.map(p => ({ loc: `${BASE}/shop/${p.slug}`, changefreq: 'weekly', priority: '0.9', lastmod: p.updatedAt.toISOString() })),
    ...blogs.map(b => ({ loc: `${BASE}/blog/${b.slug}`, changefreq: 'monthly', priority: '0.7', lastmod: b.updatedAt.toISOString() })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  })
}
