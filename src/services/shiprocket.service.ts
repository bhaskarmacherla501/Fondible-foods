import prisma from '@/lib/prisma'
import type { Order, OrderItem, Address, User } from '@prisma/client'

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external'
const TOKEN_KEY = 'shiprocket_token'
const TOKEN_EXPIRY_KEY = 'shiprocket_token_expires_at'
const PICKUP_LOCATION = process.env.SHIPROCKET_PICKUP_LOCATION ?? 'Home'

// Shiprocket parcel default dimensions (cm) — cookie boxes don't vary enough
// to warrant per-product dimensions yet.
const DEFAULT_DIMENSIONS = { length: 15, breadth: 10, height: 8 }

async function getToken(): Promise<string> {
  const [cachedToken, cachedExpiry] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { key: TOKEN_KEY } }),
    prisma.siteConfig.findUnique({ where: { key: TOKEN_EXPIRY_KEY } }),
  ])

  if (cachedToken && cachedExpiry && new Date(cachedExpiry.value) > new Date()) {
    return cachedToken.value
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      email:    process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  })
  const data = await res.json()
  if (!data.token) throw new Error(`Shiprocket auth failed: ${JSON.stringify(data)}`)

  // Tokens are valid ~10 days; cache for 9 to stay safe.
  const expiresAt = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString()
  await Promise.all([
    prisma.siteConfig.upsert({
      where:  { key: TOKEN_KEY },
      create: { key: TOKEN_KEY, value: data.token, group: 'shiprocket' },
      update: { value: data.token },
    }),
    prisma.siteConfig.upsert({
      where:  { key: TOKEN_EXPIRY_KEY },
      create: { key: TOKEN_EXPIRY_KEY, value: expiresAt, group: 'shiprocket' },
      update: { value: expiresAt },
    }),
  ])

  return data.token as string
}

async function shiprocketFetch(path: string, init: RequestInit = {}) {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
      ...init.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Shiprocket ${path} failed (${res.status}): ${JSON.stringify(data)}`)
  return data
}

type OrderWithDetails = Order & { items: OrderItem[]; address: Address; user: Pick<User, 'email' | 'phone'> }

export class ShiprocketService {
  static async createShipment(order: OrderWithDetails) {
    const totalWeightKg = order.items.reduce((sum, item) => sum + item.quantity, 0) * 0.23 || 0.5
    const [firstName, ...rest] = order.address.name.trim().split(' ')

    const payload = {
      order_id:            order.orderNumber,
      order_date:          order.createdAt.toISOString().slice(0, 16).replace('T', ' '),
      pickup_location:     PICKUP_LOCATION,
      billing_customer_name: firstName,
      billing_last_name:   rest.join(' ') || '.',
      billing_address:     order.address.line1,
      billing_address_2:   order.address.line2 ?? '',
      billing_city:        order.address.city,
      billing_pincode:     order.address.pincode,
      billing_state:       order.address.state,
      billing_country:     'India',
      billing_email:       order.user.email ?? process.env.SMTP_USER ?? 'orders@fondible.in',
      billing_phone:       order.address.phone.replace(/\D/g, '').slice(-10),
      shipping_is_billing: true,
      order_items: order.items.map(item => ({
        name:          item.name,
        sku:           item.variantId,
        units:         item.quantity,
        selling_price: item.price,
      })),
      payment_method: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
      sub_total:      order.total,
      length:         DEFAULT_DIMENSIONS.length,
      breadth:        DEFAULT_DIMENSIONS.breadth,
      height:         DEFAULT_DIMENSIONS.height,
      weight:         Math.max(totalWeightKg, 0.1),
    }

    const created = await shiprocketFetch('/orders/create/adhoc', {
      method: 'POST',
      body:   JSON.stringify(payload),
    })

    const shipmentId = created.shipment_id
    if (!shipmentId) throw new Error(`Shiprocket order create returned no shipment_id: ${JSON.stringify(created)}`)

    const assigned = await shiprocketFetch('/courier/assign/awb', {
      method: 'POST',
      body:   JSON.stringify({ shipment_id: shipmentId }),
    })

    const awbCode = assigned?.response?.data?.awb_code
    if (!awbCode) throw new Error(`Shiprocket AWB assignment returned no awb_code: ${JSON.stringify(assigned)}`)

    return {
      shipmentId,
      awbNumber:  awbCode as string,
      trackingUrl: `https://shiprocket.co/tracking/${awbCode}`,
    }
  }
}
