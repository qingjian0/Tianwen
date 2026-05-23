
# 天问 (Tianwen) 系统架构文档

## 概述

**天问**是一个AI华夏术数推演操作系统，采用Monorepo架构，基于TypeScript、React、Next.js构建。系统融合时间、命运、概率、AI与知识图谱，构建数字天机文明系统，是一个东方时空认知基础设施。

## 目录结构

```
tianwen/
├── apps/                          # 应用层
│   ├── web/                       # Next.js 前端应用
│   │   ├── src/
│   │   │   ├── app/               # App Router 页面
│   │   │   │   ├── meihua/        # 梅花易数页面
│   │   │   │   ├── qimen/         # 奇门遁甲页面
│   │   │   │   ├── liuren/        # 大六壬页面
│   │   │   │   ├── bazi/          # 八字页面
│   │   │   │   ├── ziwei/         # 紫微斗数页面
│   │   │   │   ├── page.tsx       # 首页
│   │   │   │   └── layout.tsx     # 根布局
│   │   │   ├── components/        # 组件
│   │   │   │   ├── layout/        # 布局组件
│   │   │   │   ├── divination/    # 占卜相关组件
│   │   │   │   └── ui/            # UI组件
│   │   │   ├── stores/            # 状态管理
│   │   │   └── styles/            # 样式
│   │   └── package.json
│   │
│   └── server/                    # 后端服务
│       ├── server.ts              # 服务器入口
│       └── package.json
│
├── packages/                      # 包层（核心引擎）
│   ├── chrono-engine/             # 时间宇宙引擎 ⭐ 核心
│   │   ├── src/
│   │   │   ├── chronoEngine.ts    # 主引擎类
│   │   │   ├── ganzhi.ts          # 干支计算
│   │   │   ├── lunar.ts           # 农历转换
│   │   │   ├── jieqi.ts           # 节气计算
│   │   │   ├── constants.ts       # 常量
│   │   │   └── types.ts           # 类型定义
│   │   └── package.json
│   │
│   ├── meihua/                    # 梅花易数引擎 ⭐
│   │   ├── src/
│   │   │   ├── meihua.ts          # 主引擎类
│   │   │   ├── constants.ts       # 八卦常量
│   │   │   ├── types.ts           # 类型定义
│   │   │   └── utils.ts           # 工具函数
│   │   └── package.json
│   │
│   ├── liuyao/                    # 六爻纳甲引擎
│   │   ├── src/
│   │   │   ├── liuyao.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── qimen/                     # 奇门遁甲引擎
│   │   ├── src/
│   │   │   ├── qimen.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── bazi-engine/               # 八字命理引擎
│   │   ├── src/
│   │   │   ├── bazi.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ziwei/                     # 紫微斗数引擎
│   │   ├── src/
│   │   │   ├── ziwei.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── liuren/                    # 大六壬引擎
│   │   ├── src/
│   │   │   ├── engine.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── xiaochengtu/               # 小成图引擎
│   │   ├── src/
│   │   │   ├── engine.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── huangli/                   # 皇极经世引擎
│   │   ├── src/
│   │   │   ├── engine.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── huangji/                   # 皇极数引擎
│   │   ├── src/
│   │   │   ├── engine.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── cegui/                     # 测鬼引擎
│   │   ├── src/
│   │   │   ├── engine.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── metaphysics-types/         # 术数类型系统
│   │   ├── src/
│   │   │   ├── eight-trigram.ts   # 八卦
│   │   │   ├── five-element.ts    # 五行
│   │   │   ├── ganzhi.ts          # 干支
│   │   │   ├── nine-palace.ts     # 九宫
│   │   │   ├── solar-term.ts      # 节气
│   │   │   ├── star.ts            # 星曜
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ui/                        # UI 组件库（东方宇宙风）
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── glow-text.tsx
│   │   │   │   └── star-background.tsx
│   │   │   ├── design-system/
│   │   │   │   ├── colors.ts
│   │   │   │   ├── shadows.ts
│   │   │   │   ├── typography.ts
│   │   │   │   └── index.ts
│   │   │   ├── theme/
│   │   │   │   ├── theme.ts
│   │   │   │   └── index.ts
│   │   │   └── index.tsx
│   │   └── package.json
│   │
│   ├── animations/                # 动画系统
│   │   ├── src/
│   │   │   ├── cosmic.ts
│   │   │   ├── presets.ts
│   │   │   ├── page.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── prompts/                   # Prompt 引擎
│   │   ├── src/
│   │   │   ├── dsl/
│   │   │   │   ├── builder.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   ├── templates/
│   │   │   │   ├── presets.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── prompt-orchestrator/       # Prompt 编排器
│   │   ├── src/
│   │   │   ├── prompt-orchestrator.ts
│   │   │   ├── prompt-builder.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── api/                       # API 服务
│   │   ├── src/
│   │   │   ├── api-server.ts
│   │   │   ├── prediction-service.ts
│   │   │   ├── rule-service.ts
│   │   │   ├── websocket-service.ts
│   │   │   ├── server.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── pipeline/                  # 推演管道系统
│   │   ├── src/
│   │   │   ├── pipeline.ts
│   │   │   ├── pipeline-context.ts
│   │   │   ├── stages.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── prediction-core/           # 预测核心
│   │   ├── src/
│   │   │   ├── prediction-pipeline.ts
│   │   │   ├── prediction-context.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── signal-system/             # 信号系统
│   │   ├── src/
│   │   │   ├── signal-processor.ts
│   │   │   ├── signal-validator.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── signal-extractor/          # 信号提取器
│   │   ├── src/
│   │   │   ├── signal-extractor.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── rule-engine-core/          # 规则引擎核心
│   │   ├── src/
│   │   │   ├── rule-evaluator.ts
│   │   │   ├── rule-builder.ts
│   │   │   ├── conflict-resolver.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── rule-dsl/                  # 规则 DSL
│   │   ├── src/
│   │   │   ├── lexer.ts
│   │   │   ├── parser.ts
│   │   │   ├── interpreter.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── rule-compiler/             # 规则编译器
│   │   ├── src/
│   │   │   ├── rule-compiler.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── rule-knowledge-graph/      # 规则知识图谱
│   │   ├── src/
│   │   │   ├── rule-knowledge-graph.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── probability-engine/        # 概率引擎
│   │   ├── src/
│   │   │   ├── probability-calculator.ts
│   │   │   ├── probability-analyzer.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── probability-mapping/       # 概率映射器
│   │   ├── src/
│   │   │   ├── probability-mapper.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── fortune-engine/            # 运势引擎
│   │   ├── src/
│   │   │   ├── fortune-calculator.ts
│   │   │   ├── fortune-analyzer.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── timing-engine/             # 时序引擎
│   │   ├── src/
│   │   │   ├── timing-calculator.ts
│   │   │   ├── window-generator.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── interpretation-engine/     # 解读引擎
│   │   ├── src/
│   │   │   ├── interpretation-generator.ts
│   │   │   ├── rule-based-interpreter.ts
│   │   │   ├── suggestion-engine.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── resonance-engine/          # 共振引擎
│   │   ├── src/
│   │   │   ├── resonance-calculator.ts
│   │   │   ├── conflict-analyzer.ts
│   │   │   ├── resonance-engine-v2.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── fusion-engine/             # 融合引擎
│   │   ├── src/
│   │   │   ├── fusion-engine.ts
│   │   │   ├── fusion-strategies.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── weight-system/             # 权重系统
│   │   ├── src/
│   │   │   ├── weight-calculator.ts
│   │   │   ├── weight-validator.ts
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── cognitive-engine/          # 认知引擎
│   │   ├── src/
│   │   │   ├── cognitive-engine.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── classics/                  # 经典古籍系统
│   │   ├── src/
│   │   │   ├── classic-engine.ts
│   │   │   ├── zhouyi-content.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── calibration/               # 校准系统
│   │   ├── src/
│   │   │   ├── calibration-engine.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── calibration-engine/        # 校准引擎
│   │   ├── src/
│   │   │   ├── calibration-engine.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── manual-divination/         # 手动起卦系统
│   │   ├── src/
│   │   │   ├── manual-divination-engine.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── case-replay/               # 案例回放系统
│   │   ├── src/
│   │   │   ├── replay-engine.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── replay-system/             # 回放系统
│   │   ├── src/
│   │   │   ├── replay-recorder.ts
│   │   │   ├── snapshot-manager.ts
│   │   │   ├── deterministic-random.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── execution-graph/           # 执行图系统
│   │   ├── src/
│   │   │   ├── execution-graph.ts
│   │   │   ├── tianwen-pipeline.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── runtime-observability/     # 运行时可观测性
│   │   ├── src/
│   │   │   ├── tracer.ts
│   │   │   ├── metrics-collector.ts
│   │   │   ├── rule-stats.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── runtime-sandbox/           # 运行时沙箱
│   │   ├── src/
│   │   │   ├── sandbox-runtime.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── runtime-state/             # 运行时状态
│   │   ├── src/
│   │   │   ├── execution-context-store.ts
│   │   │   ├── prediction-history.ts
│   │   │   ├── rule-cache.ts
│   │   │   ├── memory-adapter.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── temporal-memory/           # 时序记忆系统
│   │   ├── src/
│   │   │   ├── temporal-memory.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── event-bus/                 # 事件总线
│   │   ├── src/
│   │   │   ├── event-bus.ts
│   │   │   ├── tianwen-events.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── shared/                    # 共享工具
│       ├── src/
│       │   ├── engine-interface/
│       │   │   ├── base.ts
│       │   │   ├── types.ts
│       │   │   └── index.ts
│       │   ├── errors/
│       │   │   ├── errors.ts
│       │   │   └── index.ts
│       │   ├── logger/
│       │   │   ├── logger.ts
│       │   │   └── index.ts
│       │   ├── prediction-schema/
│       │   │   ├── schemas.ts
│       │   │   ├── types.ts
│       │   │   └── index.ts
│       │   └── index.ts
│       └── package.json
│
├── knowledge/                     # 知识宇宙
│   ├── classics/                  # 古籍（滴天髓、三命通会等）
│   ├── modern/                    # 现代研究
│   ├── cases/                     # 实战案例
│   └── rules/                     # 规则库
│       ├── example.ts
│       ├── index.ts
│       └── test-rule-demo.ts
│
├── docs/                          # 文档
│   ├── ARCHITECTURE.md            # 本文件
│   ├── API_DESIGN.md
│   ├── PHASE_5_SUMMARY.md
│   ├── PHASE_6_PIPELINE.md
│   └── PHASE_8_SUMMARY.md
│
├── .trae/                         # Trae AI 配置
├── turbo.json                     # Turborepo 配置
├── pnpm-workspace.yaml            # pnpm workspace 配置
├── tsconfig.json                  # TypeScript 配置
├── package.json                   # 根项目配置
└── README.md
```

