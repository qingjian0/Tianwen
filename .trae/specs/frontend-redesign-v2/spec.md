# 天问系统前端重设计规格文档 v2

## 1. 为什么需要重设计 (Why)

当前天问系统虽然实现了功能性的三栏布局，但缺乏令人难忘的视觉体验和深度的文化内涵。根据天府 AI 的设计风格启示，用户期望看到的是：

**核心问题：**

- 视觉设计过于平淡，缺乏东方玄学的神秘感和权威感
- 动效设计碎片化，缺乏统一的视觉叙事
- 文化元素表达浅显（仅用 emoji 和基础符号）
- 专业感与美感未能兼顾

**机会点：**

- 将天问系统打造成华夏术数领域的标杆产品
- 创造独特的"数字玄学"美学语言
- 通过精致动效传递占卜的神圣感与仪式感

## 2. 设计理念：数字玄学美学

### 2.1 视觉基调

**选择方向：奢华精致 + 东方神秘 + 现代极简**

融合紫禁城皇家气派与现代数字界面，营造"数字神殿"的氛围。

### 2.2 核心理念

```
神圣感：占卜是神圣的行为，界面应传递庄严与敬畏
仪式感：每个操作都是一次与天地对话的仪式
深邃感：如夜空般深邃的背景，承载无限可能
精致感：每一个细节都经过精心打磨
```

### 2.3 差异化亮点

**一个让人记住的设计：动态卦象系统**

当用户进行占卜时，卦盘不是静态展示，而是：

1. 从混沌中浮现（如太极化生）
2. 阴阳爻逐爻显现（如星辰点亮）
3. 动爻特殊标记（如火焰燃烧）
4. 整体卦象缓慢旋转（如天地运行）

## 3. 色彩系统 (Color System)

### 3.1 主色调

```css
/* 帝王金 - 皇家权威 */
--imperial-gold: #d4af37;
--imperial-gold-light: #f4d03f;
--imperial-gold-dark: #b8860b;

/* 朱砂红 - 神圣警示 */
--vermillion: #c41e3a;
--vermillion-light: #e63946;
--vermillion-dark: #8b0000;

/* 天际蓝 - 宇宙深邃 */
--celestial-blue: #1e3a5f;
--celestial-blue-dark: #0a1628;
--celestial-blue-light: #2d5a8a;

/* 墨色 - 文化底蕴 */
--ink-black: #0a0a0f;
--ink-dark: #12121a;
--ink-medium: #1a1a25;
--ink-light: #252530;
```

### 3.2 功能色

```css
/* 五行色彩 */
--wood-green: #228b22;
--fire-red: #dc2626;
--earth-yellow: #ca8a04;
--metal-white: #e5e7eb;
--water-blue: #2563eb;

/* 状态色 */
--success-jade: #22c55e;
--warning-amber: #f59e0b;
--danger-vermillion: #ef4444;
--info-sapphire: #3b82f6;

/* 文字层次 */
--text-primary: #f5f5f5;
--text-secondary: #a0a0b0;
--text-muted: #6b6b7b;
--text-disabled: #4b4b5b;
```

### 3.3 渐变与光效

```css
/* 帝王金渐变 */
background: linear-gradient(135deg, #f4d03f 0%, #d4af37 50%, #b8860b 100%);

/* 宇宙深邃渐变 */
background: radial-gradient(
  ellipse at center,
  #1a1a25 0%,
  #0a0a0f 70%,
  #000000 100%
);

/* 能量光环 */
box-shadow:
  0 0 20px rgba(212, 175, 55, 0.3),
  0 0 40px rgba(212, 175, 55, 0.2),
  0 0 60px rgba(212, 175, 55, 0.1);
```

## 4. 字体系统 (Typography)

### 4.1 字体选择

```css
/* 标题字体 - 书法韵律 */
font-family: "Noto Serif SC", "STSong", "SimSun", serif;
/* 用于：页面标题、卦名、神煞名称 */

/* 正文字体 - 宋体典雅 */
font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
/* 用于：正文内容、说明文字 */

/* 数据字体 - 等宽精确 */
font-family: "JetBrains Mono", "Fira Code", monospace;
/* 用于：数字、时间、干支符号 */

/* 英文辅助 */
font-family: "Inter", system-ui, sans-serif;
/* 用于：系统提示、辅助信息 */
```

