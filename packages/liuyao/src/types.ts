import {
  Tiangan,
  Dizhi,
  Wuxing,
  Bagua,
  ChronoData,
} from "@tianwen/chrono-engine";

// 六爻爻位状态
export type YaoState = "oldYang" | "youngYang" | "oldYin" | "youngYin";

// 六爻单爻
export interface LiuYaoYao {
  position: number; // 1-6，1为初爻
  state: YaoState;
  isChanging: boolean;
  tiangan: Tiangan;
  dizhi: Dizhi;
  wuxing: Wuxing;
  liuqin: string;
  liushen: string;
  isShiyao: boolean;
  isYingyao: boolean;
  isXunkong: boolean;
  isYuepo: boolean;
  isRichong: boolean;
}

// 六爻完整结果
export interface LiuYaoResult {
  method: "coin" | "number" | "time" | "manual";
  benGua: {
    name: string;
    shangGua: Bagua;
    xiaGua: Bagua;
    yaos: LiuYaoYao[];
  };
  bianGua?: {
    name: string;
    shangGua: Bagua;
    xiaGua: Bagua;
    yaos: LiuYaoYao[];
  };
  fuyaos?: LiuYaoYao[];
  chronoData: ChronoData;
  yuejian: Dizhi;
  richend: Tiangan;
  xunkong: [Dizhi, Dizhi];
  interpretation?: string;
}

// 六爻分析结果
export interface LiuYaoAnalysis {
  mainSignals: string[];
  timeline: { period: string; signal: string }[];
  fortune: "great" | "good" | "neutral" | "warning" | "danger";
  suggestions: string[];
}