## 系统架构分层

### 1. 应用层 (Apps Layer)

**web** - Next.js 前端应用
- 使用 App Router 进行路由管理
- 集成 Zustand 进行状态管理
- 采用 TailwindCSS + Framer Motion 实现东方宇宙风格UI
- 调用各术数引擎进行推演展示

**server** - 后端服务
- 提供 API 接口
- WebSocket 实时通信
- 整合所有术数引擎

### 2. 核心引擎层 (Core Engines Layer)

#### 2.1 时间宇宙引擎 (Chrono Engine) ⭐

**位置**: `packages/chrono-engine/`

**核心功能**:
- 公历转农历
- 干支计算（年、月、日、时）
- 节气计算
- 真太阳时计算
- 时辰、太岁、月建、旬空、九星等特殊信息计算

**核心类**: `ChronoEngine`

**主要方法**:
```typescript
class ChronoEngine {
  constructor(date?: Date, coordinates?: Coordinates, useTrueSun?: boolean)
  calculate(): ChronoData
  static now(coordinates?: Coordinates, useTrueSun?: boolean): ChronoData
  static at(date: Date, coordinates?: Coordinates, useTrueSun?: boolean): ChronoData
}
```

**数据流向**:
```
输入时间/经纬度 → 真太阳时计算 → 农历转换 → 干支计算 → 节气计算 → 综合时空信息输出
```

