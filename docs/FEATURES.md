# 天问系统 - 完整功能清单文档

## 1. 项目状态概述

### 1.1 项目简介
**天问 (Tianwen)** 是一个大型 AI 华夏术数推演操作系统，融合时间、命运、概率、AI 与知识图谱，构建数字天机文明系统。

### 1.2 核心定位
- 不是简单的 AI 算命网站
- 而是「东方时空认知操作系统」
- 融合传统文化、现代计算、人工智能
- 提供完整的术数推演、规则推理、概率分析、知识整合体系

### 1.3 技术架构
- **Monorepo 结构**: Turborepo + pnpm workspace
- **前端**: Next.js + React + TypeScript + TailwindCSS + Framer Motion
- **后端**: Node.js + TypeScript
- **核心引擎**: 模块化设计，各引擎独立封装

---

## 2. 梅花易数 (Meihua Yishu) 完整功能说明

### 2.1 核心引擎
- **引擎类**: `MeihuaEngine`
- **文件位置**: `/packages/meihua/src/meihua.ts`
- **前端页面**: `/apps/web/src/app/meihua/page.tsx`

### 2.2 起卦方法
| 方法 | 说明 |
|------|------|
| **时间起卦** | 根据年月日时数起卦，支持公历/农历转换 |
| **单数字起卦** | 单个数字，拆分为上下卦 |
| **双数字起卦** | 两个数字，定上下卦与动爻 |
| **三数字起卦** | 三个数字，上卦下卦动爻 |
| **随机起卦** | 至诚之道，感而遂通 |
| **铜钱起卦** | 六次铜钱结果起卦 |
| **手动起卦** | 手动选择上下卦和动爻 |

### 2.3 配置选项
- **加时辰开关**: 是否在计算时加入时辰
- **真太阳时**: 支持经纬度计算真太阳时
- **干支选择**: 可直接选择年/月/日/时干支起卦
- **公历/农历切换**: 支持两种日历输入

### 2.4 卦象计算
- **本卦** (Ben Gua): 初始卦象
- **互卦** (Hu Gua): 由本卦二至五爻组成
- **变卦** (Bian Gua): 动爻变化后的卦象
- **错卦** (Cuo Gua): 各爻阴阳相反
- **综卦** (Zong Gua): 卦象倒置

### 2.5 体用关系
- **体卦**: 代表自身
- **用卦**: 代表所占之事
- **五行生克关系**: 体用五行的生克比合关系

### 2.6 前端界面
- Hero 区域介绍
- 起卦方法选择卡片
- 配置选项设置
- 输入表单（时间/数字/手动选择八卦）
- 结果展示区
  - 本卦/互卦/变卦动画展示
  - 上下卦信息（名称、五行）
  - 动爻高亮
  - 卦辞解读

---

## 3. 奇门遁甲 (Qimen Dunjia) 完整功能说明

### 3.1 核心引擎
- **引擎类**: `QimenEngine`
- **文件位置**: `/packages/qimen/src/qimen.ts`
- **前端页面**: `/apps/web/src/app/qimen/page.tsx`

### 3.2 排盘方式
| 方式 | 说明 |
|------|------|
| **拆补法** | Chaibu - 拆补置闰法 |
| **置闰法** | Zhirun - 超神接气法 |
| **茅山法** | Maoshan - 茅山道派方法 |

### 3.3 盘局类型
- **转盘奇门**: 天盘转动
- **飞盘奇门**: 星门飞布

### 3.4 值使起法
- **值使门起**: 门宫对应
- **门起地盘**: 地盘落宫

### 3.5 核心要素
- **九星**: 天蓬、天芮、天冲、天辅、天禽、天心、天柱、天任、天英
- **八门**: 休门、生门、伤门、杜门、景门、死门、惊门、开门
- **九宫**: 洛书布局
- **天干地支**: 地盘、天盘、人盘
- **八神/八诈**: 值符、螣蛇、太阴、六合、白虎、玄武、九地、九天
- **旬空**: 计算空亡
- **格局**: 识别特殊格局（如值符得地、值使得地、三奇得使等）

