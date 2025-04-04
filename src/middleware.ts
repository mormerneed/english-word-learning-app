import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

// 不需要认证的路由
const publicRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 如果是公开路由，直接放行
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // 获取 token
  const token = request.cookies.get('token')?.value

  // 如果没有 token，重定向到登录页
  if (!token) {
    console.log('未找到 token，重定向到登录页');
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  try {
    // 验证 token
    verify(token, process.env.JWT_SECRET || 'your-secret-key')
    return NextResponse.next()
  } catch (error) {
    console.log('token 验证失败:', error);
    // token 无效，重定向到登录页
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }
}

// 配置需要运行中间件的路由
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 