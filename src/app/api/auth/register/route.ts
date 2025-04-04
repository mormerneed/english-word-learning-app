import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // 检查邮箱是否已被注册
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10)

    // 创建新用户
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username: email.split('@')[0], // 使用邮箱前缀作为用户名
        points: 0,
        streakDays: 0
      }
    })

    // 生成 JWT token
    const token = sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // 设置 cookie
    const response = NextResponse.json({ 
      user: { 
        id: user.id, 
        email: user.email,
        username: user.username
      } 
    })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7天
    })

    return response
  } catch (error) {
    console.error('注册失败:', error)
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    )
  }
} 