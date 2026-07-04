import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateOTP, validatePhone } from '@/lib/utils'
import { NotificationService } from '@/services/notification.service'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const { phone } = z.object({ phone: z.string().min(10) }).parse(await req.json())
    if (!validatePhone(phone)) return NextResponse.json({ success: false, error: 'Invalid phone number' }, { status: 422 })

    // Rate limit: max 3 OTPs per 10 minutes
    const recent = await prisma.oTP.count({
      where: { phone, createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) } },
    })
    if (recent >= 3) return NextResponse.json({ success: false, error: 'Too many OTP requests. Try again in 10 minutes.' }, { status: 429 })

    // Invalidate old OTPs
    await prisma.oTP.updateMany({
      where: { phone, purpose: 'login', used: false },
      data:  { used: true },
    })

    const code = generateOTP(6)
    const otp  = await prisma.oTP.create({
      data: { phone, code, purpose: 'login', expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    })

    await NotificationService.sendOTP(phone, code)

    // In dev, return the OTP for testing
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' ? { _dev_otp: code } : {}),
    })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to send OTP' }, { status: 500 })
  }
}