#### 2.2 术数类型系统 (Metaphysics Types)

**位置**: `packages/metaphysics-types/`

**功能**:
- 八卦定义 (eight-trigram.ts)
- 五行定义 (five-element.ts)
- 干支定义 (ganzhi.ts)
- 九宫定义 (nine-palace.ts)
- 节气定义 (solar-term.ts)
- 星曜定义 (star.ts)

#### 2.3 梅花易数引擎 (Meihua Engine) ⭐

**位置**: `packages/meihua/`

**核心功能**:
- 时间起卦
- 数字起卦（单数字、双数字、三数字）
- 随机起卦
- 铜钱起卦
- 手动起卦
- 本卦、互卦、变卦、错卦、综卦计算
- 体用关系分析
- 动爻计算

**核心类**: `MeihuaEngine`

**主要方法**:
```typescript
class MeihuaEngine {
  divinateByTime(date?: Date): MeihuaResult
  divinateBySingleNumber(num: number): MeihuaResult
  divinateByDoubleNumber(num1: number, num2: number): MeihuaResult
  divinateByTripleNumber(num1: number, num2: number, num3: number): MeihuaResult
  divinateByRandom(): MeihuaResult
  divinateByCoin(coinResults: number[]): MeihuaResult
  divinateByManual(shangGua: string, xiaGua: string, dongYao?: number | number[]): MeihuaResult
}
```

