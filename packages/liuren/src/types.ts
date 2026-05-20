export interface LiuRenInput {
  eventTime: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute?: number;
  };
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