### 3.6 配置选项
- **真太阳时**: 支持经纬度
- **公历/农历**: 日期输入方式
- **年份/月份/日期/时辰**: 精确输入

### 3.7 前端界面
- Hero 区域介绍
- 功能特性卡片
- 排盘设置表单
  - 日历类型
  - 日期时间
  - 盘式选择
  - 盘局类型
  - 值使起法
  - 真太阳时配置
- 九宫排盘展示
- 九星八门分布列表
- 简要解读

---

## 4. 大六壬 (Da Liu Ren) 完整功能说明

### 4.1 核心引擎
- **引擎类**: `LiuRenEngine`
- **文件位置**: `/packages/liuren/src/engine.ts`
- **前端页面**: 预留（结构已就绪）

### 4.2 起课方式
- **月将起法**: 根据月将起课
- **时将起法**: 根据时将起课

### 4.3 配置选项
| 选项 | 说明 |
|------|------|
| **将法** | 月将 / 时将 |
| **课法** | 天盘 / 地盘 |
| **涉害法** | 孟仲季 / 深浅 |
| **昼夜** | 昼 / 夜 |

### 4.4 核心要素
- **四课**: 天干、地支
- **三传**: 初传、中传、末传
- **天盘**: 月将、位置、神煞
- **地盘**: 十二地支
- **遁干**: 天干隐藏
- **天将**: 十二天将
- **六亲**: 父母、兄弟、妻财、官鬼、子孙

### 4.5 分析功能
- **课体**: 发用、中传、末传分析
- **用神**: 确定用神
- **吉凶**: 判定吉凶
- **详细分析**: 完整解读

---

## 5. 其他术数系统状态

### 5.1 八字命理 (BaZi)
- **引擎包**: `/packages/bazi-engine/`
- **前端页面**: `/apps/web/src/app/bazi/page.tsx`
- **状态**: ✅ 结构完整，核心引擎已实现
- **功能**:
  - 命盘分析（日主强弱、五行平衡、格局高低）
  - 大运流年
  - 十神解读
- **组件**: `BaziPanel`

### 5.2 紫微斗数 (Ziwei)
- **引擎包**: `/packages/ziwei/`
- **状态**: ✅ 结构预留
- **计划**: 完整排盘、星曜分析、格局判定

### 5.3 六爻纳甲 (LiuYao)
- **引擎包**: `/packages/liuyao/`
- **引擎类**: `LiuYaoEngine`
- **状态**: ✅ 结构完整
- **功能**:
  - 铜钱起卦
  - 纳甲排盘
  - 六亲六神
  - 动变分析

### 5.4 小成图 (XiaoChengTu)
- **引擎包**: `/packages/xiaochengtu/`
- **引擎类**: `XiaoChengTuEngine`
- **状态**: ✅ 结构预留
- **功能**: 数字起卦、九宫排布

### 5.5 皇极经世 (HuangLi / HuangJi)
- **皇极经世**: `/packages/huangli/` - 时间系统
- **皇极数**: `/packages/huangji/` - 数术推演
- **状态**: ✅ 结构预留

### 5.6 黄历 (HuangLi)
- **引擎包**: `/packages/huangli/`
- **引擎类**: `HuangLiEngine`
- **状态**: ✅ 结构预留
- **功能**: 宜忌查询、择吉

### 5.7 测鬼 (CeGui)
- **引擎包**: `/packages/cegui/`
- **引擎类**: `CeGuiEngine`
- **状态**: ✅ 结构预留

---

## 6. Pipeline 系统功能

### 6.1 核心架构
- **主类**: `TianwenPipeline`
- **文件位置**: `/packages/pipeline/src/pipeline.ts`
- **类型定义**: `/packages/pipeline/src/types.ts`
- **阶段处理器**: `/packages/pipeline/src/stages.ts`

### 6.2 推演模式
| 模式 | 说明 |
|------|------|
| **single** | 单一术数系统推演 |
| **fusion** | 多术数系统融合 |
| **compare** | 多系统对比分析 |
| **timeline** | 时间轴预测 |

### 6.3 管道阶段 (Pipeline Stages)

