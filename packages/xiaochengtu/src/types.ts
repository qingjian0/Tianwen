export interface XiaoChengTuInput {
  numbers?: number[];
  date?: Date;
}

export interface Palace {
  position: number;
  guaName: string;
  guaNum: number;
  isYongShen: boolean;
  isHost: boolean;
  relationship: string;
  analysis: string;
}

export interface XiaoChengTuResult {
  originGua: {
    shang: string;
    xia: string;
    dongYao: number;
  };
  palaces: Palace[];
  hostGuests: {
    host: Palace;
    guest: Palace;
  };
}

export interface XiaoChengTuAnalysis {
  overview: string;
  keyPalaces: string[];
  suggestions: string[];
}