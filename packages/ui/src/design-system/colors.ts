/**
 * 天问 - 颜色系统
 * 主题：东方宇宙风
 */

export const colors = {
  // 深空黑系列
  cosmic: {
    black: "#0A0A0F",
    dark: "#12121C",
    medium: "#1A1A2E",
    light: "#2A2A40",
  },

  // 青铜金系列
  bronze: {
    900: "#5C4A1A",
    700: "#8B6914",
    500: "#B8860B", // 青铜金（主色）
    300: "#DAA520",
    100: "#FFD700",
  },

  // 星辉蓝系列
  starlight: {
    900: "#1E3A5F",
    700: "#2563EB",
    500: "#3B82F6",
    300: "#60A5FA",
    100: "#DBEAFE",
  },

  // 水墨灰系列
  ink: {
    900: "#1F2937",
    700: "#374151",
    500: "#6B7280",
    300: "#9CA3AF",
    100: "#F3F4F6",
  },

  // 暗金系列
  darkgold: {
    900: "#4A370B",
    700: "#6B4F0D",
    500: "#A67C00",
    300: "#D4AF37",
    100: "#FFF8DC",
  },

  // 微光白
  glow: {
    white: "#FFFFFF",
    soft: "#F8F9FA",
    dim: "#E5E7EB",
  },
};

export type ColorTokens = typeof colors;
