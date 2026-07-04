import nodemailer from 'nodemailer'
import prisma from '@/lib/prisma'
import type { OrderStatus } from '@/types'
import { ORDER_STATUS_LABELS } from '@/lib/utils'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT ?? '587'),
  secure: false,
  auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export class NotificationService {
  // ─── WhatsApp ──────────────────────────────────────────────────────────────
  static async sendWhatsApp(phone: string, message: string) {
    if (!process.env.WHATSAPP_API_TOKEN) return
    try {
      const res = await fetch(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method:  'POST',
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to:   phone,
            type: 'text',
            text: { body: message },
          }),
        }
      )
      if (!res.ok) console.error('WhatsApp send failed:', await res.text())
    } catch (err) {
      console.error('WhatsApp error:', err)
    }
  }

  // ─── Email ─────────────────────────────────────────────────────────────────
  static async sendEmail(to: string, subject: string, html: string) {
    try {
      await transporter.sendMail({
        from:    `"Fondible" <${process.env.EMAIL_FROM}>`,
        to, subject, html,
      })
    } catch (err) {
      console.error('Email error:', err)
    }
  }

  // ─── In-App Notification ───────────────────────────────────────────────────
  static async createInApp(userId: string, data: {
    type: 'ORDER_UPDATE' | 'PROMOTIONAL' | 'SYSTEM' | 'REWARD' | 'RESTOCK'
    title: string
    body: string
    link?: string
  }) {
    return prisma.notification.create({ data: { userId, ...data } })
  }

  // ─── OTP ───────────────────────────────────────────────────────────────────
  static async sendOTP(phone: string, otp: string) {
    // MSG91 integration
    if (process.env.MSG91_AUTH_KEY) {
      try {
        await fetch('https://api.msg91.com/api/v5/flow/', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', authkey: process.env.MSG91_AUTH_KEY },
          body: JSON.stringify({
            template_id: process.env.MSG91_TEMPLATE_ID,
            sender:      process.env.MSG91_SENDER_ID,
            short_url:   '0',
            mobiles:     `91${phone}`,
            VAR1:        otp,
          }),
        })
      } catch (err) {
        console.error('OTP send error:', err)
      }
    } else {
      // Fallback: WhatsApp OTP
      await NotificationService.sendWhatsApp(phone,
        `🔐 Your Fondible OTP is *${otp}*. Valid for 10 minutes. Do not share with anyone.`
      )
    }
  }

  // ─── Order Events ──────────────────────────────────────────────────────────
  static async orderPlaced(userId: string, orderNumber: string, total: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return

    const msg = `🍪 *Fondible Order Confirmed!*\n\nHi ${user.name ?? 'there'}!\nYour order *#${orderNumber}* worth ₹${total} has been placed.\n\nWe'll bake it fresh and update you shortly! 🌾\n\nTrack: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders`

    if (user.phone) await NotificationService.sendWhatsApp(`91${user.phone}`, msg)
    if (user.email) {
      await NotificationService.sendEmail(
        user.email,
        `Order Confirmed — #${orderNumber} | Fondible`,
        NotificationService.orderEmailTemplate(orderNumber, 'PLACED', total)
      )
    }
    await NotificationService.createInApp(userId, {
      type:  'ORDER_UPDATE',
      title: 'Order Placed! 🍪',
      body:  `Your order #${orderNumber} has been placed. We'll start baking soon!`,
      link:  `/dashboard/orders`,
    })
  }

  static async orderStatusUpdate(userId: string, orderNumber: string, status: OrderStatus) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return

    const label = ORDER_STATUS_LABELS[status]
    const msg = `📦 *Fondible Order Update*\n\nHi ${user.name ?? 'there'}!\nOrder *#${orderNumber}* is now *${label}*.\n\nTrack your order: ${process.env.NEXT_PUBLIC_APP_URL}/track-order?order=${orderNumber}`

    if (user.phone) await NotificationService.sendWhatsApp(`91${user.phone}`, msg)
    await NotificationService.createInApp(userId, {
      type:  'ORDER_UPDATE',
      title: `Order ${label}`,
      body:  `Your order #${orderNumber} status: ${label}`,
      link:  `/dashboard/orders`,
    })
  }

  // ─── Email Templates ───────────────────────────────────────────────────────
  static orderEmailTemplate(orderNumber: string, status: string, total: number): string {
    return `
<!DOCTYPE html>
<html>
<body style="font-family:'DM Sans',Arial,sans-serif;background:#F7F2E8;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(44,24,16,.12);">
    <div style="background:#2C1810;padding:32px;text-align:center;">
      <h1 style="color:#F5DFA0;font-size:28px;margin:0;font-style:italic;">Fondible</h1>
      <p style="color:rgba(245,223,160,.7);margin:8px 0 0;font-size:13px;">Better Food. Better Living.</p>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#2C1810;font-size:22px;">Order #${orderNumber}</h2>
      <p style="color:#5C3D2E;font-size:15px;">Status: <strong>${ORDER_STATUS_LABELS[status] ?? status}</strong></p>
      <p style="color:#5C3D2E;font-size:15px;">Total: <strong>₹${total}</strong></p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders"
         style="display:inline-block;background:#C8820A;color:#fff;padding:14px 28px;border-radius:100px;text-decoration:none;font-weight:700;margin-top:20px;">
        Track My Order
      </a>
    </div>
    <div style="background:#F7F2E8;padding:20px;text-align:center;">
      <p style="color:#8B6655;font-size:12px;margin:0;">© 2025 Fondible · Made with ❤️ in India</p>
    </div>
  </div>
</body>
</html>`
  }
}
