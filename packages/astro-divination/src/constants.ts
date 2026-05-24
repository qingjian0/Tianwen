import { Bagua, Tiangan, Dizhi, Jiazi, Wuxing } from "./types";

// 十天干
export const TIANGAN: Tiangan[] = [
  "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"
];

// 十二地支
export const DIZHI: Dizhi[] = [
  "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"
];

// 六十甲子
export const JIAZI_TABLE: Jiazi[] = [
  "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉",
  "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未",
  "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳",
  "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯",
  "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑",
  "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"
];

// 先天八卦数：乾1、兑2、离3、震4、巽5、坎6、艮7、坤8
export const XIANTIAN_BAGUA_ORDER: Bagua[] = [
  "乾", "兑", "离", "震", "巽", "坎", "艮", "坤"
];

// 后天八卦
export const HOUTIAN_BAGUA_ORDER: Bagua[] = [
  "坎", "坤", "震", "巽", "乾", "兑", "艮", "离"
];

// 八卦信息
export interface BaguaInfo {
  binary: string;
  number: number;
  wuxing: Wuxing;
  palace: string;
}

export const BAGUA_INFO: Record<Bagua, BaguaInfo> = {
  "乾": { binary: "111", number: 1, wuxing: "金", palace: "乾" },
  "兑": { binary: "110", number: 2, wuxing: "金", palace: "兑" },
  "离": { binary: "101", number: 3, wuxing: "火", palace: "离" },
  "震": { binary: "100", number: 4, wuxing: "木", palace: "震" },
  "巽": { binary: "011", number: 5, wuxing: "木", palace: "巽" },
  "坎": { binary: "010", number: 6, wuxing: "水", palace: "坎" },
  "艮": { binary: "001", number: 7, wuxing: "土", palace: "艮" },
  "坤": { binary: "000", number: 8, wuxing: "土", palace: "坤" }
};

// 六十四卦
export interface LiuShiSiGua {
  index: number;
  name: string;
  shangGua: Bagua;
  xiaGua: Bagua;
  binary: string;
  text?: string;
}

