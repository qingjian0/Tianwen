import { ChronoData, Coordinates } from "@tianwen/chrono-engine";

export interface LiuRenConfig {
  useTrueSun?: boolean;
  coordinates?: Coordinates;
  jiangMethod?: "yue" | "shi";
  keMethod?: "tian" | "di";
  shehaiMethod?: "mengzhongji" | "shenqian";
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
  keTi: string;
  shiShen: Record<string, string>;
  yongShen: string;
}

export interface LiuRenAnalysis {
  keTi: string;
  yongShen: string;
  jiXiong: string;
  detailedAnalysis: string;
  patterns: string[];
}

export interface Ke {
  tianGan: string;
  tianJiang: string;
  diGan: string;
  diZhi: string;
}

export interface SiKeFull {
  ke1: Ke;
  ke2: Ke;
  ke3: Ke;
  ke4: Ke;
}
