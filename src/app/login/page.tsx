"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log('开始登录请求...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      console.log('登录响应状态:', response.status);
      if (response.ok) {
        console.log('登录成功，准备跳转到首页');
        try {
          // 先获取响应文本
          const text = await response.text();
          console.log('原始响应:', text);
          
          // 尝试解析为 JSON
          const data = JSON.parse(text);
          console.log('解析后的数据:', data);
          
          // 登录成功后跳转到首页
          window.location.href = '/';
          console.log('跳转指令已发送');
        } catch (error) {
          console.error('解析响应数据失败:', error);
          setError('服务器响应格式错误');
        }
      } else {
        try {
          const text = await response.text();
          console.log('错误响应:', text);
          const data = JSON.parse(text);
          console.log('登录失败:', data.error);
          setError(data.error || '登录失败');
        } catch (error) {
          console.error('解析错误响应失败:', error);
          setError('服务器错误');
        }
      }
    } catch (error) {
      console.error('登录过程出错:', error);
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-6">
      <Card className="w-full max-w-md shadow-xl bg-white rounded-2xl p-6">
        <CardContent>
          <h1 className="text-3xl font-bold text-center mb-6">登录</h1>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              还没有账号？{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                立即注册
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 