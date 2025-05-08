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
    console.log('验证token:', token.substring(0, 20) + '...')
    
    // 简单的 token 格式验证
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.log('token格式不正确')
      return false
    }
    
    // 检查 token 是否过期
    try {
      const payload = JSON.parse(atob(parts[1]))
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) {
        console.log('token已过期')
        return false
      }
      
      console.log('token内容:', JSON.stringify(payload))
      return true
    } catch (error) {
      console.error('解析token载荷失败:', error)
      return false
    }
  } catch (error) {
    console.error('Token 验证失败:', error)
    return false
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('中间件被触发')
  console.log('当前路径:', path)
  console.log('请求方法:', request.method)

  // 检查是否是公开路由
  if (publicRoutes.some(route => path === route || path.startsWith(route + '/'))) {
    console.log('公开路由，直接放行:', path)
    return NextResponse.next()
  }
  
  // 对静态资源和API路由不进行验证
  if (
    path.startsWith('/_next/') || 
    path.includes('/favicon.ico') ||
    (path.startsWith('/api/') && !path.startsWith('/api/auth/'))
  ) {
    console.log('静态资源或公开API，直接放行:', path)
    return NextResponse.next()
  }

  // 获取 token
  const token = request.cookies.get('token')?.value
  console.log('检查 cookie token:', token ? '存在' : '不存在')

  if (!token) {
    console.log('未找到 token，重定向到登录页')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // 验证 token
    const isValid = verifyToken(token, process.env.JWT_SECRET || 'your-secret-key')
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
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}