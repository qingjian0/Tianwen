/**
 * 奇门遁甲常量
 */

import { Tiangan, Dizhi, Wuxing } from "@tianwen/chrono-engine";

// 九宫八卦位置（洛书）
export const NINE_PALACE_POSITION: Record<number, string> = {
  1: "坎宫",
  2: "坤宫",
  3: "震宫",
  4: "巽宫",
  5: "中宫",
  6: "乾宫",
  7: "兑宫",
  8: "艮宫",
  9: "离宫",
};

// 九宫五行
export const NINE_PALACE_WUXING: Record<number, Wuxing> = {
  1: "水",
  2: "土",
  3: "木",
  4: "木",
  5: "土",
  6: "金",
  7: "金",
  8: "土",
  9: "火",
};

// 九星
export const NINE_STARS: string[] = [
  "天蓬",
  "天任",
  "天冲",
  "天辅",
  "天英",
  "天芮",
  "天柱",
  "天心",
  "天禽",
];

// 九星五行
export const NINE_STARS_WUXING: Record<string, Wuxing> = {
  天蓬: "水",
  天任: "土",
  天冲: "木",
  天辅: "木",
  天英: "火",
  天芮: "土",
  天柱: "金",
  天心: "金",
  天禽: "土",
};

// 九星吉凶
export const NINE_STARS_LUCK: Record<string, number> = {
  天蓬: 60,
  天任: 80,
  天冲: 70,
  天辅: 85,
  天英: 75,
  天芮: 50,
  天柱: 65,
  天心: 80,
  天禽: 75,
};

// 八门
export const EIGHT_DOORS: string[] = [
  "休门",
  "生门",
  "伤门",
  "杜门",
  "景门",
  "死门",
  "惊门",
  "开门",
];

// 八门五行
export const EIGHT_DOORS_WUXING: Record<string, Wuxing> = {
  休门: "水",
  生门: "土",
  伤门: "木",
  杜门: "木",
  景门: "火",
  死门: "土",
  惊门: "金",
  开门: "金",
};

// 八门吉凶
export const EIGHT_DOORS_LUCK: Record<string, number> = {
  休门: 85,
  生门: 90,
  伤门: 40,
  杜门: 50,
  景门: 70,
  死门: 20,
  惊门: 45,
  开门: 80,
};

// 八神
export const EIGHT_DEITIES: string[] = [
  "直符",
  "腾蛇",
  "太阴",
  "六合",
  "白虎",
  "玄武",
  "九地",
  "九天",
];

// 八神五行
export const EIGHT_DEITIES_WUXING: Record<string, Wuxing> = {
  直符: "木",
  腾蛇: "火",
  太阴: "水",
  六合: "木",
  白虎: "金",
  玄武: "水",
  九地: "土",
  九天: "金",
};

// 三奇六仪
export const THREE_WONDERS: Tiangan[] = ["乙", "丙", "丁"];
export const SIX_INSTRUMENTS: Tiangan[] = ["戊", "己", "庚", "辛", "壬", "癸"];
export const THREE_AND_SIX: Tiangan[] = [...THREE_WONDERS, ...SIX_INSTRUMENTS];

// 阳遁布局
export const YANG_DUN_LAYOUT: Record<number, Tiangan[]> = {
  1: ["戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"],
  2: ["己", "庚", "辛", "壬", "癸", "丁", "丙", "乙", "戊"],
  3: ["庚", "辛", "壬", "癸", "丁", "丙", "乙", "戊", "己"],
  4: ["辛", "壬", "癸", "丁", "丙", "乙", "戊", "己", "庚"],
  5: ["壬", "癸", "丁", "丙", "乙", "戊", "己", "庚", "辛"],
  6: ["癸", "丁", "丙", "乙", "戊", "己", "庚", "辛", "壬"],
  7: ["丁", "丙", "乙", "戊", "己", "庚", "辛", "壬", "癸"],
  8: ["丙", "乙", "戊", "己", "庚", "辛", "壬", "癸", "丁"],
  9: ["乙", "戊", "己", "庚", "辛", "壬", "癸", "丁", "丙"],
};

// 阴遁布局（逆向）
export const YIN_DUN_LAYOUT: Record<number, Tiangan[]> = {
  1: ["戊", "乙", "丙", "丁", "癸", "壬", "辛", "庚", "己"],
  2: ["己", "戊", "乙", "丙", "丁", "癸", "壬", "辛", "庚"],
  3: ["庚", "己", "戊", "乙", "丙", "丁", "癸", "壬", "辛"],
  4: ["辛", "庚", "己", "戊", "乙", "丙", "丁", "癸", "壬"],
  5: ["壬", "辛", "庚", "己", "戊", "乙", "丙", "丁", "癸"],
  6: ["癸", "壬", "辛", "庚", "己", "戊", "乙", "丙", "丁"],
  7: ["丁", "癸", "壬", "辛", "庚", "己", "戊", "乙", "丙"],
  8: ["丙", "丁", "癸", "壬", "辛", "庚", "己", "戊", "乙"],
  9: ["乙", "丙", "丁", "癸", "壬", "辛", "庚", "己", "戊"],
};

// 地支六冲
export const DIZHI_LIUCHONG: Record<Dizhi, Dizhi> = {
  子: "午",
  午: "子",
  丑: "未",
  未: "丑",
  寅: "申",
  申: "寅",
  卯: "酉",
  酉: "卯",
  辰: "戌",
  戌: "辰",
  巳: "亥",
  亥: "巳",
};

// 地支六合
export const DIZHI_LIUHE: Record<Dizhi, Dizhi> = {
  子: "丑",
  丑: "子",
  寅: "亥",
  亥: "寅",
  卯: "戌",
  戌: "卯",
  辰: "酉",
  酉: "辰",
  巳: "申",
  申: "巳",
  午: "未",
  未: "午",
};

// 二十四节气与局数
export const SOLAR_TERMS_JU: Record<string, { yang: number; yin: number }> = {
  立春: { yang: 8, yin: 0 },
  雨水: { yang: 9, yin: 0 },
  惊蛰: { yang: 1, yin: 0 },
  春分: { yang: 2, yin: 0 },
  清明: { yang: 3, yin: 0 },
  谷雨: { yang: 4, yin: 0 },
  立夏: { yang: 5, yin: 0 },
  小满: { yang: 6, yin: 0 },
  芒种: { yang: 7, yin: 0 },
  夏至: { yang: 0, yin: 9 },
  小暑: { yang: 0, yin: 8 },
  大暑: { yang: 0, yin: 7 },
  立秋: { yang: 0, yin: 6 },
  处暑: { yang: 0, yin: 5 },
  白露: { yang: 0, yin: 4 },
  秋分: { yang: 0, yin: 3 },
  寒露: { yang: 0, yin: 2 },
  霜降: { yang: 0, yin: 1 },
  立冬: { yang: 0, yin: 1 },
  小雪: { yang: 0, yin: 2 },
  大雪: { yang: 0, yin: 3 },
  冬至: { yang: 1, yin: 0 },
  小寒: { yang: 2, yin: 0 },
  大寒: { yang: 3, yin: 0 },
};