#### 2.4 其他术数引擎

| 引擎 | 位置 | 功能 |
|------|------|------|
| 六爻 | `packages/liuyao/` | 六爻纳甲推演 |
| 奇门遁甲 | `packages/qimen/` | 奇门遁甲排盘 |
| 八字 | `packages/bazi-engine/` | 八字命理分析 |
| 紫微斗数 | `packages/ziwei/` | 紫微斗数排盘 |
| 大六壬 | `packages/liuren/` | 大六壬推演 |
| 小成图 | `packages/xiaochengtu/` | 小成图推演 |
| 皇极经世 | `packages/huangli/` | 皇极经世 |
| 皇极数 | `packages/huangji/` | 皇极数 |
| 测鬼 | `packages/cegui/` | 测鬼 |

### 3. 管道与处理层 (Pipeline & Processing Layer)

#### 3.1 推演管道 (Pipeline)

**位置**: `packages/pipeline/`

**功能**:
- 多阶段推演流程
- 管道上下文管理
- 阶段执行控制

#### 3.2 预测核心 (Prediction Core)

**位置**: `packages/prediction-core/`

**功能**:
- 预测管道编排
- 预测上下文管理

#### 3.3 信号系统 (Signal System)

**位置**: `packages/signal-system/`, `packages/signal-extractor/`

**功能**:
- 信号处理
- 信号验证
- 信号提取

### 4. 规则与推理层 (Rules & Inference Layer)

#### 4.1 规则引擎核心 (Rule Engine Core)

**位置**: `packages/rule-engine-core/`

**功能**:
- 规则评估
- 规则构建
- 冲突解决

#### 4.2 规则 DSL (Rule DSL)

**位置**: `packages/rule-dsl/`

**功能**:
- 词法分析 (lexer)
- 语法分析 (parser)
- 解释执行 (interpreter)

#### 4.3 规则知识图谱 (Rule Knowledge Graph)

**位置**: `packages/rule-knowledge-graph/`

**功能**:
- 规则知识图谱构建
- 规则关系管理

### 5. 分析与解读层 (Analysis & Interpretation Layer)

#### 5.1 概率引擎 (Probability Engine)

**位置**: `packages/probability-engine/`, `packages/probability-mapping/`

**功能**:
- 概率计算
- 概率分析
- 概率映射

#### 5.2 运势引擎 (Fortune Engine)

**位置**: `packages/fortune-engine/`

**功能**:
- 运势计算
- 运势分析

#### 5.3 时序引擎 (Timing Engine)

**位置**: `packages/timing-engine/`

**功能**:
- 时序计算
- 时间窗口生成

#### 5.4 解读引擎 (Interpretation Engine)

**位置**: `packages/interpretation-engine/`

**功能**:
- 解读生成
- 规则解读
- 建议生成

#### 5.5 共振引擎 (Resonance Engine)

**位置**: `packages/resonance-engine/`

**功能**:
- 共振计算
- 冲突分析

#### 5.6 融合引擎 (Fusion Engine)

**位置**: `packages/fusion-engine/`

**功能**:
- 多术数结果融合
- 融合策略

#### 5.7 权重系统 (Weight System)

**位置**: `packages/weight-system/`

**功能**:
- 权重计算
- 权重验证

### 6. 认知与知识层 (Cognitive & Knowledge Layer)

#### 6.1 认知引擎 (Cognitive Engine)

**位置**: `packages/cognitive-engine/`

**功能**:
- 高级认知推理

#### 6.2 经典古籍系统 (Classics)

**位置**: `packages/classics/`

**功能**:
- 古籍内容管理
- 古籍检索

### 7. 运行时与支撑层 (Runtime & Support Layer)

#### 7.1 执行图 (Execution Graph)

**位置**: `packages/execution-graph/`

