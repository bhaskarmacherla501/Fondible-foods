import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://fondible.in'),
  title: {
    default:  'Fondible — Better Food. Better Living.',
    template: '%s | Fondible',
  },
  description: 'Premium cookies baked with whole wheat, real butter, whole nuts and jaggery — zero refined sugar, zero artificial ingredients, zero shortcuts. Freshly baked and delivered across India.',
  keywords:    ['whole wheat cookies', 'real butter cookies', 'jaggery cookies', 'clean ingredient cookies', 'no refined sugar cookies', 'healthy cookies India', 'no preservative cookies', 'artisanal cookies India', 'Fondible', 'no maida cookies', 'whole ingredient baking'],
  authors:     [{ name: 'Fondible' }],
  creator:     'Fondible',
  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         'https://fondible.in',
    siteName:    'Fondible',
    title:       'Fondible — Better Food. Better Living.',
    description: 'Cookies baked with whole wheat, real butter, whole nuts and jaggery. No refined sugar. No artificial ingredients. No shortcuts.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Fondible Cookies' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Fondible — Better Food. Better Living.',
    description: 'Cookies baked with whole wheat, real butter, whole nuts and jaggery. No refined sugar. No artificial ingredients.',
    images:      ['/images/og-image.jpg'],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon:  [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#2C1810',
  width:      'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="bg-cream font-body text-brown antialiased">
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#2C1810',
                color:      '#F7F2E8',
                borderRadius: '100px',
                fontSize:   '0.85rem',
                fontFamily: 'DM Sans, sans-serif',
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
