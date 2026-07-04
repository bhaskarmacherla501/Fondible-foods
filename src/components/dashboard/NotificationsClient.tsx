'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, BellRing } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface NotificationData {
  id: string
  type: string
  title: string
  body: string
  link: string | null
  isRead: boolean
  createdAt: string
}

export function NotificationsClient({ notifications }: { notifications: NotificationData[] }) {
  const router = useRouter()

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' })
    router.refresh()
  }

  const Item = ({ n }: { n: NotificationData }) => (
    <div
      className={cn('flex items-start gap-4 p-5', !n.isRead && 'bg-gold/5')}
      onClick={() => !n.isRead && markRead(n.id)}
    >
      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', n.isRead ? 'bg-cream' : 'bg-gold/15')}>
        {n.isRead ? <Bell className="w-4 h-4 text-brown/40" /> : <BellRing className="w-4 h-4 text-gold" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm', n.isRead ? 'text-brown/70' : 'font-semibold text-brown')}>{n.title}</p>
        <p className="text-xs text-brown/50 mt-0.5">{n.body}</p>
        <p className="text-xs text-brown/40 mt-1">{formatDateTime(n.createdAt)}</p>
      </div>
      {!n.isRead && <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-1.5" />}
    </div>
  )

  return (
    <div className="card-base divide-y divide-cream-dark cursor-pointer">
      {notifications.map(n => (
        n.link
          ? <Link key={n.id} href={n.link} className="block hover:bg-cream/60 transition-colors" onClick={() => !n.isRead && markRead(n.id)}><Item n={n} /></Link>
          : <div key={n.id} className="hover:bg-cream/60 transition-colors"><Item n={n} /></div>
      ))}
    </div>
  )
}
