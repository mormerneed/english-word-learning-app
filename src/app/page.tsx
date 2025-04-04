"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressCard from "@/components/ProgressCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProgressData {
  todayLearned: number;
  todayGoal: number;
  streakDays: number;
  totalWords: number;
  reviewWords: number;
  accuracy: number;
}

export default function Home() {
  const router = useRouter();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch('/api/progress');
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        setProgressData(data);
      } catch (error) {
        console.error('获取进度数据失败:', error);
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      fetchProgress();
    }
  }, [router, mounted]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-6">
      <div className="w-full max-w-md space-y-6">
        <Card className="w-full text-center shadow-xl bg-white rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">AI 单词学习助手</h1>
            <Button onClick={handleLogout} variant="outline" className="text-sm">
              退出登录
            </Button>
          </div>
          <p className="mt-2 text-gray-600">选择一个功能开始学习：</p>

          <CardContent className="mt-6 flex flex-col gap-4">
            <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
              <a href="/review">📖 单词复习</a>
            </Button>
            <Button asChild className="w-full bg-green-500 hover:bg-green-600">
              <a href="/chat">💬 AI 对话</a>
            </Button>
            <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600">
              <a href="/tasks">🎯 每日任务</a>
            </Button>
            <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
              <a href="/profile">👤 个人中心</a>
            </Button>
          </CardContent>
        </Card>

        {/* 添加进度卡片 */}
        {loading ? (
          <div className="text-center text-white">加载中...</div>
        ) : progressData ? (
          <ProgressCard data={progressData} />
        ) : (
          <div className="text-center text-white">暂无数据</div>
        )}
      </div>
    </div>
  );
}
