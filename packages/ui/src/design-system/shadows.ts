/**
 * 天问 - 阴影系统
 * 要求：高级、克制
 */

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",

  // 宇宙风格阴影
  cosmic: {
    soft: "0 0 20px 0 rgba(184, 134, 11, 0.1)",
    glow: "0 0 30px 0 rgba(184, 134, 11, 0.2)",
    star: "0 0 50px 0 rgba(59, 130, 246, 0.15)",
  },
};

export type ShadowTokens = typeof shadows;