#### Stage 1: Input (输入)
- 接收用户问题、类别、选择的系统
- 出生信息、事件时间、地理位置
- 随机数来源配置

#### Stage 2: Random (随机数)
- **模式**: manual / auto / timestamp / digital
- **处理器**: `RandomProcessor`
- 支持手动输入、自动生成、时间戳、数字分段

#### Stage 3: Chrono (时间计算)
- **处理器**: `ChronoProcessor`
- 调用 `ChronoEngine` 计算时空信息
- 干支、节气、真太阳时

#### Stage 4: Divination (起卦排盘)
- **处理器**: `DivinationProcessor`
- 调用各术数引擎
- 支持多系统并行排盘

#### Stage 5: Signal (信号提取)
- **处理器**: `SignalProcessor`
- 调用 `SignalExtractor`
- 从排盘结果提取信号
- 信号极性、强度、来源

#### Stage 6: Rule (规则匹配)
- **处理器**: `RuleProcessor`
- 调用 `RuleEngine`
- 规则加载、匹配、冲突解决
- 支持 `knowledge/rules/` 规则库

#### Stage 7: Conflict (冲突解决) [可选]
- 冲突检测与解决
- 策略: Priority / SourceWeight / Confidence / Consensus / UserOverride

#### Stage 8: Probability (概率映射)
- **处理器**: `ProbabilityProcessor`
- 调用 `ProbabilityMapper`
- 成功概率、失败概率、置信度

#### Stage 9: Fortune (吉凶判定)
- **处理器**: `FortuneProcessor`
- 调用 `FortuneCalculator`
- 吉凶等级、分数、描述

#### Stage 10: Timing (时间分析) [可选]
- 有利时间、不利时间、最佳时间

#### Stage 11: Interpretation (解释生成)
- **处理器**: `InterpretationProcessor`
- 调用 `RuleBasedInterpreter`
- 生成解读、建议、知识引用

#### Stage 12: Output (输出)
- 综合结果整合
- 可追溯的计算轨迹

### 6.4 配置选项
- `enableCache`: 启用缓存
- `enableConflictResolution`: 启用冲突解决
- `enableMultiSystemFusion`: 启用多系统融合
- `maxExecutionTimeMs`: 最大执行时间
- 各阶段独立配置（启用/禁用、超时、重试、错误处理）

### 6.5 上下文管理
- `PipelineContextManager`: 管理执行上下文
- `PipelineContext`: 包含输入、各阶段结果、信号、概率、运势、解读
- 阶段结果追踪、时间戳、元数据

### 6.6 健康检查
- `healthCheck()`: 检查各阶段处理器状态
- 健康状态报告

---

## 7. ChronoEngine 功能

### 7.1 核心引擎
- **引擎类**: `ChronoEngine`
- **文件位置**: `/packages/chrono-engine/src/chronoEngine.ts`
- **地位**: ⭐ 整个系统的时空基础核心

### 7.2 核心功能

#### 7.2.1 日历转换
- **公历 → 农历**: 准确的阴阳历转换
- 支持闰月计算

#### 7.2.2 干支计算
- **年干支**: 根据年份计算
- **月干支**: 年上起月
- **日干支**: 日干支推算
- **时干支**: 日上起时
- 完整的四柱八字

#### 7.2.3 节气计算
- 24 节气
- 节气交节时间
- 用于奇门遁甲定局

#### 7.2.4 真太阳时
- **经纬度输入**: longitude, latitude
- **时区调整**: 东经 120° 为基准
- **均时差**: 真太阳时与平太阳时差异
- **公式**:
  ```
  真太阳时 = 平太阳时 + 时区差 + 均时差
  ```

#### 7.2.5 时辰系统
- 十二时辰
- 时辰对应北京时间范围
- 时辰干支

#### 7.2.6 特殊信息
- **太岁**: 年支
- **月建**: 月支
- **旬空**: 日柱旬空
- **九星**: 值星计算

