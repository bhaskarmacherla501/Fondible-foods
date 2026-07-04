import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { WishlistClient } from '@/components/dashboard/WishlistClient'

export default async function WishlistPage() {
  const session = await auth()
  const items = await prisma.wishlistItem.findMany({
    where:   { userId: session!.user.id },
    include: { product: { include: { variants: { where: { isActive: true }, take: 1, orderBy: { sortOrder: 'asc' } } } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown mb-6">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="card-base p-10 text-center">
          <p className="text-brown/60 mb-4">Your wishlist is empty.</p>
          <Link href="/shop" className="btn-primary">Browse Cookies</Link>
        </div>
      ) : (
        <WishlistClient
          items={items.map(i => ({
            id: i.id,
            product: {
              id: i.product.id, name: i.product.name, slug: i.product.slug,
              images: i.product.images,
              variant: i.product.variants[0] ? {
                id: i.product.variants[0].id, name: i.product.variants[0].name,
                price: i.product.variants[0].price, stock: i.product.variants[0].stock,
              } : null,
            },
          }))}
        />
      )}
    </div>
  )
}
