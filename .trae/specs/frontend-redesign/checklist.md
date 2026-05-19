# 天问前端视觉重设计 验证清单

## 设计系统 Token
- [x] Tailwind 配置包含完整的五行色彩体系（墨色/金色/朱砂/靛青/玉色各4级）
- [x] glow 阴影系列 (sm/md/lg) 在 CSS 中可用
- [x] 自定义动画 (shimmer, fade-slide-up, scale-in, pulse-glow) 在 Tailwind 中可用
- [x] font-serif, font-mono 字体族已配置
- [x] globals.css 中 CSS 变量体系完整，所有页面不出现硬编码色值

## 共享 UI 组件
- [x] Button 组件支持 primary/secondary/ghost 变体和 sm/md/lg 尺寸
- [x] Button 有 hover 发光、active 缩放、disabled 置灰、loading 旋转态
- [x] Card 组件支持 default/highlight/subtle 变体
- [x] Card 支持 header/footer/children 插槽
- [x] Badge 组件支持 gold/vermillion/jade/indigo/ghost 变体
- [x] Skeleton 组件支持 text/circle/rect 变体，有脉冲动画
- [x] Toast 组件右上角弹出，3秒自动消失，支持 success/error/info
- [x] Input 组件深色主题，支持前后置 icon
- [x] Segment 分段控制器选中态与非选中态区分清晰

## 全局布局
- [x] Sidebar 显示品牌「天问」标识（金色渐变文字）
- [x] Sidebar 导航项带 Unicode 符号图标，active 态 golden glow 边框
- [x] Sidebar 底部显示当前干支信息
- [x] Header 左侧显示当前页面标题，右侧显示实时干支时间
- [x] CosmicBackground 水墨渐变 + 二十八宿连线图案 + 靛青→金光晕
- [x] 移动端侧边栏可滑出/收起

## 首页（天问殿）
- [x] Hero 区大幅「天问」标题使用 CSS 金色渐变 + glow 阴影
- [x] 五大术数卡片网格排列，hover 悬浮发光，可点击跳转
- [x] 底部干支时钟实时更新
- [x] 进入动画 staggered reveal

## 推演页
- [x] 输入区使用 Card + Input/Textarea 统一组件
- [x] 术数选择使用图标化 Segment 按钮组
- [x] 模式和时间范围使用 Segment 分段控制器
- [x] 推演按钮使用 Primary Button
- [x] 加载态显示 Skeleton 骨架屏（非旋转 spinner）
- [x] 结果区 staggered reveal 动画逐个展开
- [x] 综合论断双栏大数字展示

## 排盘页
- [x] 排盘类型选择使用 Segment 控制器
- [x] 梅花卦：本卦/互卦/变卦三列 Card，八卦符号正确显示
- [x] 六爻：6 爻纵向排列，阴阳符号 + 六亲 + 五行 + 世应 + 动爻高亮
- [x] 奇门：3×3 九宫格，每宫八门八神九星分色显示
- [x] 八字：四列 Card，天干金色/地支灰色，日柱高亮

## 命宫页
- [x] 八字四柱区水平排列，天干地支分两行
- [x] 日主五行 Badge 正确显示
- [x] 五行强弱进度条动画
- [x] 紫微十二宫 4×3 网格，主星金 Badge + 辅星灰 Badge
- [x] 命宫以金色边框高亮
- [x] 运势四维径向进度环动画

## 动画与过渡
- [x] 页面切换有 fade-in + slide-up 过渡
- [x] 子元素 staggered reveal（50ms 间隔）
- [x] 无明显的页面闪烁或布局偏移 (CLS)

## 编译与兼容
- [x] `pnpm dev` 无编译错误
- [x] 所有四个页面 (/, /prediction, /chart, /destiny-palace) 返回 200
- [x] 后端 API 调用正常（数据展示正确）
- [x] 移动端 (< 768px) 布局无溢出、触控目标充足