import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

const PUBLIC_ROUTES   = ['/', '/about', '/shop', '/blog', '/contact', '/faq',
  '/our-ingredients', '/ingredients', '/privacy-policy', '/terms', '/shipping-policy',
  '/return-policy', '/track-order', '/corporate-gifting', '/franchise', '/careers']
const AUTH_ROUTES     = ['/login', '/signup', '/forgot-password']
const CUSTOMER_ROUTES = ['/dashboard']
const ADMIN_ROUTES    = ['/admin']
const API_ADMIN       = ['/api/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session      = await auth()

  // Rate limiting headers (basic — use Upstash Redis in production)
  const response = NextResponse.next()
  response.headers.set('X-Robots-Tag', 'index, follow')

  // CORS for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL ?? '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (request.method === 'OPTIONS') return new NextResponse(null, { status: 204, headers: response.headers })
  }

  // Protect admin API routes
  if (API_ADMIN.some(r => pathname.startsWith(r))) {
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some(r => pathname.startsWith(r)) && session?.user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect customer routes
  if (CUSTOMER_ROUTES.some(r => pathname.startsWith(r))) {
    if (!session?.user) {
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|fonts).*)'],
}
