import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CartConfigHydrator } from '@/components/cart/CartConfigHydrator'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import prisma from '@/lib/prisma'
import { getStoreSettings } from '@/lib/settings'
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

const DEFAULT_TITLE       = 'Fondible — Better Food. Better Living.'
const DEFAULT_DESCRIPTION = 'Premium cookies baked with whole wheat, real butter, whole nuts and jaggery — zero refined sugar, zero artificial ingredients, zero shortcuts. Freshly baked and delivered across India.'
const DEFAULT_OG_IMAGE    = '/images/og-image.jpg'
const DEFAULT_KEYWORDS    = ['whole wheat cookies', 'real butter cookies', 'jaggery cookies', 'clean ingredient cookies', 'no refined sugar cookies', 'healthy cookies India', 'no preservative cookies', 'artisanal cookies India', 'Fondible', 'no maida cookies', 'whole ingredient baking']

async function getSeoSettings() {
  try {
    return await prisma.seoSetting.findFirst()
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSeoSettings()
  const title       = settings?.siteTitle ?? DEFAULT_TITLE
  const description = settings?.metaDescription ?? DEFAULT_DESCRIPTION
  const ogImage      = settings?.ogImage ?? DEFAULT_OG_IMAGE
  const keywords     = settings?.keywords.length ? settings.keywords : DEFAULT_KEYWORDS
  const index        = settings?.robotsIndex ?? true

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://fondible.in'),
    title: {
      default:  title,
      template: settings?.titleTemplate ?? '%s | Fondible',
    },
    description,
    keywords,
    authors:     [{ name: 'Fondible' }],
    creator:     'Fondible',
    openGraph: {
      type:        'website',
      locale:      'en_IN',
      url:         'https://fondible.in',
      siteName:    'Fondible',
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'Fondible Cookies' }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [ogImage],
    },
    robots: {
      index, follow: index,
      googleBot: { index, follow: index, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    icons: {
      icon:  [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    verification: settings?.googleSiteVerification ? { google: settings.googleSiteVerification } : undefined,
  }
}

export const viewport: Viewport = {
  themeColor: '#2C1810',
  width:      'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, storeSettings] = await Promise.all([getSeoSettings(), getStoreSettings()])

  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="bg-cream font-body text-brown antialiased">
        <CartConfigHydrator config={{
          shippingFee: storeSettings.shippingFee,
          freeShippingThreshold: storeSettings.freeShippingThreshold,
          taxRate: storeSettings.taxRate,
        }} />
        {settings?.googleAnalyticsId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalyticsId}');`}
            </Script>
          </>
        )}
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
