/**
 * 紫微斗数类型定义
 */

import { Tiangan, Dizhi, ChronoData } from '@tianwen/chrono-engine';

// 紫微星系
export type Star =
  | '紫微'
  | '天机'
  | '太阳'
  | '武曲'
  | '天同'
  | '廉贞'
  | '天府'
  | '太阴'
  | '贪狼'
  | '巨门'
  | '天相'
  | '天梁'
  | '七杀'
  | '破军'
  | '左辅'
  | '右弼'
  | '文昌'
  | '文曲'
  | '禄存'
  | '天马'
  | '天魁'
  | '天钺'
  | '三台'
  | '八座'
  | '恩光'
  | '天贵'
  | '红鸾'
  | '天喜';

// 宫位
export type Palace =
  | '命宫'
  | '兄弟'
  | '夫妻'
  | '子女'
  | '财帛'
  | '疾厄'
  | '迁移'
  | '交友'
  | '官禄'
  | '田宅'
  | '福德'
  | '父母';

// 五行
export type Wuxing = '金' | '木' | '水' | '火' | '土';

// 宫位数据
export interface PalaceData {
  name: Palace;
  position: number;
  tiangan: Tiangan;
  dizhi: Dizhi;
  mainStars: Star[];
  auxStars: Star[];
  wuxing: Wuxing;
  isEmpty?: boolean;
}

// 完整紫微斗数结果
export interface ZiweiResult {
  type: 'ziwei';
  palaces: PalaceData[];
  mainPalace: PalaceData;
  chronoData: ChronoData;
  gender: '男' | '女';
  interpretation?: string;
  luck: number;
  predictions: {
    career: string;
    wealth: string;
    relationships: string;
    health: string;
  };
}
