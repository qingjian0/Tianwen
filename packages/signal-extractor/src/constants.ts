import { Wuxing } from "@tianwen/chrono-engine";

// 信号极性权重
export const POLARITY_WEIGHTS = {
  positive: 1.2,
  neutral: 1.0,
  negative: 0.8,
  unstable: 0.6,
};

// 梅花易数体用关系信号
export const MEIHUA_TIYONG_SIGNALS: Record<
  string,
  {
    polarity: "positive" | "negative" | "neutral";
    strength: number;
    description: string;
  }
> = {
  bihe: {
    polarity: "positive",
    strength: 0.9,
    description: "体用比和，诸事顺遂",
  },
  yongshengti: {
    polarity: "positive",
    strength: 0.85,
    description: "用生体，得助力",
  },
  tishengyong: {
    polarity: "negative",
    strength: 0.7,
    description: "体生用，有损耗",
  },
  ke: { polarity: "positive", strength: 0.75, description: "体克用，可成功" },
  sheng: { polarity: "negative", strength: 0.8, description: "用克体，需谨慎" },
};

// 六爻十神信号
export const LIUYAO_SHISHEN_SIGNALS: Record<
  string,
  {
    polarity: "positive" | "negative" | "neutral";
    strength: number;
    description: string;
  }
> = {
  父母: { polarity: "neutral", strength: 0.5, description: "文书、长辈、信息" },
  兄弟: {
    polarity: "negative",
    strength: 0.6,
    description: "同辈、竞争、破财",
  },
  官鬼: {
    polarity: "neutral",
    strength: 0.55,
    description: "名声、职务、灾祸",
  },
  妻财: {
    polarity: "positive",
    strength: 0.7,
    description: "钱财、物资、感情",
  },
  子孙: {
    polarity: "positive",
    strength: 0.8,
    description: "福德、医药、化解",
  },
};

// 五行强弱映射
export const WUXING_STRENGTH_SIGNALS: Record<
  "strong" | "medium" | "weak",
  { polarity: "positive" | "negative" | "neutral"; multiplier: number }
> = {
  strong: { polarity: "neutral", multiplier: 1.5 },
  medium: { polarity: "neutral", multiplier: 1.0 },
  weak: { polarity: "neutral", multiplier: 0.6 },
};
