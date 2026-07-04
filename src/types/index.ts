// Fondible Platform — Core Types

export interface Product {
  id: string
  name: string
  slug: string
  shortDesc?: string
  description?: string
  categoryId: string
  category?: Category
  images: string[]
  tags: string[]
  isActive: boolean
  isFeatured: boolean
  isBestseller: boolean
  isNew: boolean
  nutritionFacts?: NutritionFacts
  ingredients?: string
  storageInfo?: string
  healthBenefits: string[]
  allergens: string[]
  certifications: string[]
  averageRating: number
  reviewCount: number
  variants: ProductVariant[]
  reviews?: Review[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  comparePrice?: number
  costPrice?: number
  weight?: number
  stock: number
  lowStockAt: number
  isActive: boolean
  sortOrder: number
}

export interface NutritionFacts {
  servingSize: string
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  sortOrder: number
}

export interface CartItem {
  productId: string
  variantId: string
  name: string
  variantName: string
  price: number
  image: string
  quantity: number
  stock: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  discountAmount: number
  couponCode?: string
  shippingAmount: number
  taxAmount: number
  total: number
}

export type OrderStatus =
  | 'PLACED' | 'CONFIRMED' | 'PACKED'
  | 'DISPATCHED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY'
  | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'
export type PaymentMethod = 'RAZORPAY' | 'UPI' | 'CARD' | 'WALLET' | 'COD'

export interface Order {
  id: string
  orderNumber: string
  userId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  subtotal: number
  discountAmount: number
  couponCode?: string
  shippingAmount: number
  taxAmount: number
  total: number
  notes?: string
  expectedDelivery?: Date
  deliveredAt?: Date
  awbNumber?: string
  trackingUrl?: string
  invoiceUrl?: string
  items: OrderItem[]
  address: Address
  timeline: OrderTimeline[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  variantId: string
  name: string
  image?: string
  price: number
  quantity: number
  total: number
}

export interface OrderTimeline {
  id: string
  status: OrderStatus
  note?: string
  createdAt: Date
}

export interface Address {
  id: string
  label: string
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

export interface User {
  id: string
  name?: string
  email?: string
  phone?: string
  image?: string
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'
  referralCode?: string
  rewardPoints: number
  createdAt: Date
}

export interface Review {
  id: string
  productId: string
  userId: string
  rating: number
  title?: string
  body?: string
  images: string[]
  isVerified: boolean
  isApproved: boolean
  user?: { name?: string; image?: string }
  createdAt: Date
}

export interface Coupon {
  id: string
  code: string
  type: 'PERCENTAGE' | 'FLAT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  isActive: boolean
  expiresAt?: Date
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  coverImage?: string
  tags: string[]
  category?: string
  authorName?: string
  authorImage?: string
  isPublished: boolean
  publishedAt?: Date
  seoTitle?: string
  seoDesc?: string
  createdAt: Date
}

export interface Notification {
  id: string
  type: 'ORDER_UPDATE' | 'PROMOTIONAL' | 'SYSTEM' | 'REWARD' | 'RESTOCK'
  title: string
  body: string
  link?: string
  isRead: boolean
  createdAt: Date
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: Pagination
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Payment types
export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt: string
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

// Logistics types
export interface PincodeCheck {
  pincode: string
  isServiceable: boolean
  city?: string
  state?: string
  shippingDays?: number
  shippingCost?: number
}

// Analytics types
export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  avgOrderValue: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
  pendingOrders: number
  lowStockProducts: number
}
