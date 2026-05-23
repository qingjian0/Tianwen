
# 天问 (Tianwen) 系统完整架构梳理与天府风格优化 - Product Requirement Document

## Overview
- **Summary**: 基于已完成的术数功能（梅花易数、奇门遁甲、大六壬），全面梳理项目架构，整理完整功能清单，继续优化用户界面体验，打造更优美的天府Agent风格系统
- **Purpose**: 建立清晰的架构认知，完善功能文档，提升用户体验，确保项目可维护性和可扩展性
- **Target Users**: 术数爱好者、开发者、系统管理员

## Goals
- 完整梳理项目Monorepo架构和模块依赖关系
- 整理所有术数系统的功能清单和使用说明
- 优化用户界面，打造更优美的天府Agent风格
- 完善后端API服务和前后端交互
- 建立完整的项目文档体系

## Non-Goals (Out of Scope)
- 不重新实现已完善的术数核心算法
- 不改变现有的项目技术栈框架
- 不进行大规模的性能重构
- 不引入新的AI系统（除非明确需求）

## Background &amp; Context
天问系统已完成：
- **前端**: Next.js 15 + React 19 + TypeScript + TailwindCSS + Framer Motion
- **已完成功能**: 
  - 梅花易数：手动起卦、时间起卦、数字起卦、真太阳时、干支选择
  - 奇门遁甲：拆补法/置闰法/茅山法、转盘/飞盘、值使选择
  - 大六壬：月将/时将、起课方式、涉害方法、昼夜选择
  - 八字/紫微：基础结构
- **引擎系统**: ChronoEngine、Meihua、Qimen、Liuren、Pipeline等
- **知识系统**: 古籍库、案例库、规则引擎

## Functional Requirements
- **FR-1**: 完整的项目架构梳理和文档
- **FR-2**: 所有术数系统功能清单整理
- **FR-3**: 天府Agent风格UI优化（更简洁、优雅）
- **FR-4**: 后端API服务完善和文档
- **FR-5**: 功能展示和用户体验优化
- **FR-6**: 项目状态和开发路线图整理

## Non-Functional Requirements
- **NFR-1**: 界面设计遵循天府Agent风格（极简、大量留白、金色点缀）
- **NFR-2**: 所有页面加载速度 &lt; 2s
- **NFR-3**: 完整的TypeScript类型定义
- **NFR-4**: 响应式设计，支持移动端
- **NFR-5**: 代码结构清晰，易于维护

## Constraints
- **Technical**: 
  - 保持现有Monorepo结构
  - 使用Next.js、React、TypeScript、TailwindCSS
  - 兼容Node.js 24+
- **Business**: 
  - 保持现有功能完整性
  - 优化而非重构
- **Dependencies**: 
  - 所有术数引擎包
  - ChronoEngine时间引擎
  - Pipeline系统

## Assumptions
- 现有术数引擎的核心算法是正确的
- 用户希望更优美、更易用的界面体验
- 有完善天府Agent风格的参考

## Acceptance Criteria

### AC-1: 项目架构文档完整
- **Given**: 项目当前完整代码结构
- **When**: 完成架构梳理
- **Then**: 生成详细的架构文档，包括模块关系、技术栈、开发指南
- **Verification**: `human-judgment`
- **Notes**: 包含架构图、依赖关系图、数据流图

### AC-2: 功能清单完整可查
- **Given**: 所有已实现的术数功能
- **When**: 整理功能清单
- **Then**: 每个功能都有详细说明、使用方式、输入输出
- **Verification**: `human-judgment`

### AC-3: 天府风格UI优化完成
- **Given**: 现有用户界面
- **When**: 完成UI优化
- **Then**: 界面更简洁、优雅、有大量留白、金色点缀、响应式
- **Verification**: `human-judgment`

### AC-4: 后端API服务完善
- **Given**: 现有server.ts和API设计
- **When**: 完善后端服务
- **Then**: API服务可正常运行，文档完整
- **Verification**: `programmatic`

### AC-5: 项目状态清晰
- **Given**: 项目当前进度
- **When**: 整理项目状态
- **Then**: 有清晰的项目进度展示和开发路线图
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要用户登录和数据持久化？
- [ ] 是否需要历史记录功能？
- [ ] 是否需要更多的术数系统实现？
- [ ] 是否需要数据可视化图表？

