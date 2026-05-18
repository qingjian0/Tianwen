import { TIANGAN, DIZHI, TIANGAN_INDEX, DIZHI_INDEX, JIAZI_TABLE } from './constants';
import { Tiangan, Dizhi, Jiazi } from './types';

/**
 * 根据年份获取年干支
 * @param year 公历年
 * @returns 年干支对象
 */
export function getYearGanZhi(year: number): { gan: Tiangan; zhi: Dizhi; full: Jiazi } {
  // 公元4年为甲子年
  const offset = year - 4;
  const ganIndex = (offset % 10 + 10) % 10;
  const zhiIndex = (offset % 12 + 12) % 12;
  return {
    gan: TIANGAN[ganIndex],
    zhi: DIZHI[zhiIndex],
    full: JIAZI_TABLE[(offset % 60 + 60) % 60]
  };
}

/**
 * 根据年干和月份获取月干支
 * @param yearGan 年干
 * @param month 农历月份（1-12）
 * @returns 月干支对象
 */
export function getMonthGanZhi(yearGan: Tiangan, month: number): { gan: Tiangan; zhi: Dizhi; full: Jiazi } {
  // 五虎遁诀
  const yearGanIndex = TIANGAN_INDEX[yearGan] - 1;
  let monthGanBase: number;
  
  switch (yearGanIndex) {
    case 0: case 5: // 甲己
      monthGanBase = 2; // 丙寅起
      break;
    case 1: case 6: // 乙庚
      monthGanBase = 4; // 戊寅起
      break;
    case 2: case 7: // 丙辛
      monthGanBase = 6; // 庚寅起
      break;
    case 3: case 8: // 丁壬
      monthGanBase = 8; // 壬寅起
      break;
    case 4: case 9: // 戊癸
      monthGanBase = 0; // 甲寅起
      break;
    default:
      monthGanBase = 2;
  }
  
  const ganIndex = (monthGanBase + month - 1) % 10;
  const zhiIndex = (month + 1) % 12; // 寅为正月（索引2）
  return {
    gan: TIANGAN[ganIndex],
    zhi: DIZHI[zhiIndex],
    full: TIANGAN[ganIndex] + DIZHI[zhiIndex]
  };
}

/**
 * 根据日期获取日干支
 * @param year 公历年
 * @param month 公历月
 * @param day 公历日
 * @returns 日干支对象
 */
export function getDayGanZhi(year: number, month: number, day: number): { gan: Tiangan; zhi: Dizhi; full: Jiazi } {
  // 使用简化算法计算日干支
  // 基准日期：1900年1月31日为甲午日（索引30）
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  const diffTime = targetDate.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const jiaziIndex = (30 + diffDays) % 60;
  const ganIndex = jiaziIndex % 10;
  const zhiIndex = jiaziIndex % 12;
  
  return {
    gan: TIANGAN[ganIndex],
    zhi: DIZHI[zhiIndex],
    full: JIAZI_TABLE[jiaziIndex]
  };
}

/**
 * 根据日干和时辰获取时干支
 * @param dayGan 日干
 * @param hourIndex 时辰索引（0-11，子时=0）
 * @returns 时干支对象
 */
export function getHourGanZhi(dayGan: Tiangan, hourIndex: number): { gan: Tiangan; zhi: Dizhi; full: Jiazi } {
  // 五鼠遁诀
  const dayGanIndex = TIANGAN_INDEX[dayGan] - 1;
  let hourGanBase: number;
  
  switch (dayGanIndex) {
    case 0: case 5: // 甲己
      hourGanBase = 0; // 甲子起
      break;
    case 1: case 6: // 乙庚
      hourGanBase = 2; // 丙子起
      break;
    case 2: case 7: // 丙辛
      hourGanBase = 4; // 戊子起
      break;
    case 3: case 8: // 丁壬
      hourGanBase = 6; // 庚子起
      break;
    case 4: case 9: // 戊癸
      hourGanBase = 8; // 壬子起
      break;
    default:
      hourGanBase = 0;
  }
  
  const ganIndex = (hourGanBase + hourIndex) % 10;
  const zhiIndex = hourIndex % 12;
  
  return {
    gan: TIANGAN[ganIndex],
    zhi: DIZHI[zhiIndex],
    full: TIANGAN[ganIndex] + DIZHI[zhiIndex]
  };
}

/**
 * 获取旬空
 * @param jiazi 干支
 * @returns 旬空地支
 */
export function getXunKong(jiazi: Jiazi): [Dizhi, Dizhi] | null {
  const index = JIAZI_TABLE.indexOf(jiazi);
  if (index === -1) return null;
  
  const xunStart = Math.floor(index / 10) * 10;
  const xunStartZhiIndex = xunStart % 12;
  const xunKong1 = DIZHI[(xunStartZhiIndex + 10) % 12];
  const xunKong2 = DIZHI[(xunStartZhiIndex + 11) % 12];
  
  return [xunKong1, xunKong2];
}
