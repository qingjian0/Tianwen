# 天问前端视觉重设计 Spec

## Why
当前前端仅具备最小可用原型：dark 背景 + amber 文字 + 星空粒子，缺乏与「华夏术数推演操作系统」匹配的文化辨识度与视觉丰富度。四个核心页面（天问殿、命宫、推演、排盘）仅是功能骨架，需要建立完整设计语言，打造令人难忘的东方玄学美学体验。

## What Changes
- 建立「天问」设计系统（色彩、字体、阴影、动效 token）
- 创建共享 UI 组件库（Button, Card, Badge, Input, Skeleton, Toast, Modal）
- 重新设计全局布局（Sidebar, Header）——融入东方文化元素
- 重新设计 CosmicBackground —— 替代泛泛星空为中国星宿/水墨意境
- 重设计四个核心页面：天问殿首页、命宫、推演、排盘
- 添加页面过渡动画、数据加载骨架屏、空状态/错误状态
- 改进数据可视化呈现（卦象、四柱、十二宫、九宫格等）

## Impact
- Affected specs: 无（首次前端设计规范）
- Affected code: `apps/web/src/app/layout.tsx`, `apps/web/src/app/globals.css`, `apps/web/tailwind.config.ts`, `apps/web/src/components/layout/*`, `apps/web/src/components/ui/*`(新建), `apps/web/src/app/*/page.tsx`
- 不影响后端 API（仅前端视觉层变更）

## ADDED Requirements

### Requirement: 设计系统 Token
系统 SHALL 在 Tailwind 配置和 CSS 变量中定义完整设计 Token，包括：
- 色彩体系：墨色系(背景)、金色系(主强调)、朱砂系(警示/重要)、靛青系(辅助)、玉色系(成功/绿)
- 字体体系：标题用衬线体(Noto Serif SC)，正文用无衬线体(Inter)，数字/数据用等宽体
- 阴影体系：glow-sm, glow-md, glow-lg（金色发光阴影）
- 动效体系：transition 时长与缓动函数统一管理

#### Scenario: 开发新页面时引用设计 Token
- **WHEN** 开发者创建新页面组件
- **THEN** 应使用 tailwind.config.ts 中定义的 cosmic-* 色彩类和 font-serif/font-mono 字体类
- **AND** 不应使用硬编码的十六进制色值

### Requirement: 共享 UI 组件库
系统 SHALL 在 `@/components/ui/` 下提供一套共享 UI 组件，所有页面复用。

#### Scenario: Button 组件
- **WHEN** 页面需要可点击操作按钮
- **THEN** 使用 `<Button variant="primary|secondary|ghost" size="sm|md|lg">` 组件
- **AND** 按钮具有 hover 发光、active 缩放、disabled 置灰等交互状态

#### Scenario: Card 组件  
- **WHEN** 页面需要信息容器卡片
- **THEN** 使用 `<Card variant="default|highlight|subtle">` 组件
- **AND** Card 具有半透明背景、细边框、可选的金色高亮边框

#### Scenario: Badge 组件
- **WHEN** 需要展示标签/标记
- **THEN** 使用 `<Badge variant="gold|vermillion|jade|indigo">` 组件

#### Scenario: Skeleton 组件
- **WHEN** 数据加载中
- **THEN** 显示 Skeleton 骨架屏（脉冲动画），替代当前单一旋转 spinner

#### Scenario: Toast 组件
- **WHEN** 操作结果需要轻量反馈
- **THEN** 页面右上角弹出 Toast 通知，3 秒后自动消失

### Requirement: 重设计全局布局
系统 SHALL 重新设计 Sidebar、Header 和 CosmicBackground，建立统一的东方玄学美学基调。

#### Scenario: Sidebar 侧边栏
- **WHEN** 用户浏览任意页面
- **THEN** 侧边栏显示品牌标识「天问」及导航菜单
- **AND** 每个导航项带中文图标（八卦符号或干支字符）
- **AND** 当前激活项有金色发光边框 + 背景高亮
- **AND** 底部显示当前节气或干支信息（调用 chrono-engine）

#### Scenario: Header 顶栏
- **WHEN** 用户浏览任意页面
- **THEN** 顶栏显示当前页面标题（面包屑风格）
- **AND** 右侧显示当前时间干支信息

