import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Blogs | Fondible Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams
  const blogs = await prisma.blog.findMany({
    where:   search ? { title: { contains: search, mode: 'insensitive' } } : {},
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brown">Blogs</h1>
          <p className="text-sm text-brown/60 mt-1">{blogs.length} posts</p>
        </div>
        <div className="flex items-center gap-3">
          <form action="/admin/blogs" method="get" className="relative">
            <Search className="w-4 h-4 text-brown/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" name="search" defaultValue={search} placeholder="Search posts..."
              className="input-base pl-9 py-2 text-sm w-56" />
          </form>
          <Link href="/admin/blogs/new" className="btn-primary py-2 px-4 text-sm">
            <Plus className="w-4 h-4" /> New Post
          </Link>
        </div>
      </div>

      <div className="card-base overflow-hidden">
        {blogs.length === 0 ? (
          <p className="text-center text-brown/50 py-12">No posts yet. Create your first one.</p>
        ) : (
          <div className="divide-y divide-cream-dark">
            {blogs.map(blog => (
              <Link key={blog.id} href={`/admin/blogs/${blog.id}`}
                className="flex items-center justify-between gap-4 p-5 hover:bg-cream/60 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brown truncate">{blog.title}</p>
                  <p className="text-xs text-brown/50">
                    {blog.category ?? 'Uncategorized'} · {blog.publishedAt ? `Published ${formatDate(blog.publishedAt)}` : `Created ${formatDate(blog.createdAt)}`}
                  </p>
                </div>
                <span className={`badge flex-shrink-0 ${blog.isPublished ? 'badge-green' : 'bg-gray-100 text-gray-600'}`}>
                  {blog.isPublished ? 'Published' : 'Draft'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
