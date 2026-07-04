import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { OrderService } from '@/services/order.service'

export async function POST(req: NextRequest) {
  try {
    const rawBody  = await req.text()
    const sig      = req.headers.get('x-razorpay-signature')
    const secret   = process.env.RAZORPAY_KEY_SECRET!

    // Verify webhook signature
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
    if (expected !== sig) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })

    const event = JSON.parse(rawBody)
    const { event: eventName, payload } = event

    switch (eventName) {
      case 'payment.captured': {
        const paymentId = payload.payment.entity.id
        const orderId   = payload.payment.entity.notes?.orderId
        if (orderId) {
          await prisma.payment.updateMany({
            where: { razorpayPaymentId: paymentId },
            data:  { status: 'PAID', paidAt: new Date() },
          })
          await OrderService.updateStatus(orderId, 'CONFIRMED', 'Payment captured via webhook')
        }
        break
      }
      case 'payment.failed': {
        const paymentId = payload.payment.entity.id
        await prisma.payment.updateMany({
          where: { razorpayPaymentId: paymentId },
          data:  { status: 'FAILED', failureReason: payload.payment.entity.error_description },
        })
        break
      }
      case 'refund.created': {
        const refundId  = payload.refund.entity.id
        const paymentId = payload.refund.entity.payment_id
        await prisma.refund.updateMany({
          where: { razorpayRefundId: refundId },
          data:  { status: 'processed', processedAt: new Date() },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
