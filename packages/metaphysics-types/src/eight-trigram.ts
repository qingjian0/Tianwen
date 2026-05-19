/**
 * 八卦系统类型定义
 */

import type { FiveElement } from './five-element';

export const EIGHT_TRIGRAMS = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'] as const;
export type EightTrigram = typeof EIGHT_TRIGRAMS[number];

// 先天八卦数
export const XIANTIAN_NUMBERS: Record<EightTrigram, number> = {
  '乾': 1,
  '兑': 2,
  '离': 3,
  '震': 4,
  '巽': 5,
  '坎': 6,
  '艮': 7,
  '坤': 8
};

// 八卦对象
export interface Trigram {
  name: EightTrigram;
  binary: string;
  number: number;
  wuxing: FiveElement;
}

// 六十四卦
export interface LiuShiSiGua {
  id: number;
  name: string;
  upper: EightTrigram;
  lower: EightTrigram;
  binary: string;
}
