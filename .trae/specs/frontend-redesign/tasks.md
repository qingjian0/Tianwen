# 天问前端视觉重设计 任务列表

## Phase 1: 设计系统基础

- [x] Task 1: 扩展 Tailwind 设计 Token
  - [x] 1.1 扩展 tailwind.config.ts：添加五行色彩体系（墨色4级、金色4级、朱砂4级、靛青4级、玉色4级）
  - [x] 1.2 添加 glow 阴影系列（glow-sm, glow-md, glow-lg）
  - [x] 1.3 添加自定义动画（shimmer, fade-slide-up, scale-in, pulse-glow）
  - [x] 1.4 扩展 fontFamily：添加 serif(Noto Serif SC), mono(JetBrains Mono)
  - [x] 1.5 更新 globals.css：CSS 变量体系、水墨纹理背景、滚动条样式、选中色

## Phase 2: 共享 UI 组件库

- [x] Task 2: 创建 Button 组件
  - [x] 2.1 实现 variant (primary/secondary/ghost)，size (sm/md/lg)
  - [x] 2.2 实现交互状态 (hover glow, active scale, disabled, loading)
  - [x] 文件：`src/components/ui/Button.tsx`

- [x] Task 3: 创建 Card 组件
  - [x] 3.1 实现 variant (default/highlight/subtle)
  - [x] 3.2 支持 header/footer/children 插槽
  - [x] 3.3 可选的 hover 悬浮效果
  - [x] 文件：`src/components/ui/Card.tsx`

- [x] Task 4: 创建 Badge, Skeleton, Toast 组件
  - [x] 4.1 Badge：variant (gold/vermillion/jade/indigo/ghost)
  - [x] 4.2 Skeleton：支持 text/circle/rect 变体，脉冲动画
  - [x] 4.3 Toast：右上角弹出，3 秒自动消失，支持 success/error/info
  - [x] 文件：`src/components/ui/Badge.tsx`, `src/components/ui/Skeleton.tsx`, `src/components/ui/Toast.tsx`

- [x] Task 5: 创建 Input 和 Segment 组件
  - [x] 5.1 Input：深色主题文本输入框，支持 icon 前置/后置
  - [x] 5.2 Segment：分段控制器（用于模式选择、时间范围选择）
  - [x] 文件：`src/components/ui/Input.tsx`, `src/components/ui/Segment.tsx`

## Phase 3: 全局布局重设计

- [x] Task 6: 重设计 Sidebar 侧边栏
  - [x] 6.1 品牌区域：「天问」logo + 「TIANWEN OS」副标题（金色渐变）
  - [x] 6.2 导航项：每项配 Unicode 符号图标（☰问/命/占/盘），active 态 golden glow border
  - [x] 6.3 底部信息栏：显示当前日期干支（调用 chrono-engine）
  - [x] 文件：`src/components/layout/Sidebar.tsx`

- [x] Task 7: 重设计 Header 顶栏
  - [x] 7.1 左侧显示当前页面标题（从 pathname 映射）
  - [x] 7.2 右侧显示实时时间（时分秒）+ 月日干支
  - [x] 文件：`src/components/layout/Header.tsx`

- [x] Task 8: 重设计 CosmicBackground 背景
  - [x] 8.1 底层：墨色渐变 + 水墨山水纹理叠加
  - [x] 8.2 中层：二十八宿简化连线图案（SVG 或 CSS），缓慢旋转漂移
  - [x] 8.3 光晕层：靛青→金 radial gradient（替代纯 amber）
  - [x] 文件：`src/components/layout/CosmicBackground.tsx`

## Phase 4: 页面重设计

- [x] Task 9: 重设计首页（天问殿）
  - [x] 9.1 Hero 区：大幅「天问」标题，CSS 金色渐变文字 + glow 阴影
  - [x] 9.2 副标题渐入动画
  - [x] 9.3 五大术数卡片网格（hover 悬浮 + 发光），Link 跳转
  - [x] 9.4 底部干支时钟
  - [x] 文件：`src/app/page.tsx`

- [x] Task 10: 重设计推演页
  - [x] 10.1 使用 Card + Input 替换现有裸 div
  - [x] 10.2 术数选择改为图标化 Segment 按钮组
  - [x] 10.3 模式选择和时间范围使用 Segment 分段控制器
  - [x] 10.4 推演按钮使用 Primary Button 组件
  - [x] 10.5 结果区使用 Skeleton 加载态 + staggered reveal 动画
  - [x] 10.6 综合论断使用双栏大数字 Card
  - [x] 文件：`src/app/prediction/page.tsx`

- [x] Task 11: 重设计排盘页
  - [x] 11.1 排盘类型选择使用 Segment 分段控制器
  - [x] 11.2 梅花卦：三列大 Card（本卦/互卦/变卦），八卦符号 + 五行 + 解读
  - [x] 11.3 六爻：纵向爻列表，阴阳爻符号 + 六亲 + 五行 + 世应标记 + 动爻高亮
  - [x] 11.4 奇门：3×3 九宫格，每宫八门八神九星分色显示
  - [x] 11.5 八字：四列大 Card，天干大字金色 / 地支小字灰色，日柱特殊高亮
  - [x] 文件：`src/app/chart/page.tsx`

- [x] Task 12: 重设计命宫页
  - [x] 12.1 八字四柱区：水平排列，天干/地支分两行，使用 Card + Badge
  - [x] 12.2 五行强弱：横向进度条动画
  - [x] 12.3 紫微十二宫：4×3 网格 Card，主星金 Badge + 辅星灰 Badge，命宫高亮
  - [x] 12.4 运势总览：4 组径向进度环动画
  - [x] 文件：`src/app/destiny-palace/page.tsx`

## Phase 5: 动画与过渡

- [x] Task 13: 添加页面过渡动画
  - [x] 13.1 创建 `PageTransition` wrapper 组件（fade-in + slide-up）
  - [x] 13.2 创建 `StaggerChildren` 组件（子元素 50ms 间隔 staggered reveal）
  - [x] 13.3 在 layout 中集成页面过渡
  - [x] 文件：`src/components/ui/PageTransition.tsx`

## Phase 6: 收尾

- [x] Task 14: 编译验证与修复
  - [x] 14.1 运行 `pnpm dev` 确认无编译错误
  - [x] 14.2 验证所有四个页面（/, /prediction, /chart, /destiny-palace）正常渲染
  - [x] 14.3 验证移动端响应式布局

# Task Dependencies
- Task 2-5 依赖 Task 1（设计 Token）
- Task 6-8 依赖 Task 1
- Task 9-12 依赖 Task 1, Task 2-5（使用 UI 组件）
- Task 13 可与 Task 9-12 并行
- Task 14 依赖所有前置任务