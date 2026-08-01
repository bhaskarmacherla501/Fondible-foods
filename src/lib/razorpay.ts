import Razorpay from 'razorpay'
import crypto from 'crypto'

let _razorpay: Razorpay | null = null

function getRazorpay(): Razorpay {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
  }
  return _razorpay
}

export async function createRazorpayOrder(amount: number, receipt: string) {
  return getRazorpay().orders.create({
    amount:   Math.round(amount * 100), // paise
    currency: 'INR',
    receipt,
  })
}

export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
): boolean {
  const body    = `${razorpayOrderId}|${razorpayPaymentId}`
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')
  return expected === signature
}

export async function createRazorpayRefund(paymentId: string, amount: number) {
  return getRazorpay().payments.refund(paymentId, {
    amount: Math.round(amount * 100),
  })
}
