import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// 获取用户今日学习统计
export async function getTodayStats(userId: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return prisma.dailyStat.findUnique({
    where: {
      userId_date: {
        userId,
        date: today
      }
    }
  })
} 