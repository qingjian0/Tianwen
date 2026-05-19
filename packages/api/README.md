# 天问 API 服务

Phase 7: RESTful + WebSocket API 封装

## 概述

为天问系统提供统一的 API 接口，支持预测请求、规则查询、历史回放等功能。

## 功能

### 1. RESTful API

#### 预测接口

```bash
# 创建预测
POST /api/predictions
{
  "question": "今日财运如何？",
  "category": "wealth",
  "system": "meihua",
  "mode": "single"
}

# 获取预测结果
GET /api/predictions/:id

# 获取预测历史
GET /api/predictions?page=1&limit=20
```

#### 规则接口

```bash
# 获取所有规则
GET /api/rules?category=bazi&page=1&limit=20

# 获取规则详情
GET /api/rules/:id

# 获取规则分类
GET /api/rules/categories/list

# 获取某分类规则
GET /api/rules/categories/bazi
```

#### 健康检查

```bash
GET /api/health
```

### 2. WebSocket 实时推送

连接: `ws://localhost:3000/ws`

#### 消息类型

```typescript
// 进度更新
{
  type: 'progress',
  payload: {
    stage: 'rule',
    status: 'processing',
    progress: 50,
    message: '正在匹配规则...'
  }
}

// 预测结果
{
  type: 'prediction',
  payload: { ... }
}

// 错误通知
{
  type: 'error',
  payload: { error: 'Error message' }
}
```

#### 订阅频道

- `predictions`: 预测相关消息
- `rules`: 规则相关消息
- `system`: 系统通知

## 使用示例

```typescript
import { PredictionService, RuleService } from '@tianwen/api';

const predictionService = new PredictionService();
const ruleService = new RuleService();

// 创建预测
const result = await predictionService.predict({
  question: '今日财运如何？',
  category: 'wealth',
  system: 'meihua',
  mode: 'single'
});

// 获取规则
const rules = await ruleService.getRulesByCategory('bazi');
```

## 开发

```bash
# 启动开发服务器
pnpm run dev

# 构建
pnpm run build

# 测试
pnpm run test
```

---

*Phase 7 - RESTful + WebSocket API - 2026年5月*
