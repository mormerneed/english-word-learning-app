import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // 获取cookie存储
    const cookieStore = cookies()
    
    // 删除token cookie
    cookieStore.set('token', '', {
      expires: new Date(0), // 设置为过期
      path: '/',
    })
    
    return NextResponse.json({
      status: 'success',
      message: '登出成功',
    })
  } catch (error) {
    console.error('登出出错:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 