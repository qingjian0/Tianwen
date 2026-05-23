/**
 * 干支系统类型定义
 */

// 天干
export const HEAVENLY_STEMS = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
] as const;
export type HeavenlyStem = (typeof HEAVENLY_STEMS)[number];

// 地支
export const EARTHLY_BRANCHES = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
] as const;
export type EarthlyBranch = (typeof EARTHLY_BRANCHES)[number];

// 干支组合
export interface GanZhi {
  gan: HeavenlyStem;
  zhi: EarthlyBranch;
  full: string;
}

// 十二生肖
export const ZODIAC_ANIMALS = [
  "鼠",
  "牛",
  "虎",
  "兔",
  "龙",
  "蛇",
  "马",
  "羊",
  "猴",
  "鸡",
  "狗",
  "猪",
] as const;
export type ZodiacAnimal = (typeof ZODIAC_ANIMALS)[number];

// 旬空
export interface XunKong {
  xun: string;
  kong: [EarthlyBranch, EarthlyBranch];
}
