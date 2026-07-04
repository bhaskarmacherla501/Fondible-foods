import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ProfileClient } from '@/components/dashboard/ProfileClient'

export default async function ProfilePage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where:  { id: session!.user.id },
    select: { name: true, email: true, phone: true, referralCode: true },
  })

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown mb-6">Edit Profile</h1>
      <ProfileClient user={user!} />
    </div>
  )
}
