'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, Trash2 } from 'lucide-react'

interface BlogData {
  id?: string
  title: string
  excerpt: string | null
  content: string
  coverImage: string | null
  category: string | null
  authorName: string | null
  tags: string[]
  isPublished: boolean
}

export function BlogForm({ blog }: { blog?: BlogData }) {
  const router = useRouter()
  const isEditing = !!blog?.id
  const [title, setTitle] = useState(blog?.title ?? '')
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? '')
  const [content, setContent] = useState(blog?.content ?? '')
  const [coverImage, setCoverImage] = useState(blog?.coverImage ?? '')
  const [category, setCategory] = useState(blog?.category ?? '')
  const [authorName, setAuthorName] = useState(blog?.authorName ?? 'Team Fondible')
  const [tags, setTags] = useState(blog?.tags.join(', ') ?? '')
  const [isPublished, setIsPublished] = useState(blog?.isPublished ?? false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title || !content) { toast.error('Title and content are required'); return }
    setSaving(true)
    try {
      const payload = {
        title, excerpt: excerpt || undefined, content,
        coverImage: coverImage || undefined, category: category || undefined,
        authorName: authorName || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        isPublished,
      }
      const res  = await fetch(isEditing ? `/api/blogs/${blog.id}` : '/api/blogs', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.error ?? 'Failed to save post'); return }
      toast.success(isEditing ? 'Post updated' : 'Post created')
      router.push('/admin/blogs')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!blog?.id || !confirm(`Delete "${blog.title}"? This cannot be undone.`)) return
    const res  = await fetch(`/api/blogs/${blog.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!data.success) { toast.error(data.error ?? 'Failed to delete'); return }
    toast.success('Post deleted')
    router.push('/admin/blogs')
    router.refresh()
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="card-base p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="input-base" placeholder="Post title" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Excerpt</label>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} className="input-base"
              placeholder="Short summary shown in previews" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brown block mb-1.5">Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={16} className="input-base font-mono text-sm"
              placeholder="Post content. Separate paragraphs with a blank line." />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-base p-6 space-y-4">
          <h2 className="font-semibold text-brown">Details</h2>
          <div>
            <label className="text-xs font-semibold text-brown/70 block mb-1.5">Cover Image URL</label>
            <input value={coverImage} onChange={e => setCoverImage(e.target.value)} className="input-base text-sm" placeholder="/images/blog/example.jpg" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brown/70 block mb-1.5">Category</label>
            <input value={category} onChange={e => setCategory(e.target.value)} className="input-base text-sm" placeholder="e.g. Ingredients" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brown/70 block mb-1.5">Author</label>
            <input value={authorName} onChange={e => setAuthorName(e.target.value)} className="input-base text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brown/70 block mb-1.5">Tags (comma separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} className="input-base text-sm" placeholder="whole-wheat, jaggery" />
          </div>
          <label className="flex items-center justify-between text-sm text-brown/80 pt-2 border-t border-cream-dark">
            Published <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="accent-[#C8820A] w-4 h-4" />
          </label>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} {isEditing ? 'Save Changes' : 'Create Post'}
        </button>

        {isEditing && (
          <button onClick={handleDelete} className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete Post
          </button>
        )}
      </div>
    </div>
  )
}
