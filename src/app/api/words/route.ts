import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// 获取用户的单词列表
export async function GET(request: Request) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all'; // all, learning, mastered, difficult
    
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

    // 查询条件
    let where: any = {
      userId: Number(userId),
    };

    // 根据状态筛选
    if (status !== 'all') {
      where.status = status;
    }

    // 查询用户的学习记录
    const learningRecords = await prisma.learningRecord.findMany({
      where,
      include: {
        word: true,
      },
      orderBy: {
        nextReview: 'asc', // 按照下次复习时间排序
      },
    });

    // 转换数据格式
    const words = learningRecords.map(record => ({
      id: record.wordId,
      english: record.word.english,
      chinese: record.word.chinese,
      example: record.word.example,
      status: record.status,
      mastery: calculateMastery(record.correctCount, record.reviewCount),
      nextReview: record.nextReview,
    }));

    return NextResponse.json(words);
  } catch (error) {
    console.error('获取单词出错:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 计算掌握度
function calculateMastery(correctCount: number, reviewCount: number): number {
  if (reviewCount === 0) return 0;
  return Math.round((correctCount / reviewCount) * 100);
} 