**功能**:
- 执行图管理
- 管道执行

#### 7.2 运行时可观测性 (Runtime Observability)

**位置**: `packages/runtime-observability/`

**功能**:
- 追踪 (tracer)
- 指标收集
- 规则统计

#### 7.3 运行时沙箱 (Runtime Sandbox)

**位置**: `packages/runtime-sandbox/`

**功能**:
- 沙箱运行环境

#### 7.4 运行时状态 (Runtime State)

**位置**: `packages/runtime-state/`

**功能**:
- 执行上下文存储
- 预测历史
- 规则缓存

#### 7.5 时序记忆 (Temporal Memory)

**位置**: `packages/temporal-memory/`

**功能**:
- 时序数据记忆
- 历史管理

#### 7.6 事件总线 (Event Bus)

**位置**: `packages/event-bus/`

**功能**:
- 事件发布订阅
- 系统事件管理

#### 7.7 回放系统 (Replay System)

**位置**: `packages/replay-system/`, `packages/case-replay/`

**功能**:
- 案例回放
- 确定性随机
- 快照管理

#### 7.8 校准系统 (Calibration)

**位置**: `packages/calibration/`, `packages/calibration-engine/`

**功能**:
- 系统校准
- 参数调整

#### 7.9 手动起卦 (Manual Divination)

**位置**: `packages/manual-divination/`

**功能**:
- 手动起卦支持

### 8. UI 与交互层 (UI & Interaction Layer)

#### 8.1 UI 组件库 (UI)

**位置**: `packages/ui/`

**功能**:
- 东方宇宙风格组件
- 设计系统
- 主题管理

#### 8.2 动画系统 (Animations)

**位置**: `packages/animations/`

**功能**:
- 宇宙动画
- 动效预设

### 9. API 与服务层 (API & Service Layer)

#### 9.1 API 服务 (API)

**位置**: `packages/api/`

**功能**:
- API 服务器
- 预测服务
- 规则服务
- WebSocket 服务

### 10. Prompt 层 (Prompt Layer)

#### 10.1 Prompt 引擎 (Prompts)

**位置**: `packages/prompts/`

**功能**:
- Prompt DSL
- Prompt 模板
- Prompt 构建

#### 10.2 Prompt 编排器 (Prompt Orchestrator)

**位置**: `packages/prompt-orchestrator/`

**功能**:
- Prompt 编排
- Prompt 生成

## 模块依赖关系图

```
apps/web
├── @tianwen/ui
├── @tianwen/animations
├── @tianwen/prompts
├── @tianwen/shared
├── @tianwen/chrono-engine
└── @tianwen/meihua

apps/server
├── @tianwen/meihua
├── @tianwen/liuyao
├── @tianwen/qimen
├── @tianwen/bazi-engine
├── @tianwen/ziwei
├── @tianwen/liuren
├── @tianwen/xiaochengtu
├── @tianwen/huangli
├── @tianwen/huangji
├── @tianwen/cegui
└── @tianwen/pipeline

packages/pipeline
├── @tianwen/chrono-engine
├── @tianwen/meihua
├── @tianwen/liuyao
├── @tianwen/bazi-engine
├── @tianwen/liuren
├── @tianwen/xiaochengtu
├── @tianwen/huangli
├── @tianwen/huangji
├── @tianwen/cegui
├── @tianwen/signal-system
├── @tianwen/signal-extractor
├── @tianwen/rule-engine-core
├── @tianwen/probability-engine
├── @tianwen/probability-mapping
├── @tianwen/fortune-engine
├── @tianwen/timing-engine
└── @tianwen/interpretation-engine

packages/meihua
└── @tianwen/chrono-engine

packages/liuyao
└── @tianwen/chrono-engine

packages/qimen
└── @tianwen/chrono-engine

packages/bazi-engine
├── @tianwen/chrono-engine
└── @tianwen/metaphysics-types

# ... 其他术数引擎类似，都依赖 chrono-engine
```

## 技术栈说明

### 前端技术栈
- **框架**: Next.js 15+ (App Router)
- **UI 库**: React 19+
- **语言**: TypeScript 5+
- **样式**: TailwindCSS
- **动画**: Framer Motion
- **状态管理**: Zustand
- **数据验证**: Zod

### 后端技术栈
- **运行时**: Node.js + tsx
- **语言**: TypeScript 5+

### 工程化
- **Monorepo**: Turborepo
- **包管理**: pnpm 9+
- **构建**: tsup
- **类型检查**: TypeScript

