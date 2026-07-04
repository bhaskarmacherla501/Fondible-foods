import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/services/order.service'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const createOrderSchema = z.object({
  addressId:      z.string().min(1),
  items:          z.array(z.object({
    productId:   z.string(),
    variantId:   z.string(),
    name:        z.string(),
    variantName: z.string(),
    price:       z.number().positive(),
    image:       z.string().optional(),
    quantity:    z.number().int().positive(),
    stock:       z.number(),
  })).min(1),
  paymentMethod:  z.enum(['RAZORPAY','UPI','CARD','WALLET','COD']),
  couponCode:     z.string().optional(),
  subtotal:       z.number().positive(),
  discountAmount: z.number().min(0),
  shippingAmount: z.number().min(0),
  taxAmount:      z.number().min(0),
  total:          z.number().positive(),
  notes:          z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const body    = await req.json()
    const data    = createOrderSchema.parse(body)
    const items   = data.items.map(item => ({ ...item, image: item.image ?? '' }))
    const order   = await OrderService.create({ ...data, items, userId: session.user.id })
    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: (err as Error).message ?? 'Failed to create order' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const sp = req.nextUrl.searchParams
    const result = await OrderService.getByUser(session.user.id, {
      page:  parseInt(sp.get('page')  ?? '1'),
      limit: parseInt(sp.get('limit') ?? '10'),
    })
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
  }
}
