import { Bagua, Wuxing } from "@tianwen/chrono-engine";
import { Guaxiang, LiuShiSiGua } from "./types";

// 先天八卦数
export const XIANTIAN_BAGUA: Record<Bagua, number> = {
  乾: 1,
  兑: 2,
  离: 3,
  震: 4,
  巽: 5,
  坎: 6,
  艮: 7,
  坤: 8,
};

// 八卦详细信息
export const BAGUA_INFO: Record<Bagua, Guaxiang> = {
  乾: {
    name: "乾",
    number: 1,
    wuxing: "金",
    binary: "111",
    yao: [],
  },
  兑: {
    name: "兑",
    number: 2,
    wuxing: "金",
    binary: "110",
    yao: [],
  },
  离: {
    name: "离",
    number: 3,
    wuxing: "火",
    binary: "101",
    yao: [],
  },
  震: {
    name: "震",
    number: 4,
    wuxing: "木",
    binary: "100",
    yao: [],
  },
  巽: {
    name: "巽",
    number: 5,
    wuxing: "木",
    binary: "011",
    yao: [],
  },
  坎: {
    name: "坎",
    number: 6,
    wuxing: "水",
    binary: "010",
    yao: [],
  },
  艮: {
    name: "艮",
    number: 7,
    wuxing: "土",
    binary: "001",
    yao: [],
  },
  坤: {
    name: "坤",
    number: 8,
    wuxing: "土",
    binary: "000",
    yao: [],
  },
};

// 六十四卦（简化版）
export const LIUSHISIGUA: LiuShiSiGua[] = [
  { index: 1, name: "乾为天", shangGua: "乾", xiaGua: "乾", binary: "111111" },
  { index: 2, name: "坤为地", shangGua: "坤", xiaGua: "坤", binary: "000000" },
  { index: 3, name: "水雷屯", shangGua: "坎", xiaGua: "震", binary: "010100" },
  { index: 4, name: "山水蒙", shangGua: "艮", xiaGua: "坎", binary: "001010" },
  { index: 5, name: "水天需", shangGua: "坎", xiaGua: "乾", binary: "010111" },
  { index: 6, name: "天水讼", shangGua: "乾", xiaGua: "坎", binary: "111010" },
  { index: 7, name: "地水师", shangGua: "坤", xiaGua: "坎", binary: "000010" },
  { index: 8, name: "水地比", shangGua: "坎", xiaGua: "坤", binary: "010000" },
  {
    index: 9,
    name: "风天小畜",
    shangGua: "巽",
    xiaGua: "乾",
    binary: "011111",
  },
  { index: 10, name: "天泽履", shangGua: "乾", xiaGua: "兑", binary: "111110" },
  { index: 11, name: "地天泰", shangGua: "坤", xiaGua: "乾", binary: "000111" },
  { index: 12, name: "天地否", shangGua: "乾", xiaGua: "坤", binary: "111000" },
  {
    index: 13,
    name: "天火同人",
    shangGua: "乾",
    xiaGua: "离",
    binary: "111101",
  },
  {
    index: 14,
    name: "火天大有",
    shangGua: "离",
    xiaGua: "乾",
    binary: "101111",
  },
  { index: 15, name: "地山谦", shangGua: "坤", xiaGua: "艮", binary: "000001" },
  { index: 16, name: "雷地豫", shangGua: "震", xiaGua: "坤", binary: "100000" },
];

// 五行生克关系
export const WUXING_SHENG: Record<Wuxing, Wuxing> = {
  金: "水",
  水: "木",
  木: "火",
  火: "土",
  土: "金",
};

export const WUXING_KE: Record<Wuxing, Wuxing> = {
  金: "木",
  木: "土",
  土: "水",
  水: "火",
  火: "金",
};

// 八卦按索引查找
export const BAGUA_BY_INDEX: Bagua[] = [
  "乾",
  "兑",
  "离",
  "震",
  "巽",
  "坎",
  "艮",
  "坤",
];
