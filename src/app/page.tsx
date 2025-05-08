"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  username: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 获取用户信息
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          setUser(userData);
        } catch (e) {
          console.error('解析用户数据出错', e);
        }
      }
      setLoading(false);
    }
  }, []);
  
  // 处理登出
  const handleLogout = async () => {
    try {
      // 调用登出API清除服务器端cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // 清除客户端存储
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
      
      router.push('/login');
    } catch (error) {
      console.error('登出错误:', error);
      // 即使API调用失败，也清除本地存储并重定向
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <span className="ml-2">加载中...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">AI 单词学习助手</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              登出
            </button>
          </div>
          
          {user && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">欢迎回来, {user.username}!</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          )}
          
          <p className="text-gray-700 mb-6">选择一个功能开始学习：</p>
          
          <div className="grid grid-cols-1 gap-4">
            <a
              href="/review"
              className="block w-full text-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              📖 单词复习
            </a>
            <a
              href="/chat"
              className="block w-full text-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              💬 AI 对话
            </a>
            <a
              href="/tasks"
              className="block w-full text-center px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              🎯 每日任务
            </a>
            <a
              href="/profile"
              className="block w-full text-center px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              👤 个人中心
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
