import {
  Bagua,
  DateInfo,
  DivinationMethod,
  MeihuaResult
} from "./types";
import {
  getYearGanZhi,
  getMonthGanZhi,
  getShichen,
  getXunKong,
  getBaguaByNumber,
  generateBinary,
  generateLiuShiSiGua,
  calculateHuGua,
  calculateBianGua,
  calculateCuoGua,
  calculateZongGua,
  calculateTiYong
} from "./utils";
import { solarToLunar } from "./lunar";

export class MeihuaEngine {
  // 时间起卦（梅花易数标准算法）
  static divinateByTime(date?: Date): MeihuaResult {
    const targetDate = date || new Date();
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();
    const hour = targetDate.getHours();

    // 转换为农历
    const lunar = solarToLunar(year, month, day);

    // 获取农历年月日地支序数
    // 注意：梅花易数时间起卦常用以下几种算法：
    // 1. 年支序数 + 农历月 + 农历日 = 上卦
    // 2. 年支序数 + 农历月 + 农历日 + 时辰序数 = 下卦
    // 3. 年支序数 + 农历月 + 农历日 + 时辰序数 = 动爻

    // 年地支序数（子=1，丑=2，...亥=12）
    const yearGanZhi = getYearGanZhi(lunar.year);
    const yearZhi = yearGanZhi.zhi;
    const yearZhiList = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    const yearZhiNum = yearZhiList.indexOf(yearZhi) + 1;

    // 时辰序数
    const shichen = getShichen(hour);
    const hourNum = yearZhiList.indexOf(shichen) + 1;

    // 上卦：(年 + 月 + 日) % 8
    let shangNum = (yearZhiNum + lunar.month + lunar.day) % 8;
    if (shangNum === 0) shangNum = 8;

    // 下卦：(年 + 月 + 日 + 时) % 8
    let xiaNum = (yearZhiNum + lunar.month + lunar.day + hourNum) % 8;
    if (xiaNum === 0) xiaNum = 8;

    // 动爻：(年 + 月 + 日 + 时) % 6
    let dongYao = (yearZhiNum + lunar.month + lunar.day + hourNum) % 6;
    if (dongYao === 0) dongYao = 6;

    const shangGua = getBaguaByNumber(shangNum);
    const xiaGua = getBaguaByNumber(xiaNum);

    return this.buildResult(
      "time",
      shangGua,
      xiaGua,
      [dongYao],
      {
        year,
        month,
        day,
        hour,
        lunarYear: lunar.year,
        lunarMonth: lunar.month,
        lunarDay: lunar.day,
        yearGanZhi: yearGanZhi.full,
        monthGanZhi: getMonthGanZhi(yearGanZhi.gan, lunar.month).full,
        dayGanZhi: "",
        hourGanZhi: "",
        shichen,
        xunKong: getXunKong(yearGanZhi.full)
      }
    );
  }

  // 单数字起卦
  static divinateBySingleNumber(num: number): MeihuaResult {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const lunar = solarToLunar(year, month, day);
    const yearGanZhi = getYearGanZhi(lunar.year);
    const shichen = getShichen(hour);
    const yearZhiList = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    const hourNum = yearZhiList.indexOf(shichen) + 1;

    let shangNum, xiaNum, dongYao;
    const numStr = num.toString();

    if (numStr.length === 1) {
      // 一位数：上卦为数字，下卦为数字+时辰
      shangNum = num % 8 || 8;
      xiaNum = (num + hourNum) % 8 || 8;
      dongYao = (num + hourNum) % 6 || 6;
    } else {
      // 多位数：前半为上卦，后半为下卦，全体为动爻
      const mid = Math.floor(numStr.length / 2);
      const shangStr = numStr.substring(0, mid);
      const xiaStr = numStr.substring(mid);

      shangNum = parseInt(shangStr) % 8 || 8;
      xiaNum = parseInt(xiaStr) % 8 || 8;
      dongYao = num % 6 || 6;
    }

    const shangGua = getBaguaByNumber(shangNum);
    const xiaGua = getBaguaByNumber(xiaNum);

    return this.buildResult("number", shangGua, xiaGua, [dongYao], {
      year,
      month,
      day,
      hour,
      lunarYear: lunar.year,
      lunarMonth: lunar.month,
      lunarDay: lunar.day,
      yearGanZhi: yearGanZhi.full,
      monthGanZhi: getMonthGanZhi(yearGanZhi.gan, lunar.month).full,
      dayGanZhi: "",
      hourGanZhi: "",
      shichen,
      xunKong: getXunKong(yearGanZhi.full)
    });
  }

