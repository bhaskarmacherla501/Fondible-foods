import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) return null
  return session
}

async function getOrCreateSettings() {
  const existing = await prisma.seoSetting.findFirst()
  if (existing) return existing
  return prisma.seoSetting.create({ data: {} })
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const settings = await getOrCreateSettings()
  return NextResponse.json({ success: true, data: settings })
}

const updateSchema = z.object({
  siteTitle:              z.string().min(2).optional(),
  titleTemplate:          z.string().min(1).optional(),
  metaDescription:        z.string().min(1).optional(),
  ogImage:                z.string().min(1).optional(),
  keywords:               z.array(z.string()).optional(),
  googleAnalyticsId:      z.string().optional(),
  googleSiteVerification: z.string().optional(),
  robotsIndex:            z.boolean().optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const data = updateSchema.parse(await req.json())
    const existing = await getOrCreateSettings()
    const settings = await prisma.seoSetting.update({ where: { id: existing.id }, data })
    return NextResponse.json({ success: true, data: settings })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, error: err.errors[0].message }, { status: 422 })
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to update SEO settings' }, { status: 500 })
  }
}
