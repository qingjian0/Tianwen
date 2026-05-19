# 天问 Pipeline 核心模块

Phase 6: 完整推演流水线

## 概述

TianwenPipeline 是天问系统的核心推演引擎，将 Phase 4 的术数计算引擎与 Phase 5 的规则文明系统整合成完整推演流水线。

## 核心功能

### 1. 完整的推演流水线

```
用户输入
    ↓
Chrono Engine (时间计算)
    ↓
起卦排盘 (Meihua/Liuyao/Bazi/Qimen)
    ↓
Signal Extractor (信号提取)
    ↓
Rule Engine (规则匹配)
    ↓
Conflict Resolver (冲突检测与解决)
    ↓
Probability Mapper (概率映射)
    ↓
Fortune Engine (吉凶计算)
    ↓
Timing Engine (时间分析)
    ↓
Interpretation Engine (规则解释)
    ↓
最终输出 (含轨迹、溯源、建议)
```

### 2. 阶段处理器

- `ChronoProcessor`: 时间计算
- `DivinationProcessor`: 起卦排盘
- `SignalProcessor`: 信号提取
- `RuleProcessor`: 规则评估
- `ProbabilityProcessor`: 概率映射
- `FortuneProcessor`: 吉凶计算
- `InterpretationProcessor`: 解释生成

### 3. 上下文管理

- 流水线上下文创建和管理
- 阶段状态追踪
- 计算时长记录
- 错误和警告收集

### 4. 可配置性

- 启用/禁用特定阶段
- 超时配置
- 重试策略
- 错误处理策略

## 使用示例

```typescript
import { TianwenPipeline, PredictionInput } from '@tianwen/pipeline';

// 创建 Pipeline
const pipeline = new TianwenPipeline({
  enableCache: true,
  enableConflictResolution: true,
  rules: {
    enabled: true,
    categories: ['meihua', 'liuyao']
  }
});

// 准备输入
const input: PredictionInput = {
  question: '今日财运如何？',
  category: 'wealth',
  system: 'meihua',
  mode: 'single',
  timestamp: new Date()
};

// 执行推演
const result = await pipeline.execute(input);

// 获取结果
if (result.success) {
  console.log('摘要:', result.output.summary);
  console.log('成功概率:', result.output.probability.success);
  console.log('吉凶等级:', result.output.fortune.level);
  console.log('计算轨迹:', result.output.calculationTrace);
}
```

## 配置选项

```typescript
interface PipelineConfig {
  enableCache: boolean;              // 启用缓存
  enableConflictResolution: boolean;  // 启用冲突解决
  enableMultiSystemFusion: boolean;   // 启用多系统融合
  maxExecutionTimeMs: number;         // 最大执行时间
  stages: StageConfig[];              // 阶段配置
  rules: {
    enabled: boolean;
    categories?: string[];
    strategy?: string;
  };
  interpretation: {
    enabled: boolean;
    style?: 'formal' | 'casual' | 'detailed';
    includeTrace?: boolean;
  };
}
```

## 输出结构

```typescript
interface PredictionOutput {
  summary: string;                    // 摘要
  probability: {                      // 概率分析
    success: number;
    failure: number;
    confidence: number;
  };
  fortune: {                          // 吉凶判定
    level: FortuneLevel;
    score: number;
    description: string;
  };
  timing: {                           // 时间分析
    favorable: string[];
    unfavorable: string[];
    optimal?: string;
  };
  signals: SignalOutput[];             // 信号列表
  appliedRules: RuleOutput[];          // 应用规则
  knowledgeReferences: any[];          // 知识引用
  calculationTrace: TraceStep[];       // 计算轨迹
  actionableSuggestions: string[];     // 行动建议
}
```

## 扩展性

### 注册自定义处理器

```typescript
pipeline.registerProcessor('interpretation', customProcessor);
```

### 自定义阶段配置

```typescript
pipeline.updateConfig({
  stages: [
    { name: 'chrono', enabled: true, timeout: 5000 },
    { name: 'rule', enabled: true, retries: 3 }
  ]
});
```

## 性能

- 流水线支持并发执行
- 缓存历史计算结果
- 阶段超时自动处理
- 完整的性能监控

## 下一步

- 完善测试系统
- 添加更多术数引擎支持
- 优化性能
- 添加监控和日志

---

*Phase 6 - Pipeline 整合核心 - 2026年5月*
