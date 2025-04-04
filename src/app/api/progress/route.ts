import { getTodayStats, prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 暂时使用测试用户ID 1
    const stats = await getTodayStats(1)
    
    if (!stats) {
      return NextResponse.json({
        todayLearned: 0,
        todayGoal: 20,
        streakDays: 0,
        totalWords: 0,
        reviewWords: 0,
        accuracy: 0
      })
    }

    return NextResponse.json({
      todayLearned: stats.wordsLearned,
      todayGoal: 20, // 每日目标
      streakDays: 5, // 从用户表获取
      totalWords: 150, // 从学习记录统计
      reviewWords: stats.wordsReviewed,
      accuracy: stats.accuracy * 100 // 转换为百分比
    })
  } catch (error) {
    console.error('获取进度数据失败:', error)
    return NextResponse.json(
      { error: '获取数据失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { wordsLearned, wordsReviewed, accuracy, studyTime } = body

    // 获取今天的日期（去掉时间部分）
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 更新或创建今日统计
    const stats = await prisma.dailyStat.upsert({
      where: {
        userId: 1, // 暂时使用测试用户ID
        date: today
      },
      update: {
        wordsLearned,
        wordsReviewed,
        accuracy,
        studyTime
      },
      create: {
        userId: 1,
        date: today,
        wordsLearned,
        wordsReviewed,
        accuracy,
        studyTime
      }
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error('更新进度数据失败:', error)
    return NextResponse.json(
      { error: '更新数据失败' },
      { status: 500 }
    )
  }
} 