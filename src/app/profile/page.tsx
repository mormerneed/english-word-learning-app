'use client'

import { useEffect, useState } from 'react'
import ProgressCard from '@/components/ProgressCard'
import { useRouter } from 'next/navigation'

interface UserStats {
  username: string
  email: string
  points: number
  streakDays: number
  totalWords: number
  totalStudyTime: number
  accuracy: number
}

interface ProgressData {
  todayLearned: number
  todayGoal: number
  streakDays: number
  totalWords: number
  reviewWords: number
  accuracy: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取用户信息
        const userResponse = await fetch('/api/profile')
        if (!userResponse.ok) {
          throw new Error('获取用户信息失败')
        }
        const userData = await userResponse.json()
        setStats(userData)

        // 获取进度数据
        const progressResponse = await fetch('/api/progress')
        if (!progressResponse.ok) {
          throw new Error('获取进度数据失败')
        }
        const progressData = await progressResponse.json()
        setProgress(progressData)
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">个人中心</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">基本信息</h2>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">用户名：</span>{stats?.username}</p>
                  <p><span className="font-medium">邮箱：</span>{stats?.email}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700">学习成就</h2>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">积分：</span>{stats?.points}</p>
                  <p><span className="font-medium">连续学习天数：</span>{stats?.streakDays} 天</p>
                  <p><span className="font-medium">总学习时间：</span>{Math.floor(stats?.totalStudyTime || 0 / 60)} 小时</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">学习统计</h2>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">已学单词：</span>{stats?.totalWords} 个</p>
                  <p><span className="font-medium">平均正确率：</span>{stats?.accuracy.toFixed(1)}%</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">今日学习进度</h2>
          {progress && <ProgressCard data={progress} />}
        </div>
      </div>
    </div>
  )
}
  