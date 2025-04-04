import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  userId: number
}

export async function getToken(request: NextRequest): Promise<TokenPayload | null> {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) return null

    const secret = process.env.JWT_SECRET
    if (!secret) {
      console.error('JWT_SECRET 未设置')
      return null
    }

    const decoded = jwt.verify(token, secret) as TokenPayload
    return decoded
  } catch (error) {
    console.error('Token 验证失败:', error)
    return null
  }
} 