### 4.2 字体层次

```css
/* 页面大标题 */
font-size: 3rem; /* 48px */
font-weight: 700;
letter-spacing: 0.1em;
text-shadow: 0 0 30px rgba(212, 175, 55, 0.5);

/* 区块标题 */
font-size: 1.5rem; /* 24px */
font-weight: 600;
letter-spacing: 0.05em;

/* 卡片标题 */
font-size: 1.125rem; /* 18px */
font-weight: 600;

/* 正文内容 */
font-size: 0.875rem; /* 14px */
font-weight: 400;
line-height: 1.75;

/* 辅助说明 */
font-size: 0.75rem; /* 12px */
font-weight: 400;
color: var(--text-muted);
```

## 5. 组件设计规范

### 5.1 卡片组件 (Card)

**设计理念：古典卷轴 + 现代卡片**

```css
/* 默认卡片 */
background: linear-gradient(
  145deg,
  rgba(26, 26, 37, 0.9),
  rgba(18, 18, 26, 0.95)
);
border: 1px solid rgba(212, 175, 55, 0.2);
border-radius: 8px;
box-shadow:
  0 4px 24px rgba(0, 0, 0, 0.4),
  inset 0 1px 0 rgba(255, 255, 255, 0.05);

/* 悬停态 */
transform: translateY(-2px);
border-color: rgba(212, 175, 55, 0.5);
box-shadow:
  0 8px 32px rgba(0, 0, 0, 0.5),
  0 0 20px rgba(212, 175, 55, 0.2),
  inset 0 1px 0 rgba(255, 255, 255, 0.08);

/* 高亮卡片（用于重点展示） */
border-color: rgba(212, 175, 55, 0.6);
box-shadow:
  0 0 30px rgba(212, 175, 55, 0.3),
  inset 0 0 20px rgba(212, 175, 55, 0.05);
```

**结构：**

```
┌─────────────────────────────────┐
│  ╔═══════════════════════════╗  │  ← 金色细边框（顶部）
│  ║        卡片标题           ║  │
│  ╚═══════════════════════════╝  │
│                                 │
│         内容区域                 │
│         (可滚动)                 │
│                                 │
└─────────────────────────────────┘
```

### 5.2 按钮组件 (Button)

**设计理念：皇家印玺 + 触感反馈**

```css
/* 主按钮 - 帝王金 */
background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
color: #0a0a0f;
font-weight: 600;
border: none;
box-shadow:
  0 4px 15px rgba(212, 175, 55, 0.4),
  inset 0 1px 0 rgba(255, 255, 255, 0.3);

transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* 悬停态 */
transform: translateY(-2px) scale(1.02);
box-shadow:
  0 8px 25px rgba(212, 175, 55, 0.5),
  inset 0 1px 0 rgba(255, 255, 255, 0.4);

/* 点击态 */
transform: translateY(0) scale(0.98);
box-shadow:
  0 2px 8px rgba(212, 175, 55, 0.3),
  inset 0 2px 4px rgba(0, 0, 0, 0.2);

/* 次要按钮 - 墨色描边 */
background: transparent;
border: 1px solid rgba(212, 175, 55, 0.5);
color: var(--imperial-gold);

/* 幽灵按钮 */
background: transparent;
border: none;
color: var(--text-secondary);
```

### 5.3 输入框组件 (Input)

**设计理念：青铜铭文 + 精致边框**

```css
/* 默认态 */
background: rgba(26, 26, 37, 0.8);
border: 1px solid rgba(212, 175, 55, 0.3);
border-radius: 6px;
color: var(--text-primary);
font-family: "JetBrains Mono", monospace;

transition: all 0.3s ease;

/* 聚焦态 */
border-color: var(--imperial-gold);
box-shadow:
  0 0 15px rgba(212, 175, 55, 0.2),
  inset 0 0 10px rgba(212, 175, 55, 0.05);

/* 错误态 */
border-color: var(--danger-vermillion);
box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
```

### 5.4 标签组件 (Badge)

**设计理念：官印标记 + 色彩编码**

