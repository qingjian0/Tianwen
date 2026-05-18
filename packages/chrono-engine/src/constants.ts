import { Tiangan, Dizhi, Jieqi, Jiazi, Wuxing, Bagua, Jiuxing, Bamen, Bashen } from './types';

// 十天干
export const TIANGAN: Tiangan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 十二地支
export const DIZHI: Dizhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 十二生肖
export const ZODIAC: string[] = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 二十四节气
export const JIEQI: Jieqi[] = [
  '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
];

// 天干五行
export const TIANGAN_WUXING: Record<Tiangan, Wuxing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 地支五行
export const DIZHI_WUXING: Record<Dizhi, Wuxing> = {
  '子': '水', '亥': '水',
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '申': '金', '酉': '金',
  '辰': '土', '戌': '土', '丑': '土', '未': '土'
};

// 天干序数（甲=1）
export const TIANGAN_INDEX: Record<Tiangan, number> = {
  '甲': 1, '乙': 2, '丙': 3, '丁': 4, '戊': 5,
  '己': 6, '庚': 7, '辛': 8, '壬': 9, '癸': 10
};

// 地支序数（子=1）
export const DIZHI_INDEX: Record<Dizhi, number> = {
  '子': 1, '丑': 2, '寅': 3, '卯': 4, '辰': 5, '巳': 6,
  '午': 7, '未': 8, '申': 9, '酉': 10, '戌': 11, '亥': 12
};

// 时辰对应
export const SHICHEN_MAP: Array<{ name: string; dizhi: Dizhi; startHour: number; endHour: number }> = [
  { name: '子时', dizhi: '子', startHour: 23, endHour: 1 },
  { name: '丑时', dizhi: '丑', startHour: 1, endHour: 3 },
  { name: '寅时', dizhi: '寅', startHour: 3, endHour: 5 },
  { name: '卯时', dizhi: '卯', startHour: 5, endHour: 7 },
  { name: '辰时', dizhi: '辰', startHour: 7, endHour: 9 },
  { name: '巳时', dizhi: '巳', startHour: 9, endHour: 11 },
  { name: '午时', dizhi: '午', startHour: 11, endHour: 13 },
  { name: '未时', dizhi: '未', startHour: 13, endHour: 15 },
  { name: '申时', dizhi: '申', startHour: 15, endHour: 17 },
  { name: '酉时', dizhi: '酉', startHour: 17, endHour: 19 },
  { name: '戌时', dizhi: '戌', startHour: 19, endHour: 21 },
  { name: '亥时', dizhi: '亥', startHour: 21, endHour: 23 }
];

// 农历月份名称
export const LUNAR_MONTHS = ['正月', '二月', '三月', '四月', '五月', '六月',
                            '七月', '八月', '九月', '十月', '冬月', '腊月'];

// 农历日期名称
export const LUNAR_DAYS = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                          '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                          '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

// 六十甲子表
export function generateJiaziTable(): Jiazi[] {
  const jiazi: Jiazi[] = [];
  for (let i = 0; i < 60; i++) {
    jiazi.push(TIANGAN[i % 10] + DIZHI[i % 12]);
  }
  return jiazi;
}

export const JIAZI_TABLE = generateJiaziTable();

// 九星
export const JIUXING: Jiuxing[] = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英'];

// 八门
export const BAMEN: Bamen[] = ['休门', '死门', '伤门', '杜门', '开门', '惊门', '生门', '景门'];

// 八神
export const BASHEN: Bashen[] = ['值符', '螣蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];

// 八卦
export const BAGUA: Bagua[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'];

// 八卦序数
export const BAGUA_INDEX: Record<Bagua, number> = {
  '乾': 1, '兑': 2, '离': 3, '震': 4, '巽': 5, '坎': 6, '艮': 7, '坤': 8
};

// 八卦五行
export const BAGUA_WUXING: Record<Bagua, Wuxing> = {
  '乾': '金', '兑': '金',
  '离': '火',
  '震': '木', '巽': '木',
  '坎': '水',
  '艮': '土', '坤': '土'
};

// 1900-2100年农历数据（简化版）
export const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63
];
