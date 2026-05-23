import { ChronoData, Coordinates } from "@tianwen/chrono-engine";

export interface LiuRenConfig {
  useTrueSun?: boolean;
  coordinates?: Coordinates;
  // 换将方式：月将/时将
  jiangMethod?: "yue" | "shi";
  // 起课方式：天盘/地盘
  keMethod?: "tian" | "di";
  // 涉害方法：孟仲季/深浅
  shehaiMethod?: "mengzhongji" | "shenqian";
  // 昼夜选择
  dayNight?: "day" | "night";
}

export interface TianPan {
  jiang: string;
  position: string;
  shen: string;
}

export interface SiKe {
  gan: { yang: string; yin: string };
  zhi: { yang: string; yin: string };
}

export interface SanChuan {
  chu: string;
  zhong: string;
  mo: string;
}

export interface LiuRenResult {
  config: LiuRenConfig;
  chronoData: ChronoData;
  tianPan: TianPan;
  diPan: string[];
  siKe: SiKe;
  sanChuan: SanChuan;
  dunGan: Record<string, string>;
  tianJiang: Record<string, string>;
  liuQin: Record<string, string>;
}

export interface LiuRenAnalysis {
  keTi: string;
  yongShen: string;
  jiXiong: string;
  detailedAnalysis: string;
}
