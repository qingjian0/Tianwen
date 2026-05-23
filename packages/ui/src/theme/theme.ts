/**
 * 天问 - 主题系统
 * 支持 Dark Mode
 */

import { colors } from "../design-system/colors";
import { typography } from "../design-system/typography";
import { shadows } from "../design-system/shadows";

export const theme = {
  // 颜色
  colors,

  // 字体
  typography,

  // 阴影
  shadows,

  // 间距
  spacing: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
  },

  // 圆角
  radius: {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },

  // 层级
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },

  // 过渡动画
  transitions: {
    fast: "150ms ease",
    base: "300ms ease",
    slow: "500ms ease",
    verySlow: "1000ms ease",
    cosmic: "2000ms ease",
  },
};

export type Theme = typeof theme;
