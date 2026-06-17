# LinguaVerse · 语元

> 沉浸式多语种学习平台 · 英语 / 日语 / 韩语

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ 核心特性

| 模块 | 说明 |
|------|------|
| 分级课程体系 | 12 门课程覆盖英语 CEFR A1-C2 / 日语 JLPT N5-N1 / 韩语 TOPIK 1-5 |
| 四大训练模块 | 单词记忆（闪卡 + 拼写）/ 语法练习（选择 + 错题解析）/ 口语跟读（AI 评分波形）/ 听力训练（多档语速） |
| 学习进度追踪 | 6 维能力雷达图 + 月度趋势 + 周柱状图 + 8 周热力日历 + 错题本 |
| 用户系统 | 邮箱注册登录 + 第三方登录（模拟） |
| 个性化推荐 | 基于目标语种、等级、薄弱维度生成每日 30 分钟学习路径 |
| 社区生态 | 动态发布 / 点赞评论 / 学习小组 |
| 成就激励 | 12 枚稀有徽章 + 周排行榜 + 积分商城 |

## 🎨 设计风格

- 字体：Fraunces 衬线展示体 + Inter / Noto Sans SC 正文 + Noto Serif JP/KR 语种点缀
- 配色：深墨黑 `#0B0B0F` × 米白 `#F4F1EA` + 樱粉 / 翡翠青 / 琥珀金三语种文化色
- 元素：巨幅衬线大标题、霓虹渐变 CTA、硬阴影按钮、切角 notched 卡片、噪点纹理、滚动字符背景

## 🛠️ 技术栈

- **框架**：React 18.3 + TypeScript 5.6
- **构建**：Vite 5.4
- **路由**：React Router 6
- **状态**：Zustand 4（带 localStorage 持久化）
- **样式**：Tailwind CSS 3.4
- **图表**：Recharts 2.12
- **图标**：Lucide React

## 📁 项目结构

```
src/
├── components/        # 通用组件（layout/ui/charts）
├── pages/             # 页面组件（15 个）
├── stores/            # Zustand stores
├── data/              # Mock 数据
├── types/             # 全局类型
├── utils/             # 工具函数
├── App.tsx            # 根组件 + 路由
├── main.tsx           # 入口
└── index.css          # 全局样式
```

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

## 📊 数据持久化

所有用户数据通过 localStorage 持久化（键名 `linguaverse:*`），无需后端即可演示完整功能闭环。

## 📄 文档

- [产品需求文档 (PRD)](.trae/documents/PRD.md)
- [技术架构文档](.trae/documents/TECHNICAL_ARCHITECTURE.md)

## 📜 License

MIT
