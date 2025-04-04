import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const token = await getToken(request)
    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: token.userId },
      select: {
        username: true,
        email: true,
        points: true,
        streakDays: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 获取学习统计
    const stats = await prisma.dailyStat.aggregate({
      where: { userId: token.userId },
      _sum: {
        wordsLearned: true,
        studyTime: true
      },
      _avg: {
        accuracy: true
      }
    })

    // 获取已学单词总数
    const totalWords = await prisma.learningRecord.count({
      where: {
        userId: token.userId,
        status: 'LEARNED'
      }
    })

    return NextResponse.json({
      ...user,
      totalWords,
      totalStudyTime: stats._sum.studyTime || 0,
      accuracy: (stats._avg.accuracy || 0) * 100
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    )
  }
} 