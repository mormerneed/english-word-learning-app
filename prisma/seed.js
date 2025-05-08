const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据...');

  // 清理现有数据
  console.log('清理现有数据...');
  await prisma.learningRecord.deleteMany();
  await prisma.word.deleteMany();
  await prisma.dailyStat.deleteMany();
  await prisma.user.deleteMany();

  // 创建测试用户
  console.log('创建测试用户...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: hashedPassword,
      username: 'testuser',
    },
  });

  // 创建示例单词
  console.log('创建示例单词...');
  const words = [
    {
      english: 'abundant',
      chinese: '丰富的，充裕的',
      example: 'The forest is abundant in wildlife.',
      difficulty: 2,
    },
    {
      english: 'meticulous',
      chinese: '一丝不苟的，细致的',
      example: 'She is meticulous about her work.',
      difficulty: 3,
    },
    {
      english: 'diligent',
      chinese: '勤勉的，刻苦的',
      example: 'He is a diligent student who always finishes his homework.',
      difficulty: 2,
    },
    {
      english: 'eloquent',
      chinese: '雄辩的，有口才的',
      example: 'She gave an eloquent speech at the conference.',
      difficulty: 3,
    },
    {
      english: 'benevolent',
      chinese: '仁慈的，慈善的',
      example: 'The benevolent king was loved by all his subjects.',
      difficulty: 3,
    },
    {
      english: 'concise',
      chinese: '简明的，简洁的',
      example: 'His concise explanation made the complex topic easy to understand.',
      difficulty: 2,
    },
    {
      english: 'integrity',
      chinese: '正直，诚实',
      example: 'She is known for her integrity in business dealings.',
      difficulty: 2,
    },
    {
      english: 'pragmatic',
      chinese: '务实的，实用的',
      example: 'We need a pragmatic approach to solve this problem.',
      difficulty: 3,
    },
    {
      english: 'versatile',
      chinese: '多才多艺的，多用途的',
      example: 'He is a versatile actor who can play many different roles.',
      difficulty: 2,
    },
    {
      english: 'paradigm',
      chinese: '范例，模式',
      example: 'This discovery represents a new paradigm in medical research.',
      difficulty: 4,
    },
  ];

  for (const wordData of words) {
    console.log(`创建单词: ${wordData.english}`);
    
    // 创建单词
    const word = await prisma.word.create({
      data: wordData,
    });

    // 创建学习记录
    const statuses = ['learning', 'mastered', 'difficult'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const reviewCount = Math.floor(Math.random() * 10) + 1;
    const correctCount = Math.floor(Math.random() * (reviewCount + 1));
    
    await prisma.learningRecord.create({
      data: {
        userId: user.id,
        wordId: word.id,
        status: randomStatus,
        reviewCount,
        correctCount,
        lastReviewed: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
        nextReview: new Date(Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      },
    });
  }

  // 创建示例每日统计
  console.log('创建每日统计...');
  const today = new Date();
  
  await prisma.dailyStat.create({
    data: {
      userId: user.id,
      date: today,
      wordsLearned: 5,
      wordsReviewed: 10,
      accuracy: 0.8,
      studyTime: 30, // 分钟
    },
  });

  console.log('数据初始化完成!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 