### 7.3 API 接口
```typescript
// 构造函数
new ChronoEngine(date?, coordinates?, useTrueSun?)

// 计算完整时空信息
calculate(): ChronoData

// 静态方法 - 当前时间
ChronoEngine.now(coordinates?, useTrueSun?): ChronoData

// 静态方法 - 指定时间
ChronoEngine.at(date, coordinates?, useTrueSun?): ChronoData

// 设置配置
setDate(date)
setUseTrueSun(use)
setCoordinates(coordinates)
```

### 7.4 ChronoData 输出结构
```typescript
{
  gregorian: { year, month, day, hour, minute, second, timestamp },
  lunar: { year, month, day, isLeapMonth, yearGanZhi, monthGanZhi, 
           dayGanZhi, hourGanZhi, zodiac, lunarMonthName, lunarDayName },
  jieqi: string,
  ganzhi: { year, month, day, hour },
  shichen: { dizhi, name },
  special: { taisui, yuejian, xunkong, jiuxing },
  coordinates?: { longitude, latitude },
  useTrueSun: boolean,
  trueSunTime?: Date
}
```

---

## 8. 规则引擎系统

### 8.1 Rule DSL (规则定义语言)
- **位置**: `/packages/rule-dsl/`
- **文件**: `lexer.ts`, `parser.ts`, `interpreter.ts`

#### 8.1.1 DSL 语法
```
rule 规则名称 {
  description: "描述",
  category: "类别",
  priority: "critical" | "high" | "medium" | "low",
  
  if 条件1,
  if 条件2,
  
  then 效果1,
  then 效果2
}
```

#### 8.1.2 示例
```
rule dayMasterStrong {
  description: "日主得地，富贵可期",
  category: "bazi",
  priority: "critical",
  
  if dayMasterStrength == "strong",
  if wuxingSheng(dayMasterWuxing, yearGanWuxing),
  
  then fortune += 15
}
```

### 8.2 规则引擎核心
- **位置**: `/packages/rule-engine-core/`
- **功能**:
  - 规则评估 (`RuleEvaluator`)
  - 规则构建 (`RuleBuilder`)
  - 冲突解决 (`ConflictResolver`)

### 8.3 规则编译器
- **位置**: `/packages/rule-compiler/`
- **功能**: DSL → 可执行规则

### 8.4 规则知识图谱
- **位置**: `/packages/rule-knowledge-graph/`
- **功能**: 规则关系管理、知识图谱构建

### 8.5 知识规则库
- **位置**: `/knowledge/rules/`
- 示例规则已实现

---

## 9. 其他支撑系统

### 9.1 信号系统 (Signal System)
- **位置**: `/packages/signal-system/`, `/packages/signal-extractor/`
- **功能**:
  - 信号处理
  - 信号验证
  - 信号提取
  - 信号极性 (positive/negative/neutral/unstable)
  - 信号强度 (high/medium/low)

### 9.2 概率引擎 (Probability Engine)
- **位置**: `/packages/probability-engine/`, `/packages/probability-mapping/`
- **功能**:
  - 概率计算
  - 概率分析
  - 概率映射
  - 置信度评估

### 9.3 运势引擎 (Fortune Engine)
- **位置**: `/packages/fortune-engine/`
- **功能**:
  - 运势计算
  - 运势分析
  - 吉凶等级

### 9.4 时序引擎 (Timing Engine)
- **位置**: `/packages/timing-engine/`
- **功能**:
  - 时序计算
  - 时间窗口生成
  - 有利时间分析

### 9.5 解读引擎 (Interpretation Engine)
- **位置**: `/packages/interpretation-engine/`
- **功能**:
  - 解读生成
  - 规则解读
  - 建议生成
  - 知识引用

### 9.6 共振引擎 (Resonance Engine)
- **位置**: `/packages/resonance-engine/`
- **功能**:
  - 共振计算
  - 冲突分析

### 9.7 融合引擎 (Fusion Engine)
- **位置**: `/packages/fusion-engine/`
- **功能**:
  - 多术数结果融合
  - 融合策略

### 9.8 权重系统 (Weight System)
- **位置**: `/packages/weight-system/`
- **功能**:
  - 权重计算
  - 权重验证

### 9.9 认知引擎 (Cognitive Engine)
- **位置**: `/packages/cognitive-engine/`
- **功能**: 高级认知推理

