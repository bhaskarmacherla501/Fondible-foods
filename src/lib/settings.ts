import prisma from '@/lib/prisma'

export async function getStoreSettings() {
  const existing = await prisma.storeSetting.findFirst()
  if (existing) return existing
  return prisma.storeSetting.create({ data: {} })
}
