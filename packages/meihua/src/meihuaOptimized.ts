
import { ChronoEngineOptimized, Coordinates } from "@tianwen/chrono-engine";
import {
  DivinationMethod,
  MeihuaResult,
  Yao,
  Guaxiang,
  MeihuaConfig,
} from "./types";
import { BAGUA_INFO, BAGUA_BY_INDEX } from "./constants";
import {
  getBaguaByNumber,
  generateYao,
  generateBinary,
  calculateHuGua,
  calculateBianGua,
  calculateCuoGua,
  calculateZongGua,
  calculateTiYong,
  findLiuShiSiGua,
} from "./utils";

/**
 * 优化版梅花易数核心引擎
 * - 使用 ChronoEngineOptimized 进行优化
 * - 添加 LRU 缓存
 * - 提升性能
 */
export class MeihuaEngineOptimized {
  private config: MeihuaConfig;
  
  // 缓存机制
  private static cache: Map<string, MeihuaResult> = new Map();
  private static cacheOrder: string[] = [];
  private static readonly MAX_CACHE_SIZE = 200;

  constructor(config?: MeihuaConfig) {
    this.config = config || {
      useTrueSun: false,
      addShichen: true,
    };
  }

  /**
   * 清空缓存
   */
  static clearCache(): void {
    MeihuaEngineOptimized.cache.clear();
    MeihuaEngineOptimized.cacheOrder = [];
  }

  /**
   * 获取缓存键
   */
  private getCacheKey(method: DivinationMethod, params: any): string {
    return `${method}-${JSON.stringify(params)}`;
  }

  /**
   * 从缓存获取
   */
  private getFromCache(key: string): MeihuaResult | null {
    const value = MeihuaEngineOptimized.cache.get(key);
    if (!value) return null;

    // 更新访问顺序
    const index = MeihuaEngineOptimized.cacheOrder.indexOf(key);
    if (index > -1) {
      MeihuaEngineOptimized.cacheOrder.splice(index, 1);
      MeihuaEngineOptimized.cacheOrder.push(key);
    }
    return value;
  }

  /**
   * 设置缓存
   */
  private setCache(key: string, value: MeihuaResult): void {
    if (MeihuaEngineOptimized.cache.has(key)) {
      const index = MeihuaEngineOptimized.cacheOrder.indexOf(key);
      if (index > -1) {
        MeihuaEngineOptimized.cacheOrder.splice(index, 1);
      }
    }

    if (MeihuaEngineOptimized.cache.size >= MeihuaEngineOptimized.MAX_CACHE_SIZE) {
      const oldestKey = MeihuaEngineOptimized.cacheOrder.shift();
      if (oldestKey) {
        MeihuaEngineOptimized.cache.delete(oldestKey);
      }
    }

    MeihuaEngineOptimized.cache.set(key, value);
    MeihuaEngineOptimized.cacheOrder.push(key);
  }

