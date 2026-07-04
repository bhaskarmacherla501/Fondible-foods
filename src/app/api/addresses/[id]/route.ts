import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const address = await prisma.address.findFirst({ where: { id, userId: session.user.id } })
  if (!address) return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 })

  const { isDefault } = await req.json()
  if (isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } })
  }
  const updated = await prisma.address.update({ where: { id }, data: { isDefault: !!isDefault } })

  return NextResponse.json({ success: true, data: updated })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const address = await prisma.address.findFirst({ where: { id, userId: session.user.id } })
  if (!address) return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 })

  await prisma.address.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
