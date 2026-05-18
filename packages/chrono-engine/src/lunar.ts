import { LUNAR_INFO, LUNAR_MONTHS, LUNAR_DAYS, ZODIAC } from './constants';
import { getYearGanZhi, getMonthGanZhi, getDayGanZhi, getHourGanZhi } from './ganzhi';
import { Tiangan, Dizhi } from './types';

const BASE_YEAR = 1900;
const BASE_MONTH = 1;
const BASE_DAY = 31;
const BASE_LUNAR_YEAR = 1899;
const BASE_LUNAR_MONTH = 11;
const BASE_LUNAR_DAY = 1;

/**
 * 获取农历某年的总天数
 */
function getLunarYearDays(year: number): number {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (LUNAR_INFO[year - BASE_YEAR] & i) ? 1 : 0;
  }
  return sum + getLeapMonthDays(year);
}

/**
 * 获取农历某年闰月的天数
 */
function getLeapMonthDays(year: number): number {
  if (getLeapMonth(year)) {
    return (LUNAR_INFO[year - BASE_YEAR] & 0x10000) ? 30 : 29;
  }
  return 0;
}

/**
 * 获取农历某年的闰月月份，无闰月返回0
 */
function getLeapMonth(year: number): number {
  return LUNAR_INFO[year - BASE_YEAR] & 0xf;
}

/**
 * 获取农历某年某月的天数
 */
function getLunarMonthDays(year: number, month: number): number {
  return (LUNAR_INFO[year - BASE_YEAR] & (0x10000 >> month)) ? 30 : 29;
}

/**
 * 公历转农历
 */
export function solarToLunar(year: number, month: number, day: number) {
  let baseDate = new Date(BASE_YEAR, BASE_MONTH - 1, BASE_DAY);
  let objDate = new Date(year, month - 1, day);
  let offset = Math.floor((objDate.getTime() - baseDate.getTime()) / 86400000);
  
  let temp = 0;
  let lunarYear = BASE_LUNAR_YEAR;
  let lunarMonth = BASE_LUNAR_MONTH;
  let lunarDay = BASE_LUNAR_DAY + offset;
  
  while (lunarDay > (temp = getLunarYearDays(lunarYear))) {
    lunarDay -= temp;
    lunarYear++;
  }
  
  let leap = getLeapMonth(lunarYear);
  let isLeap = false;
  
  for (lunarMonth = 1; lunarMonth < 13; lunarMonth++) {
    let days = 0;
    if (leap > 0 && lunarMonth === (leap + 1) && !isLeap) {
      lunarMonth--;
      isLeap = true;
      days = getLeapMonthDays(lunarYear);
    } else {
      days = getLunarMonthDays(lunarYear, lunarMonth);
    }
    
    if (isLeap && lunarMonth === (leap + 1)) isLeap = false;
    
    if (lunarDay <= days) break;
    lunarDay -= days;
  }
  
  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeapMonth: isLeap
  };
}

/**
 * 获取生肖
 */
export function getZodiac(year: number): string {
  return ZODIAC[(year - 4) % 12];
}

/**
 * 获取农历月份名称
 */
export function getLunarMonthName(month: number, isLeap: boolean = false): string {
  return (isLeap ? '闰' : '') + LUNAR_MONTHS[month - 1];
}

/**
 * 获取农历日期名称
 */
export function getLunarDayName(day: number): string {
  return LUNAR_DAYS[day - 1];
}

/**
 * 根据时辰获取时辰索引（0-11）
 */
export function getHourIndex(hour: number): number {
  if (hour >= 23 || hour < 1) return 0; // 子时
  return Math.floor((hour - 1) / 2) + 1;
}