### 9.10 经典古籍 (Classics)
- **位置**: `/packages/classics/`
- **功能**:
  - 古籍内容管理
  - 古籍检索
  - 《周易》内容已集成

### 9.11 校准系统 (Calibration)
- **位置**: `/packages/calibration/`, `/packages/calibration-engine/`
- **功能**:
  - 系统校准
  - 参数调整
  - 预测结果记录
  - 规则置信度调整
  - 历史衰减
  - 自动校准

### 9.12 案例回放 (Case Replay)
- **位置**: `/packages/case-replay/`, `/packages/replay-system/`
- **功能**:
  - 案例回放
  - 历史回测
  - 自动验证
  - 回测报告
  - 准确率计算
  - 快照管理
  - 确定性随机

### 9.13 事件总线 (Event Bus)
- **位置**: `/packages/event-bus/`
- **功能**:
  - 事件发布订阅
  - 优先级监听器
  - 事件历史记录
  - 事件过滤
  - 系统事件管理

### 9.14 执行图 (Execution Graph)
- **位置**: `/packages/execution-graph/`
- **功能**:
  - 执行图管理
  - 管道执行

### 9.15 运行时可观测性 (Runtime Observability)
- **位置**: `/packages/runtime-observability/`
- **功能**:
  - 追踪 (`Tracer`)
  - 指标收集
  - 规则统计

### 9.16 运行时沙箱 (Runtime Sandbox)
- **位置**: `/packages/runtime-sandbox/`
- **功能**: 沙箱运行环境

### 9.17 运行时状态 (Runtime State)
- **位置**: `/packages/runtime-state/`
- **功能**:
  - 执行上下文存储
  - 预测历史
  - 规则缓存
  - 内存适配器

### 9.18 时序记忆 (Temporal Memory)
- **位置**: `/packages/temporal-memory/`
- **功能**:
  - 时序数据记忆
  - 历史管理

### 9.19 Prompt 系统
- **位置**: `/packages/prompts/`, `/packages/prompt-orchestrator/`
- **功能**:
  - Prompt DSL
  - Prompt 模板
  - Prompt 构建
  - Prompt 编排
  - Prompt 生成

### 9.20 UI 组件库
- **位置**: `/packages/ui/`
- **功能**:
  - 东方宇宙风格组件
  - 设计系统
  - 主题管理
  - 组件: Button, Card, Input, GlowText, StarBackground

### 9.21 动画系统
- **位置**: `/packages/animations/`
- **功能**:
  - 宇宙动画
  - 动效预设

### 9.22 术数类型系统
- **位置**: `/packages/metaphysics-types/`
- **功能**:
  - 八卦定义
  - 五行定义
  - 干支定义
  - 九宫定义
  - 节气定义
  - 星曜定义

### 9.23 API 服务
- **位置**: `/packages/api/`
- **功能**:
  - API 服务器
  - 预测服务
  - 规则服务
  - WebSocket 服务

---

## 10. 知识宇宙 (Knowledge Universe)

### 10.1 古籍库
- **位置**: `/knowledge/classics/`
- **计划**:
  - 《周易》
  - 《滴天髓》
  - 《三命通会》
  - 《梅花易数》
  - 《奇门遁甲》
  - 《大六壬》

### 10.2 现代研究
- **位置**: `/knowledge/modern/`
- **计划**: 现代术数研究资料

### 10.3 实战案例
- **位置**: `/knowledge/cases/`
- **计划**: 历史案例、实测案例

### 10.4 规则库
- **位置**: `/knowledge/rules/`
- **状态**: ✅ 结构已就绪，示例规则已实现

---

## 11. 项目进度展示

### 11.1 开发阶段

#### Phase 1 ✅ (已完成)
- ✅ Monorepo 项目初始化
- ✅ ChronoEngine 基础实现
- ✅ 梅花易数核心模块
- ✅ 术数类型系统
- ✅ UI 组件库结构
- ✅ 前端应用骨架
- ✅ 首页（天问殿）UI 实现
- ✅ 六爻 / 奇门 / 八字 / 大六壬 / 紫微 / 小成图 / 皇极 / 黄历 / 测鬼 结构预留