```css
/* 金色 - 尊贵 */
background: rgba(212, 175, 55, 0.15);
border: 1px solid rgba(212, 175, 55, 0.4);
color: var(--imperial-gold);

/* 朱砂红 - 重要 */
background: rgba(196, 30, 58, 0.15);
border: 1px solid rgba(196, 30, 58, 0.4);
color: var(--vermillion-light);

/* 翡翠绿 - 成功 */
background: rgba(34, 139, 34, 0.15);
border: 1px solid rgba(34, 139, 34, 0.4);
color: var(--success-jade);

/* 天际蓝 - 信息 */
background: rgba(30, 58, 95, 0.15);
border: 1px solid rgba(30, 58, 95, 0.4);
color: var(--info-sapphire);
```

## 6. 动效系统 (Motion Design)

### 6.1 核心理念

**动效不仅是装饰，而是叙事的载体**

- **入场动画**：如星辰显现，层层递进
- **交互反馈**：如水波荡漾，即时响应
- **状态转换**：如阴阳流转，平滑过渡
- **强调动画**：如火焰燃烧，吸引注意

### 6.2 动画时间轴

```css
/* 微交互 */
transition-duration: 150ms;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* 标准过渡 */
transition-duration: 300ms;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* 复杂动画 */
transition-duration: 500ms;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* 强调动画（发光、脉冲） */
animation-duration: 2s;
animation-timing-function: ease-in-out;
animation-iteration-count: infinite;
```

### 6.3 关键动画

#### 6.3.1 星辰显现（Stagger Reveal）

```css
@keyframes starAppear {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

.stagger-item {
  animation: starAppear 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.stagger-item:nth-child(1) {
  animation-delay: 0ms;
}
.stagger-item:nth-child(2) {
  animation-delay: 100ms;
}
.stagger-item:nth-child(3) {
  animation-delay: 200ms;
}
/* ... 依次递增 100ms */
```

#### 6.3.2 金色脉冲（Glow Pulse）

```css
@keyframes glowPulse {
  0%,
  100% {
    box-shadow:
      0 0 10px rgba(212, 175, 55, 0.3),
      0 0 20px rgba(212, 175, 55, 0.2);
  }
  50% {
    box-shadow:
      0 0 20px rgba(212, 175, 55, 0.5),
      0 0 40px rgba(212, 175, 55, 0.3),
      0 0 60px rgba(212, 175, 55, 0.1);
  }
}

.highlight-element {
  animation: glowPulse 3s ease-in-out infinite;
}
```

#### 6.3.3 阴阳旋转（YinYang Rotate）

```css
@keyframes yinYangRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.taiji-symbol {
  animation: yinYangRotate 60s linear infinite;
}
```

#### 6.3.4 火焰燃烧（Fire Burn - 用于动爻）

```css
@keyframes fireBurn {
  0%,
  100% {
    color: var(--vermillion);
    text-shadow:
      0 0 5px var(--vermillion),
      0 0 10px rgba(196, 30, 58, 0.5);
  }
  50% {
    color: var(--vermillion-light);
    text-shadow:
      0 0 10px var(--vermillion-light),
      0 0 20px rgba(230, 57, 70, 0.7),
      0 0 30px rgba(196, 30, 58, 0.5);
  }
}

.moving-line {
  animation: fireBurn 1.5s ease-in-out infinite;
}
```

## 7. 背景设计 (Background Design)

### 7.1 多层次背景系统

```
┌─────────────────────────────────────────┐
│  Layer 4: 星空粒子（最远）              │  ← 微弱闪烁
│  Layer 3: 星宿连线图案                  │  ← 缓慢漂移
│  Layer 2: 能量光晕                     │  ← 柔和脉动
│  Layer 1: 水墨渐变（最近）              │  ← 静态基底
└─────────────────────────────────────────┘
```

### 7.2 各层实现

#### Layer 1: 水墨渐变

```css
background:
  radial-gradient(
    ellipse at 30% 20%,
    rgba(30, 58, 95, 0.3) 0%,
    transparent 50%
  ),
  radial-gradient(
    ellipse at 70% 80%,
    rgba(26, 26, 37, 0.5) 0%,
    transparent 60%
  ),
  linear-gradient(180deg, #12121a 0%, #0a0a0f 50%, #050508 100%);
```

#### Layer 2: 能量光晕

