import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { AddressesClient } from '@/components/dashboard/AddressesClient'

export default async function AddressesPage() {
  const session = await auth()
  const addresses = await prisma.address.findMany({
    where:   { userId: session!.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown mb-6">My Addresses</h1>
      <AddressesClient
        addresses={addresses.map(a => ({ ...a, createdAt: a.createdAt.toISOString(), updatedAt: a.updatedAt.toISOString() }))}
      />
    </div>
  )
}
