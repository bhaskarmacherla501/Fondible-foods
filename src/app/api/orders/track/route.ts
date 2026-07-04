import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/services/order.service'
import { z } from 'zod'

const trackSchema = z.object({
  orderNumber: z.string().min(3),
  phone:       z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, phone } = trackSchema.parse(await req.json())

    const order = await OrderService.getByOrderNumber(orderNumber.trim().toUpperCase())
    if (!order || order.address.phone !== phone.trim()) {
      return NextResponse.json({ success: false, error: 'No order found with that order number and phone number' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: order })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to look up order' }, { status: 500 })
  }
}