```css
/* 中心光晕 */
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 800px;
height: 800px;
background: radial-gradient(
  circle,
  rgba(212, 175, 55, 0.05) 0%,
  rgba(212, 175, 55, 0.02) 30%,
  transparent 70%
);
animation: auraPulse 8s ease-in-out infinite;

@keyframes auraPulse {
  0%,
  100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}
```

#### Layer 3: 星宿连线

```css
/* 使用 SVG 绘制二十八宿简化连线 */
.celestial-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  animation: driftPattern 120s linear infinite;
}

@keyframes driftPattern {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(-50px, -30px) rotate(5deg);
  }
}
```

#### Layer 4: 星空粒子

```css
/* 使用 CSS 或 Canvas 绘制 */
.star-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(212, 175, 55, 0.6);
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.8;
  }
}
```

## 8. 布局系统 (Layout System)

### 8.1 三栏布局规范

```
┌────────────┬───────────────────────────────────────┬────────────┐
│            │                                       │            │
│  左侧导航   │           中间内容区                  │  右侧信息   │
│  (240px)   │         (flex-1)                    │  (280px)   │
│            │                                       │            │
│ ┌────────┐ │  ┌─────────────────────────────┐    │ ┌────────┐ │
│ │ Logo   │ │  │     Hero / 操作表单          │    │ │ 今日   │ │
│ │        │ │  └─────────────────────────────┘    │ │ 运势   │ │
│ │ 导航   │ │                                       │ │        │ │
│ │ 菜单   │ │  ┌─────────────────────────────┐    │ │ 宜忌   │ │
│ │        │ │  │     结果展示 / 数据可视化      │    │ │        │ │
│ └────────┘ │  └─────────────────────────────┘    │ └────────┘ │
│            │                                       │            │
│ ┌────────┐ │                                       │            │
│ │ 用户   │ │                                       │            │
│ │ 信息   │ │                                       │            │
│ └────────┘ │                                       │            │
└────────────┴───────────────────────────────────────┴────────────┘
```

### 8.2 间距系统

```css
/* 间距 token */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;

/* 布局间距 */
page-padding: var(--space-xl);
section-gap: var(--space-lg);
card-gap: var(--space-md);
```

### 8.3 响应式断点

```css
/* 移动端：< 768px */
三栏 → 单栏（侧边栏变为抽屉）
卡片堆叠
字体缩小

/* 平板：768px - 1024px */
三栏 → 两栏（左侧栏保留，右侧栏折叠到底部）
卡片 2 列

/* 桌面端：> 1024px */
完整三栏
卡片最多 3 列
```

## 9. 交互规范 (Interaction Design)

### 9.1 悬停交互

```css
/* 卡片悬停 */
.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(212, 175, 55, 0.15);
  border-color: rgba(212, 175, 55, 0.4);
}

/* 按钮悬停 */
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
}

/* 链接悬停 */
.nav-link:hover {
  color: var(--imperial-gold);
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}
```

### 9.2 点击反馈

```css
/* 按钮点击 */
.btn:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

/* 卡片点击 */
.card:active {
  transform: translateY(-2px) scale(0.99);
}

/* 图标按钮点击 */
.icon-btn:active {
  transform: scale(0.9);
  background: rgba(212, 175, 55, 0.1);
}
```

### 9.3 加载状态

```css
/* 骨架屏 */
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(26, 26, 37, 0.4) 25%,
    rgba(37, 37, 47, 0.6) 50%,
    rgba(26, 26, 37, 0.4) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 按钮加载态 */
.btn.loading {
  pointer-events: none;
  opacity: 0.7;
}
.btn.loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -8px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

### 9.4 空状态

```css
.empty-state {
  text-align: center;
  padding: var(--space-3xl) var(--space-xl);
}