#### Phase 2 (进行中)
- ✅ Pipeline 系统核心实现
- ✅ 信号系统
- ✅ 概率引擎
- ✅ 运势引擎
- ✅ 解读引擎
- ✅ 规则引擎核心
- ✅ Rule DSL
- ✅ 事件总线
- ✅ 案例回放
- ✅ 校准系统
- ⏳ AI Agent 系统
- ⏳ Prompt Engine
- ⏳ 共振引擎
- ⏳ 融合引擎

#### Phase 3 (待开发)
- ⏳ RAG 系统
- ⏳ 知识图谱
- ⏳ 完整规则库

#### Phase 4 (待开发)
- ⏳ 宇宙 UI 系统
- ⏳ 命运时间轴
- ⏳ 高级动画与可视化

### 11.2 各系统完成度

| 系统 | 状态 | 完成度 |
|------|------|--------|
| **ChronoEngine** | ✅ 完成 | 100% |
| **梅花易数** | ✅ 完成 | 100% |
| **奇门遁甲** | ✅ 结构完整 | 90% |
| **大六壬** | ✅ 结构完整 | 80% |
| **八字** | ✅ 结构完整 | 80% |
| **六爻** | ✅ 结构完整 | 80% |
| **Pipeline** | ✅ 核心完成 | 90% |
| **规则引擎** | ✅ 核心完成 | 85% |
| **信号系统** | ✅ 结构完整 | 80% |
| **概率引擎** | ✅ 结构完整 | 80% |
| **运势引擎** | ✅ 结构完整 | 80% |
| **解读引擎** | ✅ 结构完整 | 80% |
| **UI 组件库** | ✅ 基础完成 | 70% |
| **其他术数** | ⏳ 结构预留 | 40% |
| **AI 系统** | ⏳ 待开发 | 10% |
| **知识图谱** | ⏳ 待开发 | 5% |

---

## 12. 核心工作流

### 12.1 完整推演流程
```
用户输入
    ↓
信号处理 (Signal System)
    ↓
时空计算 (ChronoEngine)
    ↓
术数推演 (各引擎)
    ↓
规则推理 (Rule Engine)
    ↓
概率分析 (Probability Engine)
    ↓
共振计算 (Resonance Engine)
    ↓
结果融合 (Fusion Engine)
    ↓
解读生成 (Interpretation Engine)
    ↓
输出展示
```

### 12.2 梅花易数起卦流程
```
用户选择起卦方法
    ↓
输入参数 (时间/数字/手动)
    ↓
MeihuaEngine.divinateByX()
    ↓
ChronoEngine.calculate() → 时空信息
    ↓
起卦计算 → 本/互/变/错/综卦
    ↓
体用关系分析
    ↓
生成解读
    ↓
前端动画展示
```

---

## 13. 文件结构总览

