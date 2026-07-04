import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const blog = await prisma.blog.findUnique({ where: { slug, isPublished: true } })
  if (!blog) return {}

  return {
    title:       blog.seoTitle ?? blog.title,
    description: blog.seoDesc ?? blog.excerpt ?? undefined,
    alternates:  { canonical: `https://fondible.in/blog/${blog.slug}` },
    openGraph:   {
      title: blog.seoTitle ?? blog.title,
      description: blog.seoDesc ?? blog.excerpt ?? undefined,
      images: blog.coverImage ? [{ url: blog.coverImage }] : undefined,
    },
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await prisma.blog.findUnique({ where: { slug, isPublished: true } })
  if (!blog) notFound()

  const paragraphs = blog.content.split(/\n\s*\n/).filter(Boolean)

  return (
    <article className="page-container py-16 max-w-3xl mx-auto">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-brown/60 hover:text-gold mb-8">
        <ChevronLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <div className="text-center mb-10">
        {blog.category && <span className="badge-gold mb-4 inline-block">{blog.category}</span>}
        <h1 className="section-title text-brown mb-4">{blog.title}</h1>
        <p className="text-sm text-brown/50">
          {blog.authorName && `By ${blog.authorName}`}
          {blog.authorName && blog.publishedAt && ' · '}
          {blog.publishedAt && formatDate(blog.publishedAt)}
        </p>
      </div>

      {blog.coverImage && (
        <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-brand-md mb-10">
          <Image src={blog.coverImage} alt={blog.title} fill sizes="768px" className="object-cover" priority />
        </div>
      )}

      <div className="prose-content space-y-5 text-brown/80 leading-relaxed">
        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      {blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-cream-dark">
          {blog.tags.map(tag => <span key={tag} className="badge bg-cream text-brown/60">{tag}</span>)}
        </div>
      )}
    </article>
  )
}
