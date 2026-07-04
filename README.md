# 🍪 Fondible Platform

**Production-grade Next.js 14 commerce platform for Fondible — India's premium millet & jaggery cookie brand.**

---

## Tech Stack

| Layer        | Technology                                          |
|--------------|-----------------------------------------------------|
| Frontend     | Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion |
| Backend      | Next.js API Routes (Node.js)                        |
| Database     | PostgreSQL + Prisma ORM                             |
| Auth         | NextAuth v5 (JWT, Google OAuth, Phone OTP)          |
| Payments     | Razorpay (UPI, Cards, Wallets, COD)                 |
| State        | Zustand (cart, UI)                                  |
| Notifications| WhatsApp Cloud API + Nodemailer + MSG91 OTP         |
| Images       | Cloudinary CDN + Next.js Image Optimization         |
| Port         | **3007** (all other ports untouched)                |

---

## Quick Start

### 1. Prerequisites

```bash
node --version    # 18+
npm --version     # 9+
psql --version    # PostgreSQL 14+
```

### 2. Clone & Install

```bash
cd fondible-platform
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

**Minimum required for local dev:**
```
DATABASE_URL=postgresql://USER:PASS@localhost:5432/fondible_db
NEXTAUTH_SECRET=any-random-32-char-string
NEXTAUTH_URL=http://localhost:3007
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

### 4. Database Setup

```bash
# Create the database
createdb fondible_db

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed with products, admin user, coupons, pincodes
npm run prisma:seed
```

### 5. Run Development Server

```bash
npm run dev
# → http://localhost:3007
```

**Admin panel:** http://localhost:3007/admin
- Email: `admin@fondible.in`
- Password: `Admin@Fondible2025`

---

## Project Structure

```
fondible-platform/
├── prisma/
│   ├── schema.prisma          # Full DB schema (25 models)
│   └── seed.ts                # Seed data (products, coupons, pincodes)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (fonts, providers)
│   │   ├── globals.css        # Tailwind + custom CSS
│   │   ├── page.tsx           # Homepage (SSR)
│   │   ├── api/               # All API routes
│   │   │   ├── auth/          # NextAuth handlers
│   │   │   ├── products/      # Product CRUD
│   │   │   ├── orders/        # Order management
│   │   │   ├── payments/      # Razorpay integration
│   │   │   ├── coupons/       # Coupon validation
│   │   │   ├── otp/           # Phone OTP
│   │   │   ├── logistics/     # Pincode check
│   │   │   ├── webhooks/      # Razorpay webhooks
│   │   │   └── sitemap/       # Dynamic sitemap
│   │   ├── (public)/          # 18 public pages
│   │   ├── (auth)/            # Login, Signup, Forgot Password
│   │   ├── (customer)/        # Dashboard (13 sub-pages)
│   │   └── (admin)/           # Admin panel (10+ sections)
│   ├── components/
│   │   ├── layout/            # Navbar, Footer
│   │   ├── cart/              # CartDrawer
│   │   ├── home/              # Hero, Benefits, Products, etc.
│   │   ├── product/           # ProductCard, ProductGallery, etc.
│   │   ├── dashboard/         # Sidebar, Stats, etc.
│   │   └── common/            # StickyWA, Skeleton, etc.
│   ├── services/              # Business logic layer
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   └── notification.service.ts
│   ├── lib/
│   │   ├── prisma.ts          # DB singleton
│   │   ├── auth.ts            # NextAuth config
│   │   ├── razorpay.ts        # Payment utils
│   │   └── utils.ts           # Helpers
│   ├── store/
│   │   └── cart.store.ts      # Zustand cart (persistent)
│   ├── types/
│   │   └── index.ts           # All TypeScript types
│   └── middleware.ts          # Auth + role protection + CORS
```

---

## Pages

