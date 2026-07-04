import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createRazorpayOrder, verifyRazorpaySignature } from '@/lib/razorpay'
import prisma from '@/lib/prisma'
import { OrderService } from '@/services/order.service'
import { z } from 'zod'

// POST /api/payments — create Razorpay order
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { orderId } = await req.json()
    const order = await prisma.order.findUnique({ where: { id: orderId, userId: session.user.id } })
    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })

    const rzpOrder = await createRazorpayOrder(order.total, order.orderNumber)

    // Save razorpay order id
    await prisma.payment.upsert({
      where:  { orderId },
      create: { orderId, razorpayOrderId: rzpOrder.id, amount: order.total, method: 'RAZORPAY', currency: 'INR' },
      update: { razorpayOrderId: rzpOrder.id },
    })

    return NextResponse.json({
      success: true,
      data: {
        razorpayOrderId: rzpOrder.id,
        amount:          rzpOrder.amount,
        currency:        rzpOrder.currency,
        keyId:           process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Payment init failed' }, { status: 500 })
  }
}

// PATCH /api/payments — verify & confirm payment
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const schema = z.object({
      orderId:             z.string(),
      razorpayOrderId:     z.string(),
      razorpayPaymentId:   z.string(),
      razorpaySignature:   z.string(),
    })
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = schema.parse(await req.json())

    const valid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
    if (!valid) return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })

    // Update payment + order in transaction
    await prisma.$transaction([
      prisma.payment.update({
        where: { orderId },
        data: {
          razorpayPaymentId,
          razorpaySignature,
          status: 'PAID',
          paidAt: new Date(),
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      }),
      prisma.orderTimeline.create({
        data: { orderId, status: 'CONFIRMED', note: 'Payment received successfully' },
      }),
    ])

    return NextResponse.json({ success: true, message: 'Payment confirmed' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 500 })
  }
}