.empty-state-icon {
  font-size: 4rem;
  opacity: 0.3;
  margin-bottom: var(--space-lg);
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.empty-state-description {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: var(--space-lg);
}
```

## 10. 无障碍设计 (Accessibility)

### 10.1 色彩对比度

```css
/* 主要文字 */
color: #f5f5f5;
background: #12121a;
/* 对比度：13.5:1 ✓ */

/* 次要文字 */
color: #a0a0b0;
background: #12121a;
/* 对比度：7.2:1 ✓ */

/* 辅助文字 */
color: #6b6b7b;
background: #12121a;
/* 对比度：4.5:1 ✓ */
```

### 10.2 焦点指示

```css
/* 键盘焦点样式 */
:focus-visible {
  outline: 2px solid var(--imperial-gold);
  outline-offset: 2px;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}
```

### 10.3 ARIA 标签

```tsx
<button aria-label="切换导航菜单" aria-expanded={isOpen}>
  <IconMenu />
</button>

<div role="status" aria-live="polite">
  {loading && "加载中..."}
</div>
```

## 11. 性能优化 (Performance)

### 11.1 动画优化

```css
/* 使用 transform 和 opacity，避免触发重排 */
.element {
  transform: translateY(0);
  opacity: 1;
  transition:
    transform 0.3s,
    opacity 0.3s;
}

/* 使用 will-change 提示浏览器 */
.animated-element {
  will-change: transform, opacity;
}
```

### 11.2 图片优化

```tsx
// 使用 Next.js Image 组件
import Image from "next/image";

<Image src="/icons/hexagram.svg" alt="卦象符号" width={48} height={48} />;
```

### 11.3 代码分割

```tsx
// 使用动态导入减少初始加载
const HexagramVisualization = dynamic(
  () => import("@/components/HexagramVisualization"),
  {
    loading: () => <Skeleton variant="rect" />,
    ssr: false,
  },
);
```

## 12. 关键技术实现

### 12.1 使用 Framer Motion 实现复杂动画

```tsx
import { motion, AnimatePresence } from "framer-motion";

// 星辰显现动画
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0)",
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// 使用
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {[1, 2, 3].map((i) => (
    <motion.div key={i} variants={itemVariants}>
      内容 {i}
    </motion.div>
  ))}
</motion.div>;
```

### 12.2 自定义 Hook 管理动画状态

```tsx
// useAnimatedEntry.ts
export const useAnimatedEntry = (delay = 0) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return {
    ref,
    variants: {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay },
      },
    },
    isInView,
  };
};
```

## 13. 文件结构

```
apps/web/src/
├── app/
│   ├── globals.css          # 全局样式 + CSS 变量
│   ├── layout.tsx           # 根布局
│   └── page.tsx            # 首页
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx    # 应用外壳
│   │   ├── Sidebar.tsx     # 侧边导航
│   │   ├── Header.tsx      # 顶栏
│   │   └── CosmicBackground.tsx  # 背景系统
│   ├── ui/
│   │   ├── Button.tsx      # 按钮组件
│   │   ├── Card.tsx        # 卡片组件
│   │   ├── Input.tsx       # 输入框
│   │   ├── Badge.tsx       # 标签
│   │   ├── Skeleton.tsx    # 骨架屏
│   │   └── Toast.tsx       # 提示
│   └── divination/
│       ├── DivinationForm.tsx    # 占卜表单
│       ├── HexagramDisplay.tsx   # 卦象展示
│       ├── HexagramVisualization.tsx  # 卦象可视化（动画）
│       └── FiveElementsChart.tsx  # 五行关系图
└── styles/
    └── animations.css      # 动画定义
```

## 14. 验收标准

### 14.1 视觉验收

- [ ] 整体风格统一，具有东方玄学的神秘感和权威感
- [ ] 色彩搭配协调，帝王金、朱砂红、天际蓝层次分明
- [ ] 动效流畅自然，不卡顿，不闪烁
- [ ] 字体层次清晰，标题、正文、辅助文字有明确区分
- [ ] 卡片、按钮、输入框等组件精致且一致

### 14.2 交互验收

- [ ] 所有可交互元素有明确的悬停、点击反馈
- [ ] 页面加载有骨架屏，不出现白屏或布局跳动
- [ ] 动画性能优良，60fps流畅运行
- [ ] 响应式布局适配移动端、平板、桌面端

### 14.3 功能验收

- [ ] 三栏布局清晰，操作区与结果区分离
- [ ] 占卜表单可正常填写和提交
- [ ] 卦象可视化动画正常播放
- [ ] 历史记录、搜索、设置等功能可用

### 14.4 技术验收

- [ ] 无编译错误和警告
- [ ] Lighthouse 性能评分 > 80
- [ ] 无控制台错误
- [ ] 可访问性评分 > 90

---

**文档版本：** v2.0  
**最后更新：** 2026-05-23  
**作者：** AI Assistant (frontend-design skill)
