import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const item = await prisma.wishlistItem.findFirst({ where: { id, userId: session.user.id } })
  if (!item) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 })

  await prisma.wishlistItem.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