### 数据库 (后期规划)
- **关系型**: PostgreSQL
- **缓存**: Redis
- **图数据库**: Neo4j
- **向量数据库**: Qdrant

## 数据流向图

### 完整推演数据流

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         用户输入层 (User Input)                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │时间/数字 │  │铜钱结果 │  │手动起卦 │  │地理位置 │  │问题描述 │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
└───────┼────────────┼────────────┼────────────┼────────────┼───────────┘
        │            │            │            │            │
        ▼            ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       信号处理层 (Signal Processing)                          │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                    Signal System / Signal Extractor                    │ │
│  └───────────────────────────────────────┬───────────────────────────────┘ │
└──────────────────────────────────────────┼──────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      时空计算层 (Temporal Calculation)                       │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                          Chrono Engine                                │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │ │
│  │  │公历转农历 │ │干支计算  │ │节气计算  │ │真太阳时  │ │特殊信息  │   │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │ │
│  └───────────────────────────────────────┬───────────────────────────────┘ │
└──────────────────────────────────────────┼──────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      术数推演层 (Divination Engines)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │梅花易数  │  │ 六爻    │  │奇门遁甲  │  │ 八字    │  │紫微斗数  │    │
│  │ Engine   │  │ Engine  │  │ Engine   │  │ Engine  │  │ Engine   │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │            │            │            │            │              │
│  ┌────┴─────┐  ┌───┴────┐  ┌───┴────┐  ┌───┴────┐  ┌───┴────┐        │
│  │本/互/变  │  │纳甲排盘│  │奇门盘式│  │八字排盘│  │紫微盘式│        │
│  │错/综卦   │  │        │  │        │  │        │  │        │        │
│  └──────────┘  └────────┘  └────────┘  └────────┘  └────────┘        │
└──────────────────────────────────────────┼──────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     规则推理层 (Rule Inference)                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                        Rule Engine Core                               │ │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │ │
│  │  │ 规则评估器       │  │ 冲突解决器       │  │ 规则构建器       │   │ │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘   │ │
│  └───────────────────────────────────────┬───────────────────────────────┘ │
└──────────────────────────────────────────┼──────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   概率与分析层 (Probability & Analysis)                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐        │
│  │ Probability      │  │ Fortune Engine   │  │ Timing Engine    │        │
│  │ Engine           │  │                  │  │                  │        │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘        │
│           │                     │                     │                     │
│  ┌────────▼─────────┐  ┌────────▼─────────┐  ┌────────▼─────────┐        │
│  │ 概率计算/分析    │  │ 运势计算/分析    │  │ 时序计算/窗口    │        │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘        │
└──────────────────────────────────────────┼──────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   共振与融合层 (Resonance & Fusion)                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐        │
│  │ Resonance        │  │ Fusion Engine    │  │ Weight System    │        │
│  │ Engine           │  │                  │  │                  │        │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘        │
│           │                     │                     │                     │
│  ┌────────▼─────────┐  ┌────────▼─────────┐  ┌────────▼─────────┐        │
│  │ 共振计算/冲突    │  │ 多术数结果融合    │  │ 权重计算/验证    │        │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘        │
└──────────────────────────────────────────┼──────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   解读与生成层 (Interpretation & Generation)                  │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                      Interpretation Engine                           │ │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │ │
│  │  │ 解读生成器       │  │ 规则解读器       │  │ 建议生成器       │   │ │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘   │ │
│  └───────────────────────────────────────┬───────────────────────────────┘ │
└──────────────────────────────────────────┼──────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      认知与知识层 (Cognitive & Knowledge)                     │
│  ┌──────────────────┐  ┌──────────────────┐                                │
│  │ Cognitive        │  │ Classics Engine  │                                │
│  │ Engine           │  │                  │                                │
│  └──────────────────┘  └──────────────────┘                                │
└──────────────────────────────────────────┼──────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       输出展示层 (Output & Display)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ 卦象展示 │  │ 排盘展示 │  │ 解读文本 │  │ 概率可视化│  │ 建议列表 │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 梅花易数起卦数据流示例