export const LIUSHISIGUA: LiuShiSiGua[] = [
  { index: 1, name: "乾为天", shangGua: "乾", xiaGua: "乾", binary: "111111" },
  { index: 2, name: "坤为地", shangGua: "坤", xiaGua: "坤", binary: "000000" },
  { index: 3, name: "水雷屯", shangGua: "坎", xiaGua: "震", binary: "010100" },
  { index: 4, name: "山水蒙", shangGua: "艮", xiaGua: "坎", binary: "001010" },
  { index: 5, name: "水天需", shangGua: "坎", xiaGua: "乾", binary: "010111" },
  { index: 6, name: "天水讼", shangGua: "乾", xiaGua: "坎", binary: "111010" },
  { index: 7, name: "地水师", shangGua: "坤", xiaGua: "坎", binary: "000010" },
  { index: 8, name: "水地比", shangGua: "坎", xiaGua: "坤", binary: "010000" },
  { index: 9, name: "风天小畜", shangGua: "巽", xiaGua: "乾", binary: "011111" },
  { index: 10, name: "天泽履", shangGua: "乾", xiaGua: "兑", binary: "111110" },
  { index: 11, name: "地天泰", shangGua: "坤", xiaGua: "乾", binary: "000111" },
  { index: 12, name: "天地否", shangGua: "乾", xiaGua: "坤", binary: "111000" },
  { index: 13, name: "天火同人", shangGua: "乾", xiaGua: "离", binary: "111101" },
  { index: 14, name: "火天大有", shangGua: "离", xiaGua: "乾", binary: "101111" },
  { index: 15, name: "地山谦", shangGua: "坤", xiaGua: "艮", binary: "000001" },
  { index: 16, name: "雷地豫", shangGua: "震", xiaGua: "坤", binary: "100000" },
  { index: 17, name: "泽雷随", shangGua: "兑", xiaGua: "震", binary: "110100" },
  { index: 18, name: "山风蛊", shangGua: "艮", xiaGua: "巽", binary: "001011" },
  { index: 19, name: "地泽临", shangGua: "坤", xiaGua: "兑", binary: "000110" },
  { index: 20, name: "风地观", shangGua: "巽", xiaGua: "坤", binary: "011000" },
  { index: 21, name: "火雷噬嗑", shangGua: "离", xiaGua: "震", binary: "101100" },
  { index: 22, name: "山火贲", shangGua: "艮", xiaGua: "离", binary: "001101" },
  { index: 23, name: "山地剥", shangGua: "艮", xiaGua: "坤", binary: "001000" },
  { index: 24, name: "地雷复", shangGua: "坤", xiaGua: "震", binary: "000100" },
  { index: 25, name: "天雷无妄", shangGua: "乾", xiaGua: "震", binary: "111100" },
  { index: 26, name: "山天大畜", shangGua: "艮", xiaGua: "乾", binary: "001111" },
  { index: 27, name: "山雷颐", shangGua: "艮", xiaGua: "震", binary: "001100" },
  { index: 28, name: "泽风大过", shangGua: "兑", xiaGua: "巽", binary: "110011" },
  { index: 29, name: "坎为水", shangGua: "坎", xiaGua: "坎", binary: "010010" },
  { index: 30, name: "离为火", shangGua: "离", xiaGua: "离", binary: "101101" },
  { index: 31, name: "泽山咸", shangGua: "兑", xiaGua: "艮", binary: "110001" },
  { index: 32, name: "雷风恒", shangGua: "震", xiaGua: "巽", binary: "100011" },
  { index: 33, name: "天山遁", shangGua: "乾", xiaGua: "艮", binary: "111001" },
  { index: 34, name: "雷天大壮", shangGua: "震", xiaGua: "乾", binary: "100111" },
  { index: 35, name: "火地晋", shangGua: "离", xiaGua: "坤", binary: "101000" },
  { index: 36, name: "地火明夷", shangGua: "坤", xiaGua: "离", binary: "000101" },
  { index: 37, name: "风火家人", shangGua: "巽", xiaGua: "离", binary: "011101" },
  { index: 38, name: "火泽睽", shangGua: "离", xiaGua: "兑", binary: "101110" },
  { index: 39, name: "水山蹇", shangGua: "坎", xiaGua: "艮", binary: "010001" },
  { index: 40, name: "雷水解", shangGua: "震", xiaGua: "坎", binary: "100010" },
  { index: 41, name: "山泽损", shangGua: "艮", xiaGua: "兑", binary: "001110" },
  { index: 42, name: "风雷益", shangGua: "巽", xiaGua: "震", binary: "011100" },
  { index: 43, name: "泽天夬", shangGua: "兑", xiaGua: "乾", binary: "110111" },
  { index: 44, name: "天风姤", shangGua: "乾", xiaGua: "巽", binary: "111011" },
  { index: 45, name: "泽地萃", shangGua: "兑", xiaGua: "坤", binary: "110000" },
  { index: 46, name: "地风升", shangGua: "坤", xiaGua: "巽", binary: "000011" },
  { index: 47, name: "泽水困", shangGua: "兑", xiaGua: "坎", binary: "110010" },
  { index: 48, name: "水风井", shangGua: "坎", xiaGua: "巽", binary: "010011" },
  { index: 49, name: "泽火革", shangGua: "兑", xiaGua: "离", binary: "110101" },
  { index: 50, name: "火风鼎", shangGua: "离", xiaGua: "巽", binary: "101011" },
  { index: 51, name: "震为雷", shangGua: "震", xiaGua: "震", binary: "100100" },
  { index: 52, name: "艮为山", shangGua: "艮", xiaGua: "艮", binary: "001001" },
  { index: 53, name: "风山渐", shangGua: "巽", xiaGua: "艮", binary: "011001" },
  { index: 54, name: "雷泽归妹", shangGua: "震", xiaGua: "兑", binary: "100110" },
  { index: 55, name: "雷火丰", shangGua: "震", xiaGua: "离", binary: "100101" },
  { index: 56, name: "火山旅", shangGua: "离", xiaGua: "艮", binary: "101001" },
  { index: 57, name: "巽为风", shangGua: "巽", xiaGua: "巽", binary: "011011" },
  { index: 58, name: "兑为泽", shangGua: "兑", xiaGua: "兑", binary: "110110" },
  { index: 59, name: "风水涣", shangGua: "巽", xiaGua: "坎", binary: "011010" },
  { index: 60, name: "水泽节", shangGua: "坎", xiaGua: "兑", binary: "010110" },
  { index: 61, name: "风泽中孚", shangGua: "巽", xiaGua: "兑", binary: "011110" },
  { index: 62, name: "雷山小过", shangGua: "震", xiaGua: "艮", binary: "100001" },
  { index: 63, name: "水火既济", shangGua: "坎", xiaGua: "离", binary: "010101" },
  { index: 64, name: "火水未济", shangGua: "离", xiaGua: "坎", binary: "101010" }
];

// 五行生克
export const WUXING_SHENG: Record<Wuxing, Wuxing> = {
  "木": "火", "火": "土", "土": "金", "金": "水", "水": "木"
};

export const WUXING_KE: Record<Wuxing, Wuxing> = {
  "木": "土", "土": "水", "水": "火", "火": "金", "金": "木"
};

// 十二时辰
export const SHICHEN_TABLE: [Dizhi, number, number][] = [
  ["子", 23, 1], ["丑", 1, 3], ["寅", 3, 5], ["卯", 5, 7],
  ["辰", 7, 9], ["巳", 9, 11], ["午", 11, 13], ["未", 13, 15],
  ["申", 15, 17], ["酉", 17, 19], ["戌", 19, 21], ["亥", 21, 23]
];