  // 双数字起卦
  static divinateByDoubleNumber(num1: number, num2: number): MeihuaResult {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const lunar = solarToLunar(year, month, day);
    const yearGanZhi = getYearGanZhi(lunar.year);
    const shichen = getShichen(hour);
    const yearZhiList = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    const hourNum = yearZhiList.indexOf(shichen) + 1;

    const shangGua = getBaguaByNumber(num1 % 8 || 8);
    const xiaGua = getBaguaByNumber(num2 % 8 || 8);
    const dongYao = (num1 + num2 + hourNum) % 6 || 6;

    return this.buildResult("number2", shangGua, xiaGua, [dongYao], {
      year,
      month,
      day,
      hour,
      lunarYear: lunar.year,
      lunarMonth: lunar.month,
      lunarDay: lunar.day,
      yearGanZhi: yearGanZhi.full,
      monthGanZhi: getMonthGanZhi(yearGanZhi.gan, lunar.month).full,
      dayGanZhi: "",
      hourGanZhi: "",
      shichen,
      xunKong: getXunKong(yearGanZhi.full)
    });
  }

  // 三数字起卦
  static divinateByTripleNumber(num1: number, num2: number, num3: number): MeihuaResult {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const lunar = solarToLunar(year, month, day);
    const yearGanZhi = getYearGanZhi(lunar.year);
    const shichen = getShichen(hour);

    const shangGua = getBaguaByNumber(num1 % 8 || 8);
    const xiaGua = getBaguaByNumber(num2 % 8 || 8);
    const dongYao = num3 % 6 || 6;

    return this.buildResult("number3", shangGua, xiaGua, [dongYao], {
      year,
      month,
      day,
      hour,
      lunarYear: lunar.year,
      lunarMonth: lunar.month,
      lunarDay: lunar.day,
      yearGanZhi: yearGanZhi.full,
      monthGanZhi: getMonthGanZhi(yearGanZhi.gan, lunar.month).full,
      dayGanZhi: "",
      hourGanZhi: "",
      shichen,
      xunKong: getXunKong(yearGanZhi.full)
    });
  }

  // 随机起卦
  static divinateByRandom(): MeihuaResult {
    const num1 = this.getRandomNumber(1, 8);
    const num2 = this.getRandomNumber(1, 8);
    const num3 = this.getRandomNumber(1, 6);
    return this.divinateByTripleNumber(num1, num2, num3);
  }

