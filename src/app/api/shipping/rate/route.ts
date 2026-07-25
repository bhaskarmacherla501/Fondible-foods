import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ShiprocketService } from '@/services/shiprocket.service'
import { getStoreSettings } from '@/lib/settings'
import { validatePincode } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const { pincode, items, cod } = await req.json() as {
    pincode: string
    items: { variantId: string; quantity: number }[]
    cod: boolean
  }

  const settings = await getStoreSettings()

  if (!validatePincode(pincode) || !items?.length) {
    return NextResponse.json({
      success: true,
      data: { rate: settings.shippingFee, source: 'flat', days: null },
    })
  }

  const variants = await prisma.productVariant.findMany({
    where:  { id: { in: items.map(i => i.variantId) } },
    select: { id: true, weight: true },
  })
  const weightKg = items.reduce((sum, item) => {
    const grams = variants.find(v => v.id === item.variantId)?.weight ?? 230
    return sum + (grams * item.quantity) / 1000
  }, 0)

  const live = await ShiprocketService.checkServiceability(pincode, weightKg, cod)

  if (!live) {
    return NextResponse.json({
      success: true,
      data: { rate: settings.shippingFee, source: 'flat', days: null },
    })
  }

  return NextResponse.json({
    success: true,
    data: { rate: live.rate, source: 'live', days: live.days },
  })
}
