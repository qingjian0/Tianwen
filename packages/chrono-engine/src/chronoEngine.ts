import { ChronoData, Coordinates, Dizhi, Jiuxing } from './types';
import { 
  SHICHEN_MAP, 
  DIZHI, 
  JIUXING,
  DIZHI_INDEX 
} from './constants';
import { 
  getYearGanZhi, 
  getMonthGanZhi, 
  getDayGanZhi, 
  getHourGanZhi,
  getXunKong 
} from './ganzhi';
import { 
  solarToLunar, 
  getZodiac, 
  getLunarMonthName, 
  getLunarDayName,
  getHourIndex 
} from './lunar';
import { getCurrentJieqi } from './jieqi';

/**
 * 天问 Chrono Engine - 东方时空认知系统核心引擎
 * 整合干支、农历、节气、时辰、五运六气等信息
 */
export class ChronoEngine {
  private date: Date;
  private coordinates?: Coordinates;

  constructor(date?: Date, coordinates?: Coordinates) {
    this.date = date || new Date();
    this.coordinates = coordinates;
  }

  /**
   * 设置时间
   */
  setDate(date: Date): void {
    this.date = date;
  }

  /**
   * 获取当前时间
   */
  getDate(): Date {
    return this.date;
  }

  /**
   * 计算完整的时空信息
   */
  calculate(): ChronoData {
    const year = this.date.getFullYear();
    const month = this.date.getMonth() + 1;
    const day = this.date.getDate();
    const hour = this.date.getHours();
    const minute = this.date.getMinutes();
    const second = this.date.getSeconds();

    // 1. 公历信息
    const gregorian = {
      year,
      month,
      day,
      hour,
      minute,
      second,
      timestamp: this.date.getTime(),
      dateString: this.date.toISOString()
    };

    // 2. 农历信息
    const lunarInfo = solarToLunar(year, month, day);
    const yearGanZhi = getYearGanZhi(lunarInfo.year);
    const monthGanZhi = getMonthGanZhi(yearGanZhi.gan, lunarInfo.month);
    const dayGanZhi = getDayGanZhi(year, month, day);
    const hourIndex = getHourIndex(hour);
    const hourGanZhi = getHourGanZhi(dayGanZhi.gan, hourIndex);

    const lunar = {
      year: lunarInfo.year,
      month: lunarInfo.month,
      day: lunarInfo.day,
      isLeapMonth: lunarInfo.isLeapMonth,
      yearGanZhi: yearGanZhi.full,
      monthGanZhi: monthGanZhi.full,
      dayGanZhi: dayGanZhi.full,
      hourGanZhi: hourGanZhi.full,
      zodiac: getZodiac(lunarInfo.year),
      lunarMonthName: getLunarMonthName(lunarInfo.month, lunarInfo.isLeapMonth),
      lunarDayName: getLunarDayName(lunarInfo.day)
    };

    // 3. 节气信息
    const jieqi = getCurrentJieqi(this.date);

    // 4. 干支系统
    const ganzhi = {
      year: yearGanZhi,
      month: monthGanZhi,
      day: dayGanZhi,
      hour: hourGanZhi
    };

    // 5. 时辰信息
    const shichen = SHICHEN_MAP[hourIndex];

    // 6. 特殊信息（太岁、月建、旬空、九星等）
    const taisui = DIZHI[(lunarInfo.year - 4) % 12];
    const yuejian = DIZHI[(lunarInfo.month + 1) % 12]; // 寅为正月
    const xunKong = getXunKong(dayGanZhi.full);
    const jiuxing = this.calculateJiuxing(ganzhi);

    const special = {
      taisui,
      yuejian,
      xunKong,
      jiuxing
    };

    return {
      gregorian,
      lunar,
      jieqi,
      ganzhi,
      shichen,
      special
    };
  }

  /**
   * 计算值星（简化版）
   */
  private calculateJiuxing(ganzhi: ChronoData['ganzhi']): Jiuxing {
    // 简化算法：根据日干支计算
    const dayZhiIndex = DIZHI_INDEX[ganzhi.day.zhi] - 1;
    const jiuxingIndex = (dayZhiIndex + 3) % 9;
    return JIUXING[jiuxingIndex];
  }

  /**
   * 获取当前时间的时空信息（静态方法）
   */
  static now(coordinates?: Coordinates): ChronoData {
    const engine = new ChronoEngine(new Date(), coordinates);
    return engine.calculate();
  }

  /**
   * 获取指定时间的时空信息（静态方法）
   */
  static at(date: Date, coordinates?: Coordinates): ChronoData {
    const engine = new ChronoEngine(date, coordinates);
    return engine.calculate();
  }
}

export default ChronoEngine;
