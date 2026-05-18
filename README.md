# 天问 (Tianwen)

> AI 华夏术数推演操作系统 · 东方时空认知基础设施

## 项目简介

**天问 (Tianwen)** 是一个大型 AI 华夏术数推演操作系统，融合时间、命运、概率、AI与知识图谱，构建数字天机文明系统。

## 核心特性

- **Chrono Engine** - 时间宇宙引擎（干支、节气、农历、真太阳时）
- **多术数引擎** - 梅花易数、六爻、奇门遁甲、八字、紫微斗数等
- **AI Orchestrator** - AI 总控与多模型推演
- **Knowledge System** - 古籍检索与知识图谱
- **Universe UI** - 东方宇宙风格沉浸式界面

## 项目结构

```
tianwen/
├── apps/
│   └── web/                    # Next.js 前端应用
│
├── packages/
│   ├── chrono-engine/         # 时间宇宙引擎
│   ├── meihua/                # 梅花易数
│   ├── liuyao/                # 六爻纳甲
│   ├── qimen/                 # 奇门遁甲
│   └── shared/                # 共享类型与工具
│
├── knowledge/                 # 知识宇宙
├── docs/                      # 文档
└── ...config files
```

## 技术栈

- **前端**：Next.js 16 + React 20 + TypeScript + TailwindCSS + Framer Motion
- **后端**：FastAPI + Python 3.14 + LangGraph（后期）
- **工程**：Turborepo + pnpm workspace + Monorepo
- **数据库**：PostgreSQL + Redis + Neo4j + Qdrant（后期）

## 开发阶段

### Phase 1（当前）
- ✅ Chrono Engine 基础实现
- ✅ 梅花易数核心模块
- 🔄 前端应用骨架
- ⏳ 六爻 / 奇门 基础结构

### Phase 2
- AI Agent 系统
- Prompt Engine
- 概率分析

### Phase 3
- RAG 系统
- 知识图谱
- 规则引擎

### Phase 4
- 宇宙 UI 系统
- 命运时间轴
- 高级动画

## 快速开始

### 环境要求
- Node.js 24+
- Python 3.14+
- pnpm 9+

### 安装依赖

```bash
corepack enable
npm install -g pnpm turbo
pnpm install
```

### 启动开发服务

```bash
# 启动所有应用
pnpm dev

# 仅启动前端
cd apps/web && pnpm dev
```

### Docker 服务（后期）

```bash
cp .env.example .env
# 编辑 .env 配置
docker compose up -d
```

## 项目理念

> 天问不是 AI 算命网站，而是「东方时空认知操作系统」。
> 融合时间、命运、AI、概率、推演、知识图谱与术数文明，
> 构建数字天机文明系统。

---

「遂古之初，谁传道之？上下未形，何由考之？」

—— 屈原《天问》