  /**
   * 设置配置
   */
  setConfig(config: MeihuaConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 时间起卦 (优化版)
   */
  divinateByTime(date?: Date): MeihuaResult {
    const cacheKey = this.getCacheKey("time", { 
      date: date?.getTime() || Date.now(),
      config: this.config 
    });
    
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const time = date || new Date();
    const chrono = ChronoEngineOptimized.at(
      time,
      this.config.coordinates,
      this.config.useTrueSun,
    );

    const lunar = chrono.lunar;
    const yearIndex = (lunar.year - 4) % 12;
    const month = lunar.month;
    const day = lunar.day;
    const hour = this.getHourIndex(chrono.shichen.dizhi);

    // 上卦：(年+月+日) % 8
    let shangNum = (yearIndex + month + day) % 8;
    shangNum = shangNum === 0 ? 8 : shangNum;
    const shangGua = getBaguaByNumber(shangNum);

    // 下卦：(年+月+日+时) % 8 (如果加时辰开关开启)
    let xiaNum;
    if (this.config.addShichen) {
      xiaNum = (yearIndex + month + day + hour) % 8;
    } else {
      xiaNum = (yearIndex + month + day) % 8;
    }
    xiaNum = xiaNum === 0 ? 8 : xiaNum;
    const xiaGua = getBaguaByNumber(xiaNum);

    // 动爻：(年+月+日+时) % 6 (如果加时辰开关开启)
    let dongYao;
    if (this.config.addShichen) {
      dongYao = (yearIndex + month + day + hour) % 6;
    } else {
      dongYao = (yearIndex + month + day) % 6;
    }
    if (dongYao === 0) dongYao = 6;

    const result = this.buildResult(
      "time",
      shangGua,
      xiaGua,
      [dongYao],
      undefined,
      chrono,
    );
    
    this.setCache(cacheKey, result);
    return result;
  }

  /**
   * 单数字起卦 (优化版)
   */
  divinateBySingleNumber(num: number): MeihuaResult {
    const cacheKey = this.getCacheKey("number", { num, config: this.config });
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    let shangNum, xiaNum, dongYao;

    const numStr = num.toString();
    if (numStr.length === 1) {
      const chrono = ChronoEngineOptimized.now(
        this.config.coordinates,
        this.config.useTrueSun,
      );
      const hour = this.getHourIndex(chrono.shichen.dizhi);
      shangNum = num % 8 || 8;
      xiaNum = (num + hour) % 8 || 8;
      dongYao = (num + hour) % 6 || 6;
    } else {
      const mid = Math.floor(numStr.length / 2);
      const shangStr = numStr.substring(0, mid);
      const xiaStr = numStr.substring(mid);

      shangNum = parseInt(shangStr) % 8 || 8;
      xiaNum = parseInt(xiaStr) % 8 || 8;
      dongYao = num % 6 || 6;
    }

    const shangGua = getBaguaByNumber(shangNum);
    const xiaGua = getBaguaByNumber(xiaNum);

    const result = this.buildResult("number", shangGua, xiaGua, [dongYao]);
    this.setCache(cacheKey, result);
    return result;
  }

  /**
   * 双数字起卦 (优化版)
   */
  divinateByDoubleNumber(num1: number, num2: number): MeihuaResult {
    const cacheKey = this.getCacheKey("number2", { num1, num2, config: this.config });
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const shangGua = getBaguaByNumber(num1 % 8 || 8);
    const xiaGua = getBaguaByNumber(num2 % 8 || 8);

    let dongYao;
    if (this.config.addShichen) {
      const chrono = ChronoEngineOptimized.now(
        this.config.coordinates,
        this.config.useTrueSun,
      );
      const hour = this.getHourIndex(chrono.shichen.dizhi);
      dongYao = (num1 + num2 + hour) % 6 || 6;
    } else {
      dongYao = (num1 + num2) % 6 || 6;
    }

    const result = this.buildResult("number2", shangGua, xiaGua, [dongYao]);
    this.setCache(cacheKey, result);
    return result;
  }

  /**
   * 三数字起卦 (优化版)
   */
  divinateByTripleNumber(
    num1: number,
    num2: number,
    num3: number,
  ): MeihuaResult {
    const cacheKey = this.getCacheKey("number3", { num1, num2, num3, config: this.config });
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const shangGua = getBaguaByNumber(num1 % 8 || 8);
    const xiaGua = getBaguaByNumber(num2 % 8 || 8);
    const dongYao = num3 % 6 || 6;

    const result = this.buildResult("number3", shangGua, xiaGua, [dongYao]);
    this.setCache(cacheKey, result);
    return result;
  }

  /**
   * 随机起卦
   */
  divinateByRandom(): MeihuaResult {
    const shangGua = getBaguaByNumber(this.getRandomNumber(1, 8));
    const xiaGua = getBaguaByNumber(this.getRandomNumber(1, 8));
    const dongYao = this.getRandomNumber(1, 6);

    return this.buildResult("random", shangGua, xiaGua, [dongYao]);
  }

  /**
   * 铜钱起卦（六次）
   */
  divinateByCoin(coinResults: number[]): MeihuaResult {
    if (coinResults.length !== 6) {
      throw new Error("铜钱起卦需要6次结果");
    }

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

    return this.buildResult(
      "coin",
      shangGua,
      xiaGua,
      changingPositions,
      binary,
    );
  }

  /**
   * 手动起卦
   */
  divinateByManual(
    shangGua: string,
    xiaGua: string,
    dongYao?: number | number[],
  ): MeihuaResult {
    const dongYaoArray = Array.isArray(dongYao)
      ? dongYao
      : dongYao
        ? [dongYao]
        : [];
    return this.buildResult(
      "manual",
      shangGua as any,
      xiaGua as any,
      dongYaoArray,
    );
  }

  /**
   * 构建完整结果
   */
  private buildResult(
    method: DivinationMethod,
    shangGua: any,
    xiaGua: any,
    dongYaoPositions: number[],
    customBinary?: string,
    customChrono?: any,
  ): MeihuaResult {
    const binary = customBinary || generateBinary(shangGua, xiaGua);
    const chrono =
      customChrono ||
      ChronoEngineOptimized.now(this.config.coordinates, this.config.useTrueSun);

    // 本卦
    const benGuaYao = generateYao(binary, dongYaoPositions);
    const benGua = {
      ...BAGUA_INFO[shangGua],
      yao: benGuaYao,
    };

    // 互卦
    let huGua;
    const huInfo = calculateHuGua(binary);
    if (huInfo) {
      const huBinary = generateBinary(huInfo.shangGua, huInfo.xiaGua);
      huGua = {
        ...BAGUA_INFO[huInfo.shangGua],
        yao: generateYao(huBinary),
      };
    }

    // 变卦
    const bianBinary = calculateBianGua(binary, dongYaoPositions);
    const bianShang = this.findBaguaByBinary(bianBinary.substring(0, 3));
    const bianXia = this.findBaguaByBinary(bianBinary.substring(3, 6));
    let bianGua;
    if (bianShang && bianXia) {
      bianGua = {
        ...BAGUA_INFO[bianShang],
        yao: generateYao(bianBinary),
      };
    }

    // 错卦
    const cuoBinary = calculateCuoGua(binary);
    const cuoShang = this.findBaguaByBinary(cuoBinary.substring(0, 3));
    const cuoXia = this.findBaguaByBinary(cuoBinary.substring(3, 6));
    let cuoGua;
    if (cuoShang && cuoXia) {
      cuoGua = BAGUA_INFO[cuoShang];
    }

    // 综卦
    const zongBinary = calculateZongGua(binary);
    const zongShang = this.findBaguaByBinary(zongBinary.substring(0, 3));
    const zongXia = this.findBaguaByBinary(zongBinary.substring(3, 6));
    let zongGua;
    if (zongShang && zongXia) {
      zongGua = BAGUA_INFO[zongShang];
    }

    // 体用
    const tiYong = calculateTiYong(shangGua, xiaGua, dongYaoPositions);

    return {
      method,
      config: this.config,
      chronoData: chrono,
      benGua: benGua as any,
      huGua: huGua as any,
      bianGua: bianGua as any,
      cuoGua,
      zongGua,
      dongYaoPositions,
      tiYong,
      interpretation: this.generateInterpretation(
        method,
        tiYong,
        dongYaoPositions,
      ),
    };
  }

  /**
   * 生成简单解读
   */
  private generateInterpretation(
    method: DivinationMethod,
    tiYong: any,
    dongYao: number[],
  ): string {
    const relationText: Record<string, string> = {
      bihe: "比和，诸事顺遂",
      yongshengti: "用生体，得助力",
      tishengyong: "体生用，有损耗",
      ke: "体克用，可成功",
      sheng: "用克体，需谨慎",
    };

    return `起卦方式：${this.getMethodText(method)}\n体用关系：${relationText[tiYong.relation] || "需详查"}\n动爻：${dongYao.join(", ") || "无"}`;
  }

  private getMethodText(method: DivinationMethod): string {
    const texts: Record<DivinationMethod, string> = {
      time: "时间起卦",
      number: "单数字起卦",
      number2: "双数字起卦",
      number3: "三数字起卦",
      random: "随机起卦",
      coin: "铜钱起卦",
      manual: "手动起卦",
      image: "图像取象",
    };
    return texts[method];
  }

  private getHourIndex(dizhi: string): number {
    const dizhiList = [
      "子",
      "丑",
      "寅",
      "卯",
      "辰",
      "巳",
      "午",
      "未",
      "申",
      "酉",
      "戌",
      "亥",
    ];
    return dizhiList.indexOf(dizhi) + 1;
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private findBaguaByBinary(binary: string): any {
    for (const [name, info] of Object.entries(BAGUA_INFO)) {
      if (info.binary === binary) {
        return name;
      }
    }
    return null;
  }
}

export default MeihuaEngineOptimized;
