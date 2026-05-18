/**
 * 九宫系统类型定义
 */

export const NINE_PALACES = ['坎', '坤', '震', '巽', '中', '乾', '兑', '艮', '离'] as const;
export type NinePalace = typeof NINE_PALACES[number];

// 九宫位置
export interface Palace {
  position: number;
  name: NinePalace;
  star?: Star;
  deity?: Deity;
}

// 八门
export const EIGHT_GATES = ['休门', '死门', '伤门', '杜门', '开门', '惊门', '生门', '景门'] as const;
export type EightGate = typeof EIGHT_GATES[number];
