// 十天干
export type Tiangan = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";

// 十二地支
export type Dizhi = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";

// 六十甲子
export type Jiazi = string;

// 五行
export type Wuxing = "金" | "木" | "水" | "火" | "土";

// 八卦
export type Bagua = "乾" | "兑" | "离" | "震" | "巽" | "坎" | "艮" | "坤";

// 爻
export interface Yao {
  position: number;  // 1-6，1为初爻，6为上爻
  type: "yang" | "yin";  // 阴阳
  isChanging: boolean;  // 是否动爻
}

// 六十四卦完整信息
export interface LiuShiSiGuaFull {
  index: number;
  name: string;
  shangGua: Bagua;
  xiaGua: Bagua;
  binary: string;
  yao: Yao[];
}

// 起卦方法
export type DivinationMethod =
  | "time"        // 时间起卦
  | "number"      // 单数字起卦
  | "number2"     // 双数字起卦
  | "number3"     // 三数字起卦
  | "random"      // 随机起卦
  | "coin"        // 铜钱起卦
  | "manual"      // 手动起卦
  | "image";      // 图像取象

// 梅花易数结果
export interface MeihuaResult {
  method: DivinationMethod;
  benGua: LiuShiSiGuaFull;  // 本卦
  huGua?: LiuShiSiGuaFull;  // 互卦
  bianGua?: LiuShiSiGuaFull; // 变卦
  cuoGua?: LiuShiSiGuaFull;  // 错卦
  zongGua?: LiuShiSiGuaFull; // 综卦
  dongYaoPositions: number[]; // 动爻位置
  tiYong: {
    ti: Bagua;
    yong: Bagua;
    tiWuxing: Wuxing;
    yongWuxing: Wuxing;
    relation: "bihe" | "yongshengti" | "tishengyong" | "ke" | "sheng";
  };
  dateInfo?: DateInfo;
  interpretation?: string;
}

// 日期信息
export interface DateInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  yearGanZhi: string;
  monthGanZhi: string;
  dayGanZhi: string;
  hourGanZhi: string;
  shichen: Dizhi;
  xunKong: [Dizhi, Dizhi] | null;
}

// 农历信息
export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

// 坐标
export interface Coordinates {
  lat: number;
  lng: number;
}
