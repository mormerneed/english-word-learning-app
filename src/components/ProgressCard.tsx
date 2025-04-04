"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressData {
  todayLearned: number;
  todayGoal: number;
  streakDays: number;
  totalWords: number;
  reviewWords: number;
  accuracy: number;
}

export default function ProgressCard({ data }: { data: ProgressData }) {
  const progress = (data.todayLearned / data.todayGoal) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>学习进度</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 今日进度 */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>今日学习</span>
            <span>{data.todayLearned}/{data.todayGoal} 单词</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* 连续学习 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">连续学习</div>
            <div className="text-2xl font-bold">{data.streakDays} 天</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">总词汇量</div>
            <div className="text-2xl font-bold">{data.totalWords}</div>
          </div>
        </div>

        {/* 待复习和正确率 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-sm text-gray-600">待复习</div>
            <div className="text-2xl font-bold">{data.reviewWords}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600">正确率</div>
            <div className="text-2xl font-bold">{data.accuracy}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 