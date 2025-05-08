"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthInitializerProps {
  children: ReactNode;
  publicRoutes?: string[];
}

export default function AuthInitializer({ 
  children, 
  publicRoutes = ['/login', '/register'] 
}: AuthInitializerProps) {
  const router = useRouter();
  
  useEffect(() => {
    // 确保在客户端环境中
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const token = localStorage.getItem('token');
      
      // 如果是公开路由，不检查token
      if (publicRoutes.includes(pathname)) {
        return;
      }
      
      // 如果不是公开路由，但没有token，重定向到登录页
      if (!token) {
        router.push('/login');
      }
    }
  }, [router, publicRoutes]);
  
  return <>{children}</>;
} 