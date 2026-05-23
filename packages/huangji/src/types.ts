export interface HuangJiInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
}

export interface YuanHuiYunShi {
  yuan: number;
  hui: number;
  yun: number;
  shi: number;
}

export interface GuaMing {
  guaName: string;
  guaNum: number;
}

export interface HuangJiResult {
  yuanHuiYunShi: YuanHuiYunShi;
  huiGua: GuaMing;
  yunGua: GuaMing;
  shiGua: GuaMing;
  yearGua: GuaMing;
  monthGua: GuaMing;
  dayGua: GuaMing;
  hourGua: GuaMing;
  baseNum: number;
}

export interface HuangJiAnalysis {
  eraDescription: string;
  guaMingInterpretation: string;
  suggestions: string[];
}
