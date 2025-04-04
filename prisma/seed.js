const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // 创建测试用户
  const user = await prisma.user.create({
    data: {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      points: 100,
      streakDays: 5
    }
  })

  // 创建测试单词
  const words = await Promise.all([
    prisma.word.create({
      data: {
        english: 'hello',
        chinese: '你好',
        example: 'Hello, how are you?',
        category: '基础',
        difficulty: 1
      }
    }),
    prisma.word.create({
      data: {
        english: 'world',
        chinese: '世界',
        example: 'Hello world!',
        category: '基础',
        difficulty: 1
      }
    })
  ])

  // 创建学习记录
  await Promise.all(words.map(word =>
    prisma.learningRecord.create({
      data: {
        userId: user.id,
        wordId: word.id,
        status: 'learning',
        lastReviewed: new Date(),
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000) // 明天
      }
    })
  ))

  // 创建今日统计
  await prisma.dailyStat.create({
    data: {
      userId: user.id,
      date: new Date(),
      wordsLearned: 2,
      wordsReviewed: 5,
      accuracy: 0.8,
      studyTime: 30
    }
  })

  // 创建任务
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: '学习10个新单词',
        description: '完成10个新单词的学习',
        points: 50,
        type: 'daily'
      }
    }),
    prisma.task.create({
      data: {
        title: '复习20个单词',
        description: '完成20个单词的复习',
        points: 30,
        type: 'daily'
      }
    })
  ])

  // 创建成就
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        title: '初出茅庐',
        description: '完成第一次学习',
        icon: '🎓',
        points: 100,
        condition: '完成第一次学习'
      }
    }),
    prisma.achievement.create({
      data: {
        title: '坚持不懈',
        description: '连续学习7天',
        icon: '🔥',
        points: 200,
        condition: '连续学习7天'
      }
    })
  ])
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 