### Public
| Page | Route |
|------|-------|
| Homepage | `/` |
| Shop All | `/shop` |
| Product Detail | `/shop/[slug]` |
| About Brand | `/about` |
| Why Millets | `/why-millets` |
| Ingredients | `/ingredients` |
| Blog | `/blog` |
| Blog Post | `/blog/[slug]` |
| Contact | `/contact` |
| FAQ | `/faq` |
| Track Order | `/track-order` |
| Corporate Gifting | `/corporate-gifting` |
| Franchise / Bulk | `/franchise` |
| Careers | `/careers` |
| Privacy Policy | `/privacy-policy` |
| Terms | `/terms` |
| Shipping Policy | `/shipping-policy` |
| Return Policy | `/return-policy` |

### Customer Dashboard
| Section | Route |
|---------|-------|
| Overview | `/dashboard` |
| Orders | `/dashboard/orders` |
| Order Detail | `/dashboard/orders/[id]` |
| Profile | `/dashboard/profile` |
| Addresses | `/dashboard/addresses` |
| Wishlist | `/dashboard/wishlist` |
| Subscriptions | `/dashboard/subscriptions` |
| Rewards | `/dashboard/rewards` |
| Referral | `/dashboard/referral` |
| Notifications | `/dashboard/notifications` |
| Invoices | `/dashboard/invoices` |

### Admin Panel
| Section | Route |
|---------|-------|
| Dashboard | `/admin` |
| Products | `/admin/products` |
| Orders | `/admin/orders` |
| Customers | `/admin/customers` |
| Analytics | `/admin/analytics` |
| Inventory | `/admin/inventory` |
| Coupons | `/admin/coupons` |
| Blogs | `/admin/blogs` |
| Banners | `/admin/banners` |
| Settings | `/admin/settings` |
| SEO Manager | `/admin/seo` |

---

## API Reference

### Products
```
GET  /api/products?page=1&limit=12&category=millet-cookies&featured=true
POST /api/products                    [Admin]
GET  /api/products/[slug]
PUT  /api/products/[id]               [Admin]
```

### Orders
```
GET  /api/orders                      [Auth] — user's orders
POST /api/orders                      [Auth] — create order
GET  /api/orders/[id]                 [Auth]
PATCH /api/orders/[id]/status         [Admin]
```

### Payments
```
POST  /api/payments                   — create Razorpay order
PATCH /api/payments                   — verify & confirm payment
POST  /api/webhooks/razorpay          — Razorpay webhook
```

### Auth
```
POST /api/otp                         — send OTP to phone
GET  /api/auth/[...nextauth]          — NextAuth handlers
```

### Coupons
```
POST /api/coupons/validate            [Auth] — validate & calculate discount
```

### Logistics
```
GET  /api/logistics/pincode?pincode=500001   — check serviceability
```

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add all values from .env.example
```

**Post-deploy checklist:**
- [ ] `NEXTAUTH_URL` set to production domain
- [ ] PostgreSQL connection string (Neon/Supabase/RDS)
- [ ] Razorpay live keys added
- [ ] WhatsApp Cloud API configured
- [ ] Cloudinary configured
- [ ] Run `prisma:migrate` against production DB
- [ ] Run seed with admin credentials changed
- [ ] Add Razorpay webhook URL in Razorpay dashboard
- [ ] Set `NODE_ENV=production`

---

## Adding New Pages

All pages use the same premium design system. To add a new page:

```tsx
// src/app/(public)/new-page/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Page | Fondible',
  description: '...',
}

export default function NewPage() {
  return (
    <div className="page-container py-20">
      <span className="section-label">Label</span>
      <h1 className="section-title">Title</h1>
      {/* content */}
    </div>
  )
}
```

---

## Key Conventions

- **Port:** Always `3007`. Never conflicts with other projects.
- **Services:** All business logic in `src/services/`. Never in API routes directly.
- **Types:** All types in `src/types/index.ts`
- **Utilities:** `src/lib/utils.ts` — formatting, validation, helpers
- **State:** Zustand for client state, Prisma for server state
- **Auth:** Always use `auth()` from `src/lib/auth.ts` in server components/routes

---

## Support

WhatsApp: +91 80197 30055
Email: admin@fondible.in
