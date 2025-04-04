"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface ProgressData {
  todayLearned: number;
  todayGoal: number;
  streakDays: number;
  totalWords: number;
  reviewWords: number;
  accuracy: number;
}

export default function ProgressCard({ data }: { data: ProgressData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Card className="w-full shadow-xl bg-white rounded-2xl p-6">
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">今日学习</p>
            <p className="text-2xl font-bold">
              {data.todayLearned}/{data.todayGoal}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">连续学习</p>
            <p className="text-2xl font-bold">{data.streakDays} 天</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">总单词量</p>
            <p className="text-2xl font-bold">{data.totalWords}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">复习单词</p>
            <p className="text-2xl font-bold">{data.reviewWords}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">正确率</p>
          <p className="text-2xl font-bold">{data.accuracy}%</p>
        </div>
      </CardContent>
    </Card>
  );
} 