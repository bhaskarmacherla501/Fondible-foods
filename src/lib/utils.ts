import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateOrderNumber(): string {
  const prefix = 'FND'
  const ts     = Date.now().toString(36).toUpperCase()
  const rand   = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${ts}-${rand}`
}

export function generateReferralCode(name: string): string {
  const clean = name.replace(/\s/g, '').substring(0, 4).toUpperCase()
  const rand  = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${clean}${rand}`
}

export function generateOTP(length = 6): string {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0')
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function getDiscountPercentage(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}

export function buildWAOrderMessage(items: Array<{ name: string; quantity: number; price: number }>, total: number): string {
  const lines = items.map(i => `• ${i.quantity}x ${i.name} — ₹${i.price * i.quantity}`).join('\n')
  return encodeURIComponent(
    `Hi Fondible! 🍪 I'd like to place an order:\n\n${lines}\n\nTotal: ₹${total}\n\nPlease confirm availability and delivery. 🙏`
  )
}

export function getPaginationMeta(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit)
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

export function validatePincode(pin: string): boolean {
  return /^\d{6}$/.test(pin)
}

export function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone)
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function maskPhone(phone: string): string {
  return phone.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2')
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  return `${user.substring(0, 2)}***@${domain}`
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PLACED:           'Order Placed',
  CONFIRMED:        'Confirmed',
  PACKED:           'Packed',
  DISPATCHED:       'Dispatched',
  IN_TRANSIT:       'In Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED:        'Delivered',
  CANCELLED:        'Cancelled',
  REFUNDED:         'Refunded',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PLACED:           'bg-blue-100 text-blue-800',
  CONFIRMED:        'bg-purple-100 text-purple-800',
  PACKED:           'bg-yellow-100 text-yellow-800',
  DISPATCHED:       'bg-orange-100 text-orange-800',
  IN_TRANSIT:       'bg-orange-100 text-orange-800',
  OUT_FOR_DELIVERY: 'bg-amber-100 text-amber-800',
  DELIVERED:        'bg-green-100 text-green-800',
  CANCELLED:        'bg-red-100 text-red-800',
  REFUNDED:         'bg-gray-100 text-gray-800',
}
