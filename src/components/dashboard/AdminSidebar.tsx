'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart2,
  Archive, Tag, FileText, Image as ImageIcon, Settings,
  Globe, LogOut, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { title: 'Overview',   links: [
    { href: '/admin',             icon: LayoutDashboard, label: 'Dashboard'  },
    { href: '/admin/analytics',   icon: BarChart2,       label: 'Analytics'  },
  ]},
  { title: 'Catalogue',  links: [
    { href: '/admin/products',    icon: Package,         label: 'Products'   },
    { href: '/admin/inventory',   icon: Archive,         label: 'Inventory'  },
  ]},
  { title: 'Commerce',   links: [
    { href: '/admin/orders',      icon: ShoppingBag,     label: 'Orders'     },
    { href: '/admin/customers',   icon: Users,           label: 'Customers'  },
    { href: '/admin/coupons',     icon: Tag,             label: 'Coupons'    },
  ]},
  { title: 'Content',    links: [
    { href: '/admin/blogs',       icon: FileText,        label: 'Blogs'      },
    { href: '/admin/banners',     icon: ImageIcon,       label: 'Banners'    },
    { href: '/admin/seo',         icon: Globe,           label: 'SEO'        },
  ]},
  { title: 'Config',     links: [
    { href: '/admin/settings',    icon: Settings,        label: 'Settings'   },
  ]},
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-60 flex-shrink-0 bg-brown min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8">
        <Link href="/">
          <Image src="/images/logo-white.png" alt="Fondible" width={100} height={36} className="h-9 w-auto object-contain" />
        </Link>
        <span className="text-2xs text-gold/70 tracking-widest uppercase mt-1 block">Admin Panel</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {SECTIONS.map(section => (
          <div key={section.title}>
            <p className="text-2xs font-bold tracking-widest uppercase text-cream/30 px-3 mb-2">{section.title}</p>
            <div className="space-y-0.5">
              {section.links.map(link => {
                const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
                return (
                  <Link key={link.href} href={link.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                      active
                        ? 'bg-gold text-brown font-semibold'
                        : 'text-cream/70 hover:bg-white/8 hover:text-cream'
                    )}>
                    <span className="flex items-center gap-3">
                      <link.icon className="w-4 h-4 flex-shrink-0" />
                      {link.label}
                    </span>
                    {active && <ChevronRight className="w-3 h-3" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/8">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/60 hover:bg-white/8 hover:text-cream transition-colors mb-1">
          <Globe className="w-4 h-4" /> View Live Site
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
