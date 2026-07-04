import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NotificationsClient } from '@/components/dashboard/NotificationsClient'

export default async function NotificationsPage() {
  const session = await auth()
  const notifications = await prisma.notification.findMany({
    where:   { userId: session!.user.id },
    orderBy: { createdAt: 'desc' },
    take:    50,
  })

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="card-base p-10 text-center">
          <p className="text-brown/60">You&apos;re all caught up — no notifications yet.</p>
        </div>
      ) : (
        <NotificationsClient
          notifications={notifications.map(n => ({ ...n, createdAt: n.createdAt.toISOString() }))}
        />
      )}
    </div>
  )
}
