export interface CeGuiInput {
  year: number;
  month: number;
  day: number;
  hour: number;
}

export interface DongZhiShu {
  dongShu: number;
  zhiShu: number;
  totalShu: number;
}

export interface GuaGui {
  guaName: string;
  guiName: string;
}

export interface CeGuiResult {
  dongZhiShu: DongZhiShu;
  guaGui: GuaGui;
  ceShu: number;
  guiShu: number;
  yearGua: string;
}

export interface CeGuiAnalysis {
  overview: string;
  interpretation: string;
}
