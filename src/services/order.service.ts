import prisma from '@/lib/prisma'
import { generateOrderNumber, getPaginationMeta } from '@/lib/utils'
import { NotificationService } from './notification.service'
import { ProductService } from './product.service'
import type { CartItem, OrderStatus, PaymentMethod, PaginationParams } from '@/types'

export class OrderService {
  static async create(data: {
    userId: string
    addressId: string
    items: CartItem[]
    paymentMethod: PaymentMethod
    couponCode?: string
    subtotal: number
    discountAmount: number
    shippingAmount: number
    taxAmount: number
    total: number
    notes?: string
  }) {
    // Verify all stock before creating
    for (const item of data.items) {
      await ProductService.checkVariantStock(item.variantId, item.quantity)
    }

    const orderNumber = generateOrderNumber()

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId:        data.userId,
          addressId:     data.addressId,
          paymentMethod: data.paymentMethod,
          subtotal:      data.subtotal,
          discountAmount: data.discountAmount,
          couponCode:    data.couponCode,
          shippingAmount: data.shippingAmount,
          taxAmount:     data.taxAmount,
          total:         data.total,
          notes:         data.notes,
          expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              variantId: item.variantId,
              name:      `${item.name} — ${item.variantName}`,
              image:     item.image,
              price:     item.price,
              quantity:  item.quantity,
              total:     item.price * item.quantity,
            })),
          },
          timeline: {
            create: { status: 'PLACED', note: 'Order placed successfully' },
          },
        },
        include: { items: true, address: true, timeline: true },
      })

      // Decrement stock
      for (const item of data.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data:  { stock: { decrement: item.quantity } },
        })
        await tx.inventory.create({
          data: {
            variantId: item.variantId,
            quantity:  -item.quantity,
            type:      'out',
            reason:    'sale',
            reference: created.id,
          },
        })
      }

      // Mark coupon used
      if (data.couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: data.couponCode } })
        if (coupon) {
          await tx.coupon.update({
            where: { id: coupon.id },
            data:  { usageCount: { increment: 1 } },
          })
          await tx.couponUsage.create({
            data: { couponId: coupon.id, userId: data.userId, orderId: created.id },
          })
        }
      }

      // Add reward points (1 point per ₹10)
      const points = Math.floor(data.total / 10)
      if (points > 0) {
        await tx.user.update({
          where: { id: data.userId },
          data:  { rewardPoints: { increment: points } },
        })
        await tx.rewardHistory.create({
          data: { userId: data.userId, points, type: 'earned', reason: 'order', reference: created.id },
        })
      }

      return created
    })

    // Send notifications (non-blocking)
    NotificationService.orderPlaced(data.userId, order.orderNumber, order.total).catch(console.error)

    return order
  }

  static async updateStatus(orderId: string, status: OrderStatus, note?: string) {
    const order = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data:  { status, ...(status === 'DELIVERED' ? { deliveredAt: new Date() } : {}) },
        include: { user: true },
      })
      await tx.orderTimeline.create({
        data: { orderId, status, note },
      })
      return updated
    })

    NotificationService.orderStatusUpdate(
      order.userId, order.orderNumber, status
    ).catch(console.error)

    return order
  }

  static async getByUser(userId: string, params: PaginationParams) {
    const { page = 1, limit = 10 } = params
    const [total, orders] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.findMany({
        where:   { userId },
        include: { items: true, address: true, timeline: true },
        orderBy: { createdAt: 'desc' },
        skip:    (page - 1) * limit,
        take:    limit,
      }),
    ])
    return { orders, pagination: getPaginationMeta(total, page, limit) }
  }

  static async getById(orderId: string, userId?: string) {
    return prisma.order.findFirst({
      where:   { id: orderId, ...(userId ? { userId } : {}) },
      include: { items: true, address: true, timeline: { orderBy: { createdAt: 'asc' } }, payment: true },
    })
  }

  static async getByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where:   { orderNumber },
      include: { items: true, address: true, timeline: { orderBy: { createdAt: 'asc' } } },
    })
  }

  static async getAll(params: PaginationParams & { status?: string }) {
    const { page = 1, limit = 20, search, status } = params
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (search) where.orderNumber = { contains: search, mode: 'insensitive' }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: { user: { select: { name: true, email: true, phone: true } }, items: true, address: true },
        orderBy: { createdAt: 'desc' },
        skip:    (page - 1) * limit,
        take:    limit,
      }),
    ])
    return { orders, pagination: getPaginationMeta(total, page, limit) }
  }

  static async getDashboardStats() {
    const now   = new Date()
    const month = new Date(now.getFullYear(), now.getMonth(), 1)
    const prev  = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [thisMonth, lastMonth, pending, customers, customersThisMonth, customersLastMonth, lowStock] = await Promise.all([
      prisma.order.aggregate({
        where:   { createdAt: { gte: month }, paymentStatus: 'PAID' },
        _sum:    { total: true },
        _count:  true,
      }),
      prisma.order.aggregate({
        where:   { createdAt: { gte: prev, lt: month }, paymentStatus: 'PAID' },
        _sum:    { total: true },
        _count:  true,
      }),
      prisma.order.count({ where: { status: { in: ['PLACED', 'CONFIRMED', 'PACKED'] } } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: month } } }),
      prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: prev, lt: month } } }),
      prisma.productVariant.count({ where: { stock: { lte: prisma.productVariant.fields.lowStockAt } } }),
    ])

    const rev   = thisMonth._sum.total    ?? 0
    const prevR = lastMonth._sum.total    ?? 0
    const ord   = thisMonth._count
    const prevO = lastMonth._count

    return {
      totalRevenue:     rev,
      totalOrders:      ord,
      totalCustomers:   customers,
      avgOrderValue:    ord > 0 ? rev / ord : 0,
      revenueGrowth:    prevR > 0 ? ((rev - prevR) / prevR) * 100 : 0,
      ordersGrowth:     prevO > 0 ? ((ord - prevO) / prevO) * 100 : 0,
      customersGrowth:  customersLastMonth > 0 ? ((customersThisMonth - customersLastMonth) / customersLastMonth) * 100 : 0,
      pendingOrders:    pending,
      lowStockProducts: lowStock,
    }
  }
}
