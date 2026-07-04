'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, ShoppingBag, MapPin, Heart,
  Gift, Star, Bell, FileText, RefreshCw, LogOut, Tag
} from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/dashboard',                  icon: LayoutDashboard, label: 'Overview'          },
  { href: '/dashboard/orders',           icon: ShoppingBag,     label: 'My Orders'         },
  { href: '/dashboard/addresses',        icon: MapPin,          label: 'Addresses'         },
  { href: '/dashboard/wishlist',         icon: Heart,           label: 'Wishlist'          },
  { href: '/dashboard/subscriptions',    icon: RefreshCw,       label: 'Subscriptions'     },
  { href: '/dashboard/rewards',          icon: Star,            label: 'Rewards & Points'  },
  { href: '/dashboard/referral',         icon: Gift,            label: 'Refer & Earn'      },
  { href: '/dashboard/notifications',    icon: Bell,            label: 'Notifications'     },
  { href: '/dashboard/invoices',         icon: FileText,        label: 'Invoices'          },
]

interface Props {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role: string }
}

export function DashboardSidebar({ user }: Props) {
  const pathname = usePathname()
  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      {/* Profile */}
      <div className="card-base p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-cream-dark flex-shrink-0">
            {user.image
              ? <Image src={user.image} alt={user.name ?? ''} width={48} height={48} className="rounded-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center font-display text-xl font-semibold text-brown">
                  {user.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brown truncate">{user.name ?? 'Cookie Lover'}</p>
            <p className="text-xs text-brown/50 truncate">{user.email}</p>
          </div>
        </div>
        <Link href="/dashboard/profile"
          className="w-full text-center btn-secondary py-2 text-xs block">
          Edit Profile
        </Link>
      </div>

      {/* Navigation */}
      <nav className="card-base p-3 space-y-1">
        {LINKS.map(link => (
          <Link key={link.href} href={link.href}
            className={cn('sidebar-link', pathname === link.href && 'active')}>
            <link.icon className="w-4 h-4 flex-shrink-0" />
            {link.label}
          </Link>
        ))}
        <div className="border-t border-cream-dark my-2" />
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className="sidebar-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </nav>
    </aside>
  )
}
