// src/app/api/coupons/validate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })

    const { code, subtotal } = await req.json()
    if (!code) return NextResponse.json({ success: false, error: 'Coupon code required' }, { status: 422 })

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
    if (!coupon || !coupon.isActive)
      return NextResponse.json({ success: false, error: 'Invalid or expired coupon' }, { status: 422 })

    if (coupon.expiresAt && coupon.expiresAt < new Date())
      return NextResponse.json({ success: false, error: 'Coupon has expired' }, { status: 422 })

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit)
      return NextResponse.json({ success: false, error: 'Coupon usage limit reached' }, { status: 422 })

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount)
      return NextResponse.json({
        success: false,
        error: `Minimum order amount ₹${coupon.minOrderAmount} required`,
      }, { status: 422 })

    // Check per-user limit
    if (coupon.perUserLimit) {
      const userUsage = await prisma.couponUsage.count({
        where: { couponId: coupon.id, userId: session.user.id },
      })
      if (userUsage >= coupon.perUserLimit)
        return NextResponse.json({ success: false, error: 'You have already used this coupon' }, { status: 422 })
    }

    // Calculate discount
    let discount = 0
    if (coupon.type === 'PERCENTAGE') {
      discount = (subtotal * coupon.value) / 100
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
    } else if (coupon.type === 'FLAT') {
      discount = Math.min(coupon.value, subtotal)
    } else if (coupon.type === 'FREE_SHIPPING') {
      discount = 0 // handled in cart
    }

    return NextResponse.json({
      success: true,
      data: {
        code:        coupon.code,
        type:        coupon.type,
        value:       coupon.value,
        discount:    Math.round(discount),
        description: coupon.description,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to validate coupon' }, { status: 500 })
  }
}
