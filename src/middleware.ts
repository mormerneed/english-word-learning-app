import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 公开路由列表
const publicRoutes = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register'
]

// 简单的 token 验证函数
function verifyToken(token: string, secret: string): boolean {
  try {
    // 简单的 token 格式验证
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    // 检查 token 是否过期
    const payload = JSON.parse(atob(parts[1]))
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) return false
    
    return true
  } catch (error) {
    console.error('Token 验证失败:', error)
    return false
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  console.log('中间件被触发')
  console.log('当前路径:', path)
  console.log('请求方法:', request.method)

  // 检查是否是公开路由
  if (publicRoutes.includes(path)) {
    console.log('公开路由，直接放行:', path)
    return NextResponse.next()
  }

  // 获取 token
  const token = request.cookies.get('token')?.value
  console.log('检查 token:', token ? '存在' : '不存在')

  if (!token) {
    console.log('未找到 token，重定向到登录页')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // 验证 token
    const isValid = verifyToken(token, process.env.JWT_SECRET || '')
    if (!isValid) {
      console.log('token 验证失败')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    console.log('token 验证成功')
    return NextResponse.next()
  } catch (error) {
    console.log('token 验证失败:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - api/auth/login 和 api/auth/register (登录和注册 API)
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     */
    '/((?!api/auth/login|api/auth/register|_next/static|_next/image|favicon.ico).*)',
  ],
} 