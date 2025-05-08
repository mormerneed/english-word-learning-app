import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthInitializer from "@/components/AuthInitializer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI 单词学习助手",
  description: "使用 AI 技术辅助英语单词学习",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className={inter.variable}>
      <body className="bg-gray-100 text-gray-900">
        <AuthInitializer>
          <nav className="p-4 bg-blue-500 text-white">
            <a href="/" className="mr-4">🏠 首页</a>
            <a href="/review" className="mr-4">📖 复习</a>
            <a href="/chat" className="mr-4">💬 对话</a>
            <a href="/tasks" className="mr-4">🎯 任务</a>
            <a href="/profile" className="mr-4">👤 个人中心</a>
          </nav>
          <main className="p-4">{children}</main>
        </AuthInitializer>
      </body>
    </html>
  );
}