  // 铜钱起卦
  static divinateByCoin(coinResults: number[]): MeihuaResult {
    if (coinResults.length !== 6) {
      throw new Error("铜钱起卦需要6次结果");
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const lunar = solarToLunar(year, month, day);
    const yearGanZhi = getYearGanZhi(lunar.year);
    const shichen = getShichen(hour);

    let binary = "";
    const changingPositions: number[] = [];

    for (let i = 0; i < 6; i++) {
      const result = coinResults[i];
      if (result === 6 || result === 8) {
        binary += "0";
      } else {
        binary += "1";
      }

      if (result === 6 || result === 9) {
        changingPositions.push(i + 1);
      }
    }

    const shangBinary = binary.substring(0, 3);
    const xiaBinary = binary.substring(3, 6);

    const shangGua = this.findBaguaByBinary(shangBinary);
    const xiaGua = this.findBaguaByBinary(xiaBinary);

    if (!shangGua || !xiaGua) {
      throw new Error("八卦解析失败");
    }

    return this.buildResult("coin", shangGua, xiaGua, changingPositions, {
      year,
      month,
      day,
      hour,
      lunarYear: lunar.year,
      lunarMonth: lunar.month,
      lunarDay: lunar.day,
      yearGanZhi: yearGanZhi.full,
      monthGanZhi: getMonthGanZhi(yearGanZhi.gan, lunar.month).full,
      dayGanZhi: "",
      hourGanZhi: "",
      shichen,
      xunKong: getXunKong(yearGanZhi.full)
    }, binary);
  }

  // 手动起卦
  static divinateByManual(
    shangGua: Bagua,
    xiaGua: Bagua,
    dongYao?: number | number[]
  ): MeihuaResult {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const lunar = solarToLunar(year, month, day);
    const yearGanZhi = getYearGanZhi(lunar.year);
    const shichen = getShichen(hour);

    const dongYaoArray = Array.isArray(dongYao)
      ? dongYao
      : dongYao
        ? [dongYao]
        : [];

    return this.buildResult("manual", shangGua, xiaGua, dongYaoArray, {
      year,
      month,
      day,
      hour,
      lunarYear: lunar.year,
      lunarMonth: lunar.month,
      lunarDay: lunar.day,
      yearGanZhi: yearGanZhi.full,
      monthGanZhi: getMonthGanZhi(yearGanZhi.gan, lunar.month).full,
      dayGanZhi: "",
      hourGanZhi: "",
      shichen,
      xunKong: getXunKong(yearGanZhi.full)
    });
  }

  // 构建结果
  private static buildResult(
    method: DivinationMethod,
    shangGua: Bagua,
    xiaGua: Bagua,
    dongYaoPositions: number[],
    dateInfo?: DateInfo,
    customBinary?: string
  ): MeihuaResult {
    const binary = customBinary || generateBinary(shangGua, xiaGua);

    // 本卦
    const benGua = generateLiuShiSiGua(binary, dongYaoPositions);
    if (!benGua) {
      throw new Error("无法生成本卦");
    }

    // 互卦
    let huGua;
    const huInfo = calculateHuGua(binary);
    if (huInfo) {
      huGua = generateLiuShiSiGua(huInfo.binary, []);
    }

    // 变卦
    const bianBinary = calculateBianGua(binary, dongYaoPositions);
    const bianGua = generateLiuShiSiGua(bianBinary, []);

    // 错卦
    const cuoBinary = calculateCuoGua(binary);
    const cuoGua = generateLiuShiSiGua(cuoBinary, []);

    // 综卦
    const zongBinary = calculateZongGua(binary);
    const zongGua = generateLiuShiSiGua(zongBinary, []);

    // 体用
    const tiYong = calculateTiYong(shangGua, xiaGua, dongYaoPositions);

    return {
      method,
      benGua,
      huGua,
      bianGua,
      cuoGua,
      zongGua,
      dongYaoPositions,
      tiYong,
      dateInfo,
      interpretation: this.generateInterpretation(tiYong, dongYaoPositions, method)
    };
  }

  // 生成解读
  private static generateInterpretation(
    tiYong: any,
    dongYao: number[],
    method: DivinationMethod
  ): string {
    const methodNames: Record<DivinationMethod, string> = {
      time: "时间起卦",
      number: "单数字起卦",
      number2: "双数字起卦",
      number3: "三数字起卦",
      random: "随机起卦",
      coin: "铜钱起卦",
      manual: "手动起卦",
      image: "图像取象"
    };

    const relationText: Record<string, string> = {
      bihe: "比和，诸事顺遂，易达成目标",
      yongshengti: "用生体，得助力，易成功",
      tishengyong: "体生用，有损耗，需付出",
      ke: "体克用，可成功，但需努力",
      sheng: "用克体，受阻，需谨慎"
    };

    const dongYaoText = dongYao.length > 0
      ? `动爻：第${dongYao.join("、")}爻，动则有变，需结合变卦分析`
      : "无动爻，以本卦为主，卦象相对稳定";

    return `起卦方式：${methodNames[method]}
体用关系：${relationText[tiYong.relation]}
${dongYaoText}
体卦：${tiYong.ti}(${tiYong.tiWuxing})，用卦：${tiYong.yong}(${tiYong.yongWuxing})`;
  }

  private static getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static findBaguaByBinary(binary: string): Bagua | null {
    const baguaInfo: Record<string, Bagua> = {
      "111": "乾", "110": "兑", "101": "离", "100": "震",
      "011": "巽", "010": "坎", "001": "艮", "000": "坤"
    };
    return baguaInfo[binary] || null;
  }
}
