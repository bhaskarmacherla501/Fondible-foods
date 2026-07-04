import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/services/notification.service'
import { validateEmail } from '@/lib/utils'
import { z } from 'zod'

const contactSchema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  phone:   z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const data = contactSchema.parse(await req.json())
    if (!validateEmail(data.email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 422 })
    }

    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h2 style="color:#2C1810;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;">${data.message}</p>
      </div>
    `
    await NotificationService.sendEmail(
      process.env.EMAIL_FROM ?? 'hello@fondible.in',
      `Contact Form: ${data.subject}`,
      html
    )

    return NextResponse.json({ success: true, message: 'Message sent — we\'ll get back to you soon.' })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 })
  }
}