#### Scenario: CosmicBackground 背景
- **WHEN** 页面渲染
- **THEN** 背景显示水墨山水渐变（非粒子星空）
- **AND** 包含缓慢漂移的星宿连线图案（二十八宿简化版）
- **AND** 光晕为靛青→金渐变，替代纯 amber

### Requirement: 重设计天问殿首页
系统 SHALL 将首页从占位页面改造为引人入胜的着陆页。

#### Scenario: 首页 Hero
- **WHEN** 用户访问根路径 /
- **THEN** 显示大型「天问」标题（书法风格，金色渐变）
- **AND** 副标题「AI 华夏术数推演操作系统」
- **AND** 五个术数系统卡片（梅花、六爻、八字、奇门、紫微）呈环绕/网格排列
- **AND** 每个卡片有 hover 悬浮 + 发光效果，点击跳转对应页面
- **AND** 底部显示实时干支时钟

### Requirement: 重设计推演页
系统 SHALL 在现有功能基础上提升推演页的视觉表现力。

#### Scenario: 推演输入区
- **WHEN** 用户进入 /prediction
- **THEN** 输入区使用统一的 Card + Input 组件
- **AND** 术数选择使用图标化按钮（替换纯文字复选框）
- **AND** 模式选择和时间范围选择使用分段控制器样式

#### Scenario: 推演结果区
- **WHEN** 推演完成返回结果
- **THEN** 结果以动画 staggered reveal 方式逐个展开
- **AND** 每个术数结果使用独立 Card 展示，包含该术数的特色可视化（卦象符号、四柱排列等）
- **AND** 综合论断区域使用醒目的双栏大数字展示

### Requirement: 重设计排盘页
系统 SHALL 增强四种排盘类型的可视化呈现。

#### Scenario: 梅花卦排盘
- **WHEN** 选择梅花卦排盘
- **THEN** 本卦、互卦、变卦以三列大卡片展示，每卡包含完整八卦符号（☰☱☲☳☴☵☶☷）、卦名、五行属性
- **AND** 动爻以金色闪烁标记

#### Scenario: 六爻排盘
- **WHEN** 选择六爻排盘
- **THEN** 六爻以纵向排列展示，每爻包含阴阳爻符号、六亲、五行、世应标记
- **AND** 动爻以朱砂色高亮标记
- **AND** 月建和旬空信息显示在底部信息栏

#### Scenario: 奇门排盘
- **WHEN** 选择奇门排盘
- **THEN** 九宫以 3×3 网格展示，中宫居中
- **AND** 每宫显示八门、八神、九星，以不同颜色区分
- **AND** 值符、值使在底部独立显示

#### Scenario: 八字排盘
- **WHEN** 选择八字排盘
- **THEN** 四柱以纵向大卡片展示，每柱分天干（大字金色）地支（小字灰色）
- **AND** 日柱以特殊高亮标识

### Requirement: 重设计命宫页
系统 SHALL 增强命宫页的数据可视化呈现。

#### Scenario: 八字命盘区
- **WHEN** 加载八字数据完成
- **THEN** 四柱以水平排列展示，天干地支分两行
- **AND** 日主五行以 Badge 显示
- **AND** 五行强弱以进度条可视化展示

#### Scenario: 紫微十二宫区
- **WHEN** 加载紫微数据完成
- **THEN** 十二宫以 4×3 网格展示
- **AND** 每宫内有主星（金色Badge）、辅星（灰色Badge）
- **AND** 命宫以金色边框高亮

#### Scenario: 运势总览区
- **WHEN** 数据加载完成
- **THEN** 事业/财运/感情/健康四维以径向进度环或条形图展示
- **AND** 数值动画从 0 过渡到目标值

### Requirement: 页面过渡动画
系统 SHALL 在路由切换时提供平滑过渡动画。

#### Scenario: 页面进入动画
- **WHEN** 用户导航到新页面
- **THEN** 页面内容以 fade-in + slide-up (30px) 方式进入
- **AND** 子元素以 staggered (50ms 间隔) 方式逐个出现

### Requirement: 响应式适配
系统 SHALL 在移动端提供良好的浏览体验。

#### Scenario: 移动端布局
- **WHEN** 视口宽度 < 768px
- **THEN** 侧边栏变为可滑出的抽屉式导航
- **AND** 卡片网格从多列变为单列
- **AND** 字体大小适当缩小
- **AND** 触控目标不小于 44px