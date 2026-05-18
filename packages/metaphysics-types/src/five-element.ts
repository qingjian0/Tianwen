/**
 * 五行系统类型定义
 */

export const FIVE_ELEMENTS = ['金', '木', '水', '火', '土'] as const;
export type FiveElement = typeof FIVE_ELEMENTS[number];

// 五行生克关系
export type WuXingRelation =
  | '生'    // 生我
  | '我生'
  | '克'    // 克我
  | '我克'
  | '比和';

// 五行寄生十二宫
export type WuXingPalace =
  | '长生'
  | '沐浴'
  | '冠带'
  | '临官'
  | '帝旺'
  | '衰'
  | '病'
  | '死'
  | '墓'
  | '绝'
  | '胎'
  | '养';
