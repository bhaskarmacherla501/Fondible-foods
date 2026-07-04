'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingBag, Menu, X, User, ChevronDown, Heart, Bell, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart.store'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Shop',            href: '/shop' },
  { label: 'Our Ingredients', href: '/our-ingredients' },
  { label: 'About',           href: '/about' },
  { label: 'Blog',            href: '/blog' },
  { label: 'Bulk Orders',     href: '/corporate-gifting' },
]

export function Navbar() {
  const { data: session } = useSession()
  const { itemCount }     = useCartStore()
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [cartOpen,    setCartOpen]    = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      {/* Topbar */}
      <div className="fixed top-0 inset-x-0 z-50 bg-brown text-gold-pale h-9 flex items-center justify-center gap-4 text-2xs font-medium tracking-widest uppercase">
        <span>Real Butter · Whole Wheat · Jaggery Only</span>
        <span className="w-1 h-1 rounded-full bg-gold inline-block" />
        <span>Baked Fresh Daily</span>
        <span className="w-1 h-1 rounded-full bg-gold inline-block" />
        <span>Pan-India Delivery</span>
      </div>

      {/* Main Nav */}
      <nav className={cn(
        'fixed top-9 inset-x-0 z-40 transition-all duration-300',
        scrolled ? 'bg-cream/95 backdrop-blur-md shadow-brand-md' : 'bg-cream/90 backdrop-blur-sm'
      )}>
        <div className="page-container flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/logo.png" alt="Fondible" width={120} height={40} className="h-10 w-auto object-contain" priority />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link href={link.href}
                  className="navbar-link px-4 py-2 uppercase text-brown/70 rounded-xl hover:text-brown hover:bg-gold/8 transition-all duration-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <button
              onClick={() => useCartStore.setState({ open: true } as never)}
              className="relative p-2.5 rounded-xl hover:bg-gold/10 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-brown" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gold text-brown text-2xs font-black rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {session?.user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(p => !p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gold/10 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-brown/10 flex items-center justify-center overflow-hidden">
                    {session.user.image
                      ? <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full" />
                      : <User className="w-4 h-4 text-brown/60" />
                    }
                  </div>
                  <ChevronDown className={cn('w-3 h-3 text-brown/60 transition-transform', profileOpen && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-brand-lg border border-gold/10 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-cream-dark">
                        <p className="text-sm font-semibold text-brown truncate">{session.user.name}</p>
                        <p className="text-xs text-brown/50 truncate">{session.user.email}</p>
                      </div>
                      <div className="p-2">
                        {[
                          { href: '/dashboard',           label: 'My Dashboard', icon: User },
                          { href: '/dashboard/orders',    label: 'My Orders',    icon: ShoppingBag },
                          { href: '/dashboard/wishlist',  label: 'Wishlist',     icon: Heart },
                          { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
                        ].map(item => (
                          <Link key={item.href} href={item.href}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-brown/80 hover:bg-gold/8 hover:text-brown transition-colors">
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        ))}
                        {['ADMIN', 'SUPER_ADMIN'].includes(session.user.role) && (
                          <Link href="/admin" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gold font-semibold hover:bg-gold/8 transition-colors">
                            ⚙️ Admin Panel
                          </Link>
                        )}
                        <button onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="btn-primary py-2 px-4 text-xs hidden sm:inline-flex">
                Sign In
              </Link>
            )}

            {/* Shop Now */}
            <Link href="/shop"
              className="hidden md:inline-flex btn-wa py-2 px-4 text-xs">
              <ShoppingBag className="w-4 h-4" />
              Shop Now
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(o => !o)} className="lg:hidden p-2 rounded-xl hover:bg-gold/10 transition-colors" aria-label="Menu">
              {mobileOpen ? <X className="w-5 h-5 text-brown" /> : <Menu className="w-5 h-5 text-brown" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-cream-dark overflow-hidden"
            >
              <div className="page-container py-4 space-y-1">
                {NAV_LINKS.map(link => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-brown/80 hover:bg-gold/8 hover:text-brown transition-colors">
                    {link.label}
                  </Link>
                ))}
                {!session?.user && (
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block btn-primary text-center mt-4">
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer */}
      <div className="h-[100px]" />
    </>
  )
}
