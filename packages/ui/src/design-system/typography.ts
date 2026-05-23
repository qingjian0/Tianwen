/**
 * 天问 - 字体系统
 */

export const typography = {
  // 字体族
  fonts: {
    serif: "Noto Serif, Songti SC, serif", // 东方气质标题
    sans: "Inter, system-ui, -apple-system, sans-serif", // 正文
    mono: "JetBrains Mono, SFMono-Regular, monospace",
  },

  // 字号尺度
  size: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
  },

  // 字重
  weight: {
    thin: 100,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // 行高
  leading: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

export type TypographyTokens = typeof typography;
