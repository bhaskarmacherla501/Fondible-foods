import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { InventoryTable } from '@/components/dashboard/InventoryTable'

export const metadata: Metadata = { title: 'Inventory | Fondible Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminInventoryPage() {
  const variants = await prisma.productVariant.findMany({
    where:   { isActive: true },
    include: { product: { select: { name: true } } },
    orderBy: { stock: 'asc' },
  })

  const lowStockCount = variants.filter(v => v.stock <= v.lowStockAt).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brown">Inventory</h1>
        <p className="text-sm text-brown/60 mt-1">
          {variants.length} variants tracked
          {lowStockCount > 0 && <span className="text-red-600 font-semibold"> · {lowStockCount} low on stock</span>}
        </p>
      </div>

      <InventoryTable
        variants={variants.map(v => ({
          id: v.id, productId: v.productId, productName: v.product.name,
          name: v.name, sku: v.sku, stock: v.stock, lowStockAt: v.lowStockAt,
        }))}
      />
    </div>
  )
}
