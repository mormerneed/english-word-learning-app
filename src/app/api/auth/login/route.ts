import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    // 检查环境变量
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET 未设置');
      return NextResponse.json({ error: '服务器配置错误' }, { status: 500 });
    }

    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('解析请求体失败:', error);
      return NextResponse.json({ error: '无效的请求格式' }, { status: 400 });
    }

    const { email, password } = body;
    console.log('登录请求:', email);

    // 验证用户
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('用户不存在');
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      console.log('密码错误');
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 创建响应
    const response = NextResponse.json(
      { 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username 
        } 
      },
      { status: 200 }
    );

    // 设置 cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7天
    });

    console.log('登录成功，设置 cookie');
    return response;
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
} 