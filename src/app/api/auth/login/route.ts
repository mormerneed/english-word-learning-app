import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    console.log("收到登录请求");
    const { email, password } = await request.json()
    console.log("请求数据:", { email });

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log("用户不存在");
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      )
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      console.log("密码错误");
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }

    console.log("用户验证成功，生成 token");
    // 生成 JWT token
    const token = sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // 创建响应
    const response = NextResponse.json({ 
      user: { 
        id: user.id, 
        email: user.email,
        username: user.username
      } 
    }, { status: 200 })

    // 设置 cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/'
    })

    console.log("登录成功，返回响应");
    return response
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  }
} 