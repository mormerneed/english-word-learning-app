import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Chat App",
  description: "AI 单词学习工具",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-gray-100 text-gray-900">
        <nav className="p-4 bg-blue-500 text-white">
          <a href="/" className="mr-4">🏠 首页</a>
          <a href="/review" className="mr-4">📖 复习</a>
          <a href="/chat" className="mr-4">💬 对话</a>
          <a href="/tasks" className="mr-4">🎯 任务</a>
          <a href="/profile" className="mr-4">👤 个人中心</a>
        </nav>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}

