import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/services/order.service'
import type { OrderStatus } from '@/types'

// Shiprocket's own status strings → our OrderStatus enum.
// Statuses not listed here (READY TO SHIP, PICKUP SCHEDULED, etc.) are
// logged to the timeline without changing the order's status.
const STATUS_MAP: Record<string, OrderStatus> = {
  'PICKED UP':         'DISPATCHED',
  'IN TRANSIT':        'IN_TRANSIT',
  'OUT FOR DELIVERY':  'OUT_FOR_DELIVERY',
  'DELIVERED':         'DELIVERED',
  'CANCELED':          'CANCELLED',
  'CANCELLED':         'CANCELLED',
  'RTO DELIVERED':     'CANCELLED',
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key')
    if (process.env.SHIPROCKET_WEBHOOK_TOKEN && apiKey !== process.env.SHIPROCKET_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const payload = await req.json()
    const orderNumber   = payload.order_id as string | undefined
    const currentStatus = (payload.current_status as string | undefined)?.toUpperCase().trim()
    const awb            = payload.awb as string | undefined

    if (!orderNumber || !currentStatus) {
      return NextResponse.json({ error: 'Missing order_id or current_status' }, { status: 400 })
    }

    const mapped = STATUS_MAP[currentStatus] ?? null
    await OrderService.recordShipmentUpdate(
      orderNumber, mapped, `Shiprocket: ${currentStatus}${awb ? ` (AWB ${awb})` : ''}`
    )

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Logistics webhook error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
