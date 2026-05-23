/**
 * 奇门遁甲类型定义
 */

import { Tiangan, Dizhi, Wuxing, ChronoData, Coordinates } from '@tianwen/chrono-engine';

// 盘式类型
export type PanType = 'chaibu' | 'zhirun' | 'maoshan'; // 拆补、置闰、茅山

// 盘局类型
export type PanJuType = 'zhuan' | 'fei'; // 转盘、飞盘

// 值使起法
export type ZhiShiMethod = 'men' | 'dizhi'; // 值使门起、门起地盘

// 九宫格
export interface NinePalace {
  [key: string]: Palace;
}

// 宫位信息
export interface Palace {
  position: number;      // 1-9
  name: string;          // 宫名
  wuxing: Wuxing;        // 五行
  eightDoor: string;     // 八门
  eightStar: string;     // 九星
  tiangan?: Tiangan;     // 天干
  dizhi?: Dizhi;         // 地支
  deity?: string;        // 八神
  isEmpty: boolean;      // 空亡
  isRushed: boolean;     // 冲宫
  isCombined: boolean;   // 合宫
}

// 八门
export type EightDoor = '休门' | '生门' | '伤门' | '杜门' | '景门' | '死门' | '惊门' | '开门';

// 九星
export type EightStar = '天蓬' | '天任' | '天冲' | '天辅' | '天英' | '天芮' | '天柱' | '天心' | '天禽';

// 八神
export type EightDeity = '值符' | '腾蛇' | '太阴' | '六合' | '白虎' | '玄武' | '九地' | '九天';

// 格局类型
export type QimenPattern = 
  | '值符得地' 
  | '值使得地' 
  | '三奇得使'
  | '青龙返首'
  | '白虎猖狂'
  | '朱雀投江'
  | '滕蛇夭矫'
  | '六合得地';

// 完整奇门遁甲结果
export interface QimenResult {
  type: 'dunjia';
  ju: number;           // 局数（1-60）
  yinYang: '阴' | '阳'; // 阴阳
  panType: PanType;     // 盘式
  panJuType: PanJuType; // 盘局类型
  zhiShiMethod: ZhiShiMethod; // 值使起法
  palaces: NinePalace;
  zhiFu: {
    palace: string;
    star: string;
    position: number;
  };
  zhiShi: {
    palace: string;
    door: string;
    position: number;
  };
  xunKong: [Dizhi, Dizhi];
  patterns: QimenPattern[];
  chronoData: ChronoData;
  interpretation?: string;
  luck: number;         // 综合运势（0-100）
  config: QimenConfig;
}

// 奇门遁甲配置
export interface QimenConfig {
  useTrueSun?: boolean;
  coordinates?: Coordinates;
  includeDeity?: boolean;
  includePatterns?: boolean;
  panType?: PanType;
  panJuType?: PanJuType;
  zhiShiMethod?: ZhiShiMethod;
}
