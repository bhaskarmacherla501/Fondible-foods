import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { auth } from '@/lib/auth'
import { OrderService } from '@/services/order.service'
import { formatPrice } from '@/lib/utils'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { order: orderNumber } = await searchParams
  const order = orderNumber ? await OrderService.getByOrderNumber(orderNumber) : null

  if (!order || order.userId !== session.user.id) redirect('/shop')

  return (
    <div className="page-container py-20">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h1 className="section-title text-brown mb-3">Order Placed!</h1>
        <p className="text-brown/70 mb-6">
          Thank you for your order. We&apos;ll start baking right away.
        </p>

        <div className="card-base p-6 text-left mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-brown/60">Order Number</span>
            <span className="font-semibold text-brown">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-brown/60">Total</span>
            <span className="font-semibold text-brown">{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brown/60">Payment Method</span>
            <span className="font-semibold text-brown">{order.paymentMethod}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
