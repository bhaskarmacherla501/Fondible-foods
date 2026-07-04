import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { BlogForm } from '@/components/dashboard/BlogForm'

export default function NewBlogPage() {
  return (
    <div>
      <Link href="/admin/blogs" className="inline-flex items-center gap-1 text-sm text-brown/60 hover:text-gold mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Blogs
      </Link>
      <h1 className="font-display text-2xl font-semibold text-brown mb-6">New Post</h1>
      <BlogForm />
    </div>
  )
}
