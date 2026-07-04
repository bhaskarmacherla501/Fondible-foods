import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const notification = await prisma.notification.findFirst({ where: { id, userId: session.user.id } })
  if (!notification) return NextResponse.json({ success: false, error: 'Notification not found' }, { status: 404 })

  const updated = await prisma.notification.update({ where: { id }, data: { isRead: true } })
  return NextResponse.json({ success: true, data: updated })
}
