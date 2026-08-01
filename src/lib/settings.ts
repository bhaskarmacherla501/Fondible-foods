import prisma from '@/lib/prisma'
import { unstable_noStore as noStore } from 'next/cache'

export async function getStoreSettings() {
  noStore()
  const existing = await prisma.storeSetting.findFirst()
  if (existing) return existing
  return prisma.storeSetting.create({ data: {} })
}
