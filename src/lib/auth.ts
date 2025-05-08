import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 生成JWT令牌
export async function generateToken(userId: number): Promise<string> {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

// 验证JWT令牌
export async function verifyToken(token: string): Promise<number | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    return decoded.userId
  } catch (error) {
    console.error('令牌验证失败:', error)
    return null
  }
}

// 加密密码
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// 验证密码
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
} 