```
tianwen/
├── apps/
│   ├── web/                          # Next.js 前端
│   │   ├── src/app/
│   │   │   ├── meihua/page.tsx       # 梅花易数页面 ✅
│   │   │   ├── qimen/page.tsx        # 奇门遁甲页面 ✅
│   │   │   ├── bazi/page.tsx         # 八字页面 ✅
│   │   │   ├── page.tsx              # 首页 ✅
│   │   │   └── layout.tsx
│   │   └── src/components/
│   └── server/                       # 后端服务
│
├── packages/                         # 核心引擎包
│   ├── chrono-engine/                # ⭐ 时间宇宙引擎 ✅
│   ├── meihua/                       # 梅花易数 ✅
│   ├── liuyao/                       # 六爻纳甲 ✅
│   ├── qimen/                        # 奇门遁甲 ✅
│   ├── bazi-engine/                  # 八字命理 ✅
│   ├── ziwei/                        # 紫微斗数 ✅
│   ├── liuren/                       # 大六壬 ✅
│   ├── xiaochengtu/                  # 小成图 ✅
│   ├── huangli/                      # 皇极经世 ✅
│   ├── huangji/                      # 皇极数 ✅
│   ├── cegui/                        # 测鬼 ✅
│   ├── pipeline/                     # 推演管道 ✅
│   ├── signal-system/                # 信号系统 ✅
│   ├── signal-extractor/             # 信号提取 ✅
│   ├── rule-engine-core/             # 规则引擎核心 ✅
│   ├── rule-dsl/                     # 规则 DSL ✅
│   ├── rule-compiler/                # 规则编译器 ✅
│   ├── rule-knowledge-graph/         # 规则知识图谱 ✅
│   ├── probability-engine/           # 概率引擎 ✅
│   ├── probability-mapping/          # 概率映射 ✅
│   ├── fortune-engine/               # 运势引擎 ✅
│   ├── timing-engine/                # 时序引擎 ✅
│   ├── interpretation-engine/        # 解读引擎 ✅
│   ├── resonance-engine/             # 共振引擎 ✅
│   ├── fusion-engine/                # 融合引擎 ✅
│   ├── weight-system/                # 权重系统 ✅
│   ├── cognitive-engine/             # 认知引擎 ✅
│   ├── classics/                     # 经典古籍 ✅
│   ├── calibration/                  # 校准系统 ✅
│   ├── calibration-engine/           # 校准引擎 ✅
│   ├── manual-divination/            # 手动起卦 ✅
│   ├── case-replay/                  # 案例回放 ✅
│   ├── replay-system/                # 回放系统 ✅
│   ├── execution-graph/              # 执行图 ✅
│   ├── runtime-observability/        # 运行时可观测 ✅
│   ├── runtime-sandbox/              # 运行时沙箱 ✅
│   ├── runtime-state/                # 运行时状态 ✅
│   ├── temporal-memory/              # 时序记忆 ✅
│   ├── event-bus/                    # 事件总线 ✅
│   ├── prompts/                      # Prompt 引擎 ✅
│   ├── prompt-orchestrator/          # Prompt 编排 ✅
│   ├── ui/                           # UI 组件库 ✅
│   ├── animations/                   # 动画系统 ✅
│   ├── metaphysics-types/            # 术数类型 ✅
│   ├── api/                          # API 服务 ✅
│   └── shared/                       # 共享工具 ✅
│
├── knowledge/                        # 知识宇宙
│   ├── classics/                     # 古籍
│   ├── modern/                       # 现代研究
│   ├── cases/                        # 实战案例
│   └── rules/                        # 规则库 ✅
│
├── docs/                             # 文档
│   ├── ARCHITECTURE.md               # 架构文档 ✅
│   ├── PHASE_5_SUMMARY.md            # 阶段总结 ✅
│   ├── PHASE_6_PIPELINE.md           # Pipeline 文档 ✅
│   ├── PHASE_8_SUMMARY.md            # 阶段总结 ✅
│   └── FEATURES.md                   # 本文件 ✅
│
└── README.md                         # 项目说明 ✅
```

---

## 14. 总结

天问系统是一个**分层设计、模块化架构**的复杂系统，从底层的时空计算到上层的 AI 解读，形成了完整的东方术数推演链条。

### 14.1 核心特点
1. **ChronoEngine 为核心** - 所有术数推演的时空基础
2. **多术数引擎并行** - 梅花、六爻、奇门、八字、紫微、大六壬、小成图、皇极等多方法支持
3. **Pipeline 串联处理** - 信号 → 规则 → 概率 → 共振 → 融合 → 解读
4. **规则+知识双驱动** - 规则引擎 + 知识图谱
5. **东方宇宙风格** - 独特的 UI 设计语言

### 14.2 当前状态
- ✅ **Phase 1 已完成**: 核心基础设施、主要术数引擎
- ✅ **Phase 2 进行中**: Pipeline、规则、概率、解读等系统
- ⏳ **Phase 3 待开发**: RAG、知识图谱
- ⏳ **Phase 4 待开发**: 完整 UI、高级可视化

### 14.3 愿景
构建一个集传统文化、现代计算、人工智能于一体的创新系统，成为东方时空认知的基础设施。

---

**文档版本**: 1.0
**最后更新**: 2026-05-23
**维护者**: 天问系统团队
