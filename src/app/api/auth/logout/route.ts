import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: '登出成功' })
  
  // 清除 token cookie
  response.cookies.set({
    name: 'token',
    value: '',
    expires: new Date(0),
    path: '/'
  })

  return response
} 