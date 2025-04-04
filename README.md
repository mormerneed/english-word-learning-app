# 英语单词学习应用

这是一个基于 Next.js 开发的英语单词学习应用，旨在帮助用户更有效地学习和记忆英语单词。该应用提供了用户友好的界面和个性化的学习体验。

## 功能特性

- 📝 用户认证系统
  - 安全的注册和登录功能
  - 基于 JWT 的身份验证
  - bcrypt 密码加密存储
  - 用户会话管理

- 📚 单词学习系统
  - 智能单词列表展示
  - 详细的单词信息（包括释义、例句、音标等）
  - 实时学习进度追踪
  - 个性化学习路径

- 📊 个人中心
  - 可视化学习统计
  - 个人信息管理
  - 学习历史记录
  - 成就系统

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 组件**: Shadcn/ui + Radix UI
- **样式方案**: Tailwind CSS
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: JWT (jose)
- **API**: RESTful API
- **状态管理**: React Hooks

## 环境要求

- Node.js 18+
- PostgreSQL 14+
- npm 8+ 或 yarn 1.22+

## 本地开发

1. 克隆项目

```bash
git clone https://github.com/mormerneed/english-word-learning-app.git
cd english-word-learning-app
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 配置环境变量

创建 `.env` 文件，添加以下配置：

```env
# 数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

# JWT 配置
JWT_SECRET="your_jwt_secret"

# 应用配置
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

4. 数据库迁移

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev
```

5. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:3000 查看应用。

## 生产环境部署

1. 构建应用

```bash
npm run build
# 或
yarn build
```

2. 启动生产服务器

```bash
npm start
# 或
yarn start
```

## 项目结构

```
english-word-learning-app/
├── src/
│   ├── app/              # Next.js 应用路由
│   ├── components/       # React 组件
│   ├── lib/             # 工具函数和配置
│   └── types/           # TypeScript 类型定义
├── prisma/              # Prisma 配置和迁移
├── public/             # 静态资源
└── package.json        # 项目依赖
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
