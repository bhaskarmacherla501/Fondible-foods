// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/services/product.service'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const result = await ProductService.getAll({
      page:        parseInt(sp.get('page')  ?? '1'),
      limit:       parseInt(sp.get('limit') ?? '12'),
      search:      sp.get('search')      ?? undefined,
      category:    sp.get('category')    ?? undefined,
      sortBy:      sp.get('sortBy')      ?? 'createdAt',
      sortOrder:   (sp.get('sortOrder')  ?? 'desc') as 'asc' | 'desc',
      featured:    sp.get('featured')    === 'true',
      bestseller:  sp.get('bestseller')  === 'true',
      minPrice:    sp.get('minPrice')    ? parseFloat(sp.get('minPrice')!) : undefined,
      maxPrice:    sp.get('maxPrice')    ? parseFloat(sp.get('maxPrice')!) : undefined,
    })
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN','SUPER_ADMIN'].includes(session.user.role))
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const body    = await req.json()
    const product = await ProductService.create(body)
    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 })
  }
}
