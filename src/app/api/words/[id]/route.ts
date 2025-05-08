import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// 更新单词状态
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const wordId = parseInt(params.id);
    
    // 验证用户身份
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = await verifyToken(token);
    
    if (!userId) {
      return NextResponse.json({ error: '无效令牌' }, { status: 401 });
    }
    
    const { status } = await request.json();
    
    // 检查状态是否有效
    if (!['learning', 'mastered', 'difficult'].includes(status)) {
      return NextResponse.json({ error: '无效的状态' }, { status: 400 });
    }
    
    // 查找学习记录
    const learningRecord = await prisma.learningRecord.findUnique({
      where: {
        userId_wordId: {
          userId: Number(userId),
          wordId,
        },
      },
    });
    
    if (!learningRecord) {
      return NextResponse.json({ error: '学习记录不存在' }, { status: 404 });
    }
    
    // 计算下次复习时间
    const nextReview = calculateNextReview(status);
    
    // 更新学习记录
    const updatedRecord = await prisma.learningRecord.update({
      where: {
        userId_wordId: {
          userId: Number(userId),
          wordId,
        },
      },
      data: {
        status,
        lastReviewed: new Date(),
        nextReview,
        reviewCount: learningRecord.reviewCount + 1,
        correctCount: status === 'mastered' 
          ? learningRecord.correctCount + 1 
          : learningRecord.correctCount,
      },
    });
    
    return NextResponse.json({
      status: 'success',
      data: updatedRecord,
    });
  } catch (error) {
    console.error('更新单词状态出错:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 计算下次复习时间
function calculateNextReview(status: string): Date {
  const now = new Date();
  
  switch (status) {
    case 'difficult':
      // 困难单词，1天后再复习
      return new Date(now.setDate(now.getDate() + 1));
    case 'learning':
      // 学习中的单词，3天后再复习
      return new Date(now.setDate(now.getDate() + 3));
    case 'mastered':
      // 已掌握的单词，7天后再复习
      return new Date(now.setDate(now.getDate() + 7));
    default:
      return new Date(now.setDate(now.getDate() + 1));
  }
} 