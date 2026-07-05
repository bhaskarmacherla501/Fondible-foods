import { NextResponse } from 'next/server'

export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const secret = process.env.RAZORPAY_KEY_SECRET

  return NextResponse.json({
    razorpay_configured: !!(keyId && secret),
    key_prefix: keyId?.substring(0, 12) ?? 'NOT SET',
    secret_set: !!secret,
    mode: keyId?.startsWith('rzp_test_') ? 'TEST' :
          keyId?.startsWith('rzp_live_') ? 'LIVE' : 'UNKNOWN',
  })
}
