import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title:       'Blog — Clean Eating, Real Talk',
  description: 'Stories on whole ingredients, clean baking, and honest food from the Fondible kitchen.',
  alternates:  { canonical: 'https://fondible.in/blog' },
}

export default async function BlogListingPage() {
  const blogs = await prisma.blog.findMany({
    where:   { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="page-container py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="section-label">From the Blog</span>
        <h1 className="section-title text-brown mt-2">Clean Eating, Real Talk</h1>
        <p className="mt-4 text-brown/70">Stories on whole ingredients, clean baking, and honest food.</p>
      </div>

      {blogs.length === 0 ? (
        <p className="text-center text-brown/50 py-12">No posts yet — check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map(blog => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="card-base card-hover overflow-hidden group">
              <div className="relative aspect-video bg-cream-dark overflow-hidden">
                {blog.coverImage && (
                  <Image src={blog.coverImage} alt={blog.title} fill sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
              </div>
              <div className="p-5">
                {blog.category && <span className="badge-gold mb-2 inline-block">{blog.category}</span>}
                {blog.publishedAt && <p className="text-xs text-brown/50 mb-2">{formatDate(blog.publishedAt)}</p>}
                <h2 className="font-semibold text-brown mb-2">{blog.title}</h2>
                {blog.excerpt && <p className="text-sm text-brown/60 line-clamp-2">{blog.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
