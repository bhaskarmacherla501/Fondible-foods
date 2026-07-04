import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { OrderService } from '@/services/order.service'
import { z } from 'zod'

const ORDER_STATUSES = ['PLACED', 'CONFIRMED', 'PACKED', 'DISPATCHED', 'IN_TRANSIT',
  'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED'] as const

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)
  const order = await OrderService.getById(id, isAdmin ? undefined : session.user.id)
  if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })

  return NextResponse.json({ success: true, data: order })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role))
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { status, note } = z.object({
      status: z.enum(ORDER_STATUSES),
      note:   z.string().optional(),
    }).parse(await req.json())

    const order = await OrderService.updateStatus(id, status, note)
    return NextResponse.json({ success: true, data: order })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 })
  }
}
