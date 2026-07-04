import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validatePincode } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const pincode = req.nextUrl.searchParams.get('pincode') ?? ''

  if (!validatePincode(pincode))
    return NextResponse.json({ success: false, error: 'Invalid pincode' }, { status: 422 })

  const record = await prisma.pincode.findUnique({ where: { code: pincode } })

  if (!record) {
    // Fallback: check if Hyderabad range (500xxx)
    const isHyd = pincode.startsWith('500') || pincode.startsWith('501') || pincode.startsWith('502')
    return NextResponse.json({
      success: true,
      data: {
        pincode,
        isServiceable: isHyd,
        shippingDays:  isHyd ? 1 : 4,
        shippingCost:  isHyd ? 0 : 49,
        message:       isHyd ? 'Same-day delivery available!' : 'Currently not serviceable',
      },
    })
  }

  return NextResponse.json({
    success: true,
    data: {
      pincode:       record.code,
      city:          record.city,
      state:         record.state,
      isServiceable: record.isServiceable,
      shippingDays:  record.shippingDays,
      shippingCost:  record.shippingCost,
      message:       record.isServiceable
        ? `Delivery in ${record.shippingDays} day(s)!`
        : 'Sorry, we don\'t deliver here yet.',
    },
  })
}