```
用户输入时间/数字
    │
    ▼
MeihuaEngine.divinateByX()
    │
    ├─→ ChronoEngine.calculate() 获取时空信息
    │       ├─→ 真太阳时计算
    │       ├─→ 农历转换
    │       ├─→ 干支计算
    │       └─→ 返回 ChronoData
    │
    ├─→ 起卦计算
    │       ├─→ 上卦计算
    │       ├─→ 下卦计算
    │       └─→ 动爻计算
    │
    ├─→ 卦象衍生计算
    │       ├─→ 本卦 (Ben Gua)
    │       ├─→ 互卦 (Hu Gua)
    │       ├─→ 变卦 (Bian Gua)
    │       ├─→ 错卦 (Cuo Gua)
    │       ├─→ 综卦 (Zong Gua)
    │       └─→ 体用 (Ti Yong)
    │
    └─→ 生成解读
            └─→ 返回 MeihuaResult
                │
                ▼
            前端展示
```

## 核心工作流程

### 1. 初始化流程

```
1. 用户启动应用
2. 加载 Chrono Engine（获取当前时空信息）
3. 初始化各术数引擎
4. 加载规则库
5. 初始化 UI 组件
6. 等待用户输入
```

### 2. 推演流程

```
1. 用户选择术数方法（梅花/六爻/奇门/...）
2. 输入推演参数（时间/数字/位置/...）
3. 调用对应术数引擎
4. 术数引擎内部调用 Chrono Engine 计算时空信息
5. 执行起卦/排盘逻辑
6. 通过 Pipeline 执行多阶段处理
   ├─→ 信号处理
   ├─→ 规则推理
   ├─→ 概率分析
   ├─→ 共振计算
   ├─→ 结果融合
   └─→ 解读生成
7. 返回完整推演结果
8. 前端可视化展示
```

### 3. 管道执行流程

```
Pipeline 初始化
    │
    ▼
创建 PipelineContext
    │
    ▼
按顺序执行各阶段:
    │
    ├─→ Stage 1: 信号提取 (Signal Extraction)
    │
    ├─→ Stage 2: 时空计算 (Temporal Calculation)
    │
    ├─→ Stage 3: 术数推演 (Divination)
    │
    ├─→ Stage 4: 规则推理 (Rule Inference)
    │
    ├─→ Stage 5: 概率分析 (Probability Analysis)
    │
    ├─→ Stage 6: 共振计算 (Resonance Calculation)
    │
    ├─→ Stage 7: 结果融合 (Result Fusion)
    │
    └─→ Stage 8: 解读生成 (Interpretation)
    │
    ▼
返回最终结果
```

## 关键设计原则

### 1. 模块化设计
- 各引擎独立封装，通过清晰的接口交互
- 依赖注入，便于测试和替换
- 单一职责，每个模块只做一件事

### 2. 可扩展性
- Pipeline 模式支持灵活的阶段组合
- 规则引擎支持动态规则加载
- 多术数引擎并行支持

### 3. 类型安全
- 全面的 TypeScript 类型定义
- 统一的类型系统 (metaphysics-types)
- Zod 数据验证

### 4. 可观测性
- 事件总线支持系统监控
- 运行时追踪和指标收集
- 案例回放支持调试

### 5. 知识驱动
- 规则引擎驱动推演逻辑
- 知识图谱支持关系推理
- 古籍库提供理论支撑

## 开发阶段规划

### Phase 1 (当前) ✅
- Monorepo 项目初始化
- Chrono Engine 基础实现
- 梅花易数核心模块
- 术数类型系统 (metaphysics-types)
- UI 组件库结构
- 前端应用骨架
- 首页（天问殿）UI 实现

### Phase 2
- AI Agent 系统
- Prompt Engine
- 概率分析与共振分析

### Phase 3
- RAG 系统
- 知识图谱
- 规则引擎

### Phase 4
- 宇宙 UI 系统
- 命运时间轴
- 高级动画与可视化

## 总结

天问系统是一个分层设计的复杂系统，从底层的时空计算到上层的AI解读，形成了完整的东方术数推演链条。系统采用模块化设计，各组件通过清晰的接口协作，同时保持了高度的可扩展性和可维护性。

核心特点：
1. **Chrono Engine 为核心** - 所有术数推演的时空基础
2. **多术数引擎并行** - 梅花、六爻、奇门、八字、紫微等多方法支持
3. **Pipeline 串联处理** - 信号→规则→概率→共振→融合→解读
4. **规则+知识双驱动** - 规则引擎+知识图谱
5. **东方宇宙风格** - 独特的 UI 设计语言

这是一个集传统文化、现代计算、人工智能于一体的创新系统。
