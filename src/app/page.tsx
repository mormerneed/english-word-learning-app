"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressCard from "@/components/ProgressCard";

// 模拟数据，实际使用时应该从后端获取
const progressData = {
  todayLearned: 15,
  todayGoal: 20,
  streakDays: 7,
  totalWords: 150,
  reviewWords: 25,
  accuracy: 85,
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-6">
      <div className="w-full max-w-md space-y-6">
        <Card className="w-full text-center shadow-xl bg-white rounded-2xl p-6">
          <h1 className="text-3xl font-bold text-gray-800">欢迎来到 AI 单词学习助手！</h1>
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
        <ProgressCard data={progressData} />
      </div>
    </div>
  );
}
