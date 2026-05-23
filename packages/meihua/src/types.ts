import { Bagua, Wuxing, ChronoData, Coordinates } from '@tianwen/chrono-engine';

// 八卦基础信息
export interface Guaxiang {
  name: Bagua;
  number: number;
  wuxing: Wuxing;
  binary: string; // 二进制表示，如 111
  yao: Yao[]; // 爻列表
}

// 爻
export interface Yao {
  position: number; // 爻位 1-6（1为初爻，6为上爻）
  type: 'yang' | 'yin'; // 阴阳
  isChanging: boolean; // 是否动爻
}

// 起卦方法
export type DivinationMethod = 
  | 'time' // 时间起卦
  | 'number' // 单数字起卦
  | 'number2' // 双数字起卦
  | 'number3' // 三数字起卦
  | 'random' // 随机起卦
  | 'coin' // 铜钱起卦
  | 'manual' // 手动起卦
  | 'image'; // 图像取象

// 梅花易数配置
export interface MeihuaConfig {
  useTrueSun?: boolean;
  coordinates?: Coordinates;
  addShichen?: boolean; // 是否加时辰
}

// 梅花易数卦象结果
export interface MeihuaResult {
  method: DivinationMethod;
  config: MeihuaConfig;
  chronoData?: ChronoData;
  benGua: Guaxiang & { yao: Yao[] }; // 本卦
  huGua?: Guaxiang & { yao: Yao[] }; // 互卦
  bianGua?: Guaxiang & { yao: Yao[] }; // 变卦
  cuoGua?: Guaxiang; // 错卦
  zongGua?: Guaxiang; // 综卦
  dongYaoPositions: number[]; // 动爻位置数组
  tiYong: {
    ti: Bagua; // 体卦
    yong: Bagua; // 用卦
    tiWuxing: Wuxing;
    yongWuxing: Wuxing;
    relation: 'sheng' | 'ke' | 'bihe' | 'tishengyong' | 'yongshengti'; // 生克关系
  };
  interpretation?: string; // 解读
}

// 六十四卦信息
export interface LiuShiSiGua {
  index: number;
  name: string;
  shangGua: Bagua;
  xiaGua: Bagua;
  binary: string;
  text?: string;
  yaoCi?: string[];
}
