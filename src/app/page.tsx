import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-6">
      <Card className="w-full max-w-md text-center shadow-xl bg-white rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-800">欢迎来到 AI 单词学习助手！</h1>
        <p className="mt-2 text-gray-600">选择一个功能开始学习：</p>

        <CardContent className="mt-6 flex flex-col gap-4">
          <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
            <a href="/review">📖 单词复习</a>
          </Button>
          <Button asChild className="w-full bg-green-500 hover:bg-green-600">
            <a href="/chat">💬 AI 对话</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
