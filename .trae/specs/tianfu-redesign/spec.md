# 天问系统天府风格重设计规格文档

## Why

当前天问系统页面只有主页能显示，其他页面都是404。需要按照天府Agent的页面样式和风格，完全重构所有页面，采用极简现代设计 + 大量留白 + 金色点缀的风格，并实现所有术数页面（梅花易数、大六壬、奇门遁甲、八字排盘、紫微斗数）。

## What Changes

- **BREAKING** 完全重构页面架构，从三栏布局改为天府风格单栏宽幅设计
- 简化背景系统，采用极简配色和大量留白
- 统一五个术数页面的结构（Hero + 功能卡片 + 操作表单 + 结果展示）
- 优化组件系统，保持金色点缀但去掉过度发光
- 实现所有缺失的路由和页面

## Impact

- Affected specs: frontend-redesign-v2（已废弃，替换为当前方案）
- Affected code:
  - `/workspace/apps/web/src/app/globals.css` - 配色和布局完全重写
  - `/workspace/apps/web/src/app/page.tsx` - 主页重构
  - `/workspace/apps/web/src/app/layout.tsx` - 布局更新
  - `/workspace/apps/web/src/components/` - 所有组件调整
  - `/workspace/apps/web/src/app/meihua/` - 页面重构
  - `/workspace/apps/web/src/app/liuren/` - 新增页面
  - `/workspace/apps/web/src/app/qimen/` - 新增页面
  - `/workspace/apps/web/src/app/bazi/` - 新增页面
  - `/workspace/apps/web/src/app/ziwei/` - 新增页面

## ADDED Requirements

### Requirement: 天府风格视觉系统

The system SHALL provide a cohesive visual design following Tianfu Agent style:

- 极简现代设计，大量留白
- 帝王金配色渐变，作为点缀色
- 深蓝/墨黑深色背景
- 清晰的信息层级（h1 → h2 → body → caption）
- 优雅的微交互动画

#### Scenario: Success case

- **WHEN** 用户访问任何页面
- **THEN** 页面风格统一，布局清晰，视觉舒适

### Requirement: 完整页面架构

The system SHALL provide five complete divination pages:

- 主页 (/)
- 梅花易数 (/meihua)
- 大六壬 (/liuren)
- 奇门遁甲 (/qimen)
- 八字排盘 (/bazi)
- 紫微斗数 (/ziwei)

每个页面都有统一的结构：

1. Hero区域（标题 + 介绍 + CTA按钮）
2. 功能卡片网格（核心功能模块）
3. 操作表单区域（起卦/排盘参数）
4. 结果展示区域（可视化 + 解读）

#### Scenario: Success case

- **WHEN** 用户点击导航进入任意术数页面
- **THEN** 页面完整加载，包含所有必要功能区域

### Requirement: 导航系统

The system SHALL provide a clear navigation system:

- 顶部导航栏，包含Logo、术数菜单、设置
- 各页面间可以快速跳转
- 移动端响应式菜单

#### Scenario: Success case

- **WHEN** 用户点击导航菜单
- **THEN** 可以快速在不同术数页面间跳转

## MODIFIED Requirements

### Requirement: 组件系统升级

The system component library shall be adjusted to Tianfu style:

- Card组件：简化边框，增加留白
- Button组件：金色渐变，优雅悬停
- Input组件：简约设计，聚焦状态清晰
- 去掉过度发光效果，保持克制

### Requirement: 背景系统简化

The background system shall be simplified to Tianfu style:

- 保留基础的深空渐变
- 去掉复杂的星宿连线和旋转效果
- 保持少量星星闪烁作为点缀

## REMOVED Requirements

### Requirement: 旧版三栏布局

**Reason**: 用户明确要求完全重构，采用天府风格
**Migration**: 所有页面改为单栏宽幅设计，相关组件调整

### Requirement: 过度发光效果

**Reason**: 天府风格强调克制和留白
**Migration**: 保留金色点缀，但去掉复杂的发光动画
