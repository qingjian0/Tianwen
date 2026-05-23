/**
 * 星神系统类型定义
 */

// 九星
export const NINE_STARS = [
  "天蓬",
  "天芮",
  "天冲",
  "天辅",
  "天禽",
  "天心",
  "天柱",
  "天任",
  "天英",
] as const;
export type Star = (typeof NINE_STARS)[number];

// 八神
export const EIGHT_DEITIES = [
  "值符",
  "螣蛇",
  "太阴",
  "六合",
  "白虎",
  "玄武",
  "九地",
  "九天",
] as const;
export type Deity = (typeof EIGHT_DEITIES)[number];

// 六神
export const SIX_DEITIES = [
  "青龙",
  "朱雀",
  "勾陈",
  "螣蛇",
  "白虎",
  "玄武",
] as const;
export type SixDeity = (typeof SIX_DEITIES)[number];
