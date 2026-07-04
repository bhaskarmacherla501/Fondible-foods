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
        <span>Hyderabad Delivery</span>
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
                  className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-brown/70 rounded-xl hover:text-brown hover:bg-gold/8 transition-all duration-200">
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

            {/* Order Now (WA) */}
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER ?? '918019730055'}?text=Hi%20Fondible!%20I%20want%20to%20order%20cookies%20🍪`}
              target="_blank" rel="noopener noreferrer"
              className="hidden md:inline-flex btn-wa py-2 px-4 text-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.552 4.116 1.515 5.849L.057 23.9a.5.5 0 00.611.611l6.051-1.458A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.806-.498-5.42-1.374l-.39-.22-4.04.975.997-3.965-.24-.383A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Order Now
            </a>

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
