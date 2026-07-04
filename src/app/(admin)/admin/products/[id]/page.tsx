import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import prisma from '@/lib/prisma'
import { ProductEditForm } from '@/components/dashboard/ProductEditForm'

export const dynamic = 'force-dynamic'

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where:   { id },
    include: { variants: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!product) notFound()

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-brown/60 hover:text-gold mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Products
      </Link>
      <h1 className="font-display text-2xl font-semibold text-brown mb-6">{product.name}</h1>
      <ProductEditForm product={product} />
    </div>
  )
}
