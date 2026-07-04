import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

interface BlogPreviewItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  publishedAt: Date | null
}

export function BlogPreview({ blogs }: { blogs: BlogPreviewItem[] }) {
  if (blogs.length === 0) return null

  return (
    <section className="bg-cream-dark py-20">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">From the Blog</span>
          <h2 className="section-title text-brown mt-2">Clean Eating, Real Talk</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map(b => (
            <Link key={b.id} href={`/blog/${b.slug}`} className="card-base card-hover overflow-hidden group">
              <div className="relative aspect-video bg-cream overflow-hidden">
                {b.coverImage && (
                  <Image src={b.coverImage} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
              </div>
              <div className="p-5">
                {b.publishedAt && <p className="text-xs text-brown/50 mb-2">{formatDate(b.publishedAt)}</p>}
                <h3 className="font-semibold text-brown mb-2">{b.title}</h3>
                {b.excerpt && <p className="text-sm text-brown/60 line-clamp-2">{b.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
