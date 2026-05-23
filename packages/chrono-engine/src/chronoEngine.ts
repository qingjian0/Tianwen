import { ChronoData, Coordinates, Dizhi, Jiuxing } from "./types";
import { SHICHEN_MAP, DIZHI, JIUXING, DIZHI_INDEX } from "./constants";
import {
  getYearGanZhi,
  getMonthGanZhi,
  getDayGanZhi,
  getHourGanZhi,
  getXunKong,
} from "./ganzhi";
import {
  solarToLunar,
  getZodiac,
  getLunarMonthName,
  getLunarDayName,
  getHourIndex,
} from "./lunar";
import { getCurrentJieqi } from "./jieqi";

/**
 * 天问 Chrono Engine - 东方时空认知系统核心引擎
 * 整合干支、农历、节气、时辰、五运六气等信息
 */
export class ChronoEngine {
  private date: Date;
  private coordinates?: Coordinates;
  private useTrueSun: boolean;

  constructor(
    date?: Date,
    coordinates?: Coordinates,
    useTrueSun: boolean = false,
  ) {
    this.date = date || new Date();
    this.coordinates = coordinates;
    this.useTrueSun = useTrueSun;
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
   * 设置是否使用真太阳时
   */
  setUseTrueSun(use: boolean): void {
    this.useTrueSun = use;
  }

  /**
   * 设置经纬度坐标
   */
  setCoordinates(coordinates: Coordinates): void {
    this.coordinates = coordinates;
  }

  /**
   * 计算真太阳时
   * 算法：根据经纬度计算真太阳时，考虑真太阳时和平太阳时的差异
   */
  private calculateTrueSunTime(): Date {
    if (!this.coordinates || !this.useTrueSun) {
      return this.date;
    }

    const { longitude, latitude } = this.coordinates;

    // 1. 计算平太阳时
    let hours =
      this.date.getHours() +
      this.date.getMinutes() / 60 +
      this.date.getSeconds() / 3600;

    // 2. 计算时区差异（以东经120度为基准）
    const timezoneOffset = (longitude - 120) * 4; // 每度4分钟
    hours += timezoneOffset / 60;

    // 3. 计算真太阳时差值（简化的均时差算法）
    const dayOfYear = this.getDayOfYear(this.date);
    const B = (2 * Math.PI * (dayOfYear - 81)) / 365;
    const equationOfTime =
      9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    hours += equationOfTime / 60;

    // 4. 确保小时在合理范围内
    while (hours < 0) hours += 24;
    while (hours >= 24) hours -= 24;

    // 5. 创建新的Date对象
    const result = new Date(this.date);
    result.setHours(Math.floor(hours));
    result.setMinutes(Math.floor((hours % 1) * 60));
    result.setSeconds(Math.floor((((hours % 1) * 60) % 1) * 60));

    return result;
  }

  /**
   * 获取一年中的第几天
   */
  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  /**
   * 计算完整的时空信息
   */
  calculate(): ChronoData {
    // 计算使用的时间（真太阳时或平太阳时）
    const workingDate = this.calculateTrueSunTime();

    const year = workingDate.getFullYear();
    const month = workingDate.getMonth() + 1;
    const day = workingDate.getDate();
    const hour = workingDate.getHours();
    const minute = workingDate.getMinutes();
    const second = workingDate.getSeconds();

    // 1. 公历信息
    const gregorian = {
      year,
      month,
      day,
      hour,
      minute,
      second,
      timestamp: workingDate.getTime(),
      dateString: workingDate.toISOString(),
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
      lunarDayName: getLunarDayName(lunarInfo.day),
    };

    // 3. 节气信息
    const jieqi = getCurrentJieqi(workingDate);

    // 4. 干支系统
    const ganzhi = {
      year: yearGanZhi,
      month: monthGanZhi,
      day: dayGanZhi,
      hour: hourGanZhi,
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
      jiuxing,
    };

    return {
      gregorian,
      lunar,
      jieqi,
      ganzhi,
      shichen,
      special,
      coordinates: this.coordinates,
      useTrueSun: this.useTrueSun,
      trueSunTime: this.useTrueSun ? workingDate : undefined,
    };
  }

  /**
   * 计算值星（简化版）
   */
  private calculateJiuxing(ganzhi: ChronoData["ganzhi"]): Jiuxing {
    // 简化算法：根据日干支计算
    const dayZhiIndex = DIZHI_INDEX[ganzhi.day.zhi] - 1;
    const jiuxingIndex = (dayZhiIndex + 3) % 9;
    return JIUXING[jiuxingIndex];
  }

  /**
   * 获取当前时间的时空信息（静态方法）
   */
  static now(
    coordinates?: Coordinates,
    useTrueSun: boolean = false,
  ): ChronoData {
    const engine = new ChronoEngine(new Date(), coordinates, useTrueSun);
    return engine.calculate();
  }

  /**
   * 获取指定时间的时空信息（静态方法）
   */
  static at(
    date: Date,
    coordinates?: Coordinates,
    useTrueSun: boolean = false,
  ): ChronoData {
    const engine = new ChronoEngine(date, coordinates, useTrueSun);
    return engine.calculate();
  }
}

export default ChronoEngine;
