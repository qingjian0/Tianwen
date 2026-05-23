import { Tiangan, Dizhi, Wuxing, ChronoData } from "@tianwen/chrono-engine";

// 十神
export type Shishen =
  | "正官"
  | "七杀"
  | "正印"
  | "偏印"
  | "比肩"
  | "劫财"
  | "食神"
  | "伤官"
  | "正财"
  | "偏财";

// 五行强弱
export interface WuxingStrength {
  wuxing: Wuxing;
  score: number;
  level: "strong" | "medium" | "weak";
}

// 单柱
export interface BaZiPillar {
  tiangan: Tiangan;
  dizhi: Dizhi;
  tianganWuxing: Wuxing;
  dizhiWuxing: Wuxing;
  canggan: Tiangan[];
  shishen: Shishen;
}

// 大运
export interface DayunPillar {
  startAge: number;
  endAge: number;
  tiangan: Tiangan;
  dizhi: Dizhi;
  tianganWuxing: Wuxing;
  dizhiWuxing: Wuxing;
  shishen: Shishen;
}

// 流年
export interface LiunianPillar {
  year: number;
  tiangan: Tiangan;
  dizhi: Dizhi;
  tianganWuxing: Wuxing;
  dizhiWuxing: Wuxing;
  shishen: Shishen;
}

// 八字完整结果
export interface BaZiResult {
  chronoData: ChronoData;
  gender: "male" | "female";
  yearPillar: BaZiPillar;
  monthPillar: BaZiPillar;
  dayPillar: BaZiPillar;
  hourPillar: BaZiPillar;
  dayMaster: Tiangan;
  dayMasterWuxing: Wuxing;
  wuxingStrengths: WuxingStrength[];
  dayMasterStrength: "weak" | "balanced" | "strong";
  favorableWuxing: Wuxing[];
  unfavorableWuxing: Wuxing[];
  dayuns: DayunPillar[];
  currentLiunian: LiunianPillar;
  liunians: LiunianPillar[];
  pattern?: string;
  interpretation?: string;
}
