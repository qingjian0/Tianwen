/**
 * 奇门遁甲核心引擎
 */

import {
  ChronoEngine,
  Tiangan,
  Dizhi,
  Wuxing,
  ChronoData,
  Coordinates,
} from "@tianwen/chrono-engine";
import {
  QimenResult,
  NinePalace,
  Palace,
  QimenPattern,
  QimenConfig,
  PanType,
  PanJuType,
  ZhiShiMethod,
} from "./types";
import {
  NINE_PALACE_POSITION,
  NINE_PALACE_WUXING,
  NINE_STARS,
  NINE_STARS_WUXING,
  NINE_STARS_LUCK,
  EIGHT_DOORS,
  EIGHT_DOORS_WUXING,
  EIGHT_DOORS_LUCK,
  EIGHT_DEITIES,
  EIGHT_DEITIES_WUXING,
  THREE_WONDERS,
  SIX_INSTRUMENTS,
  THREE_AND_SIX,
  YANG_DUN_LAYOUT,
  YIN_DUN_LAYOUT,
  DIZHI_LIUCHONG,
  DIZHI_LIUHE,
  SOLAR_TERMS_JU,
} from "./constants";

export class QimenEngine {
  private config: QimenConfig;

  constructor(config?: Partial<QimenConfig>) {
    this.config = {
      useTrueSun: false,
      includeDeity: true,
      includePatterns: true,
      panType: "chaibu",
      panJuType: "zhuan",
      zhiShiMethod: "men",
      ...config,
    };
  }

  /**
   * 设置配置
   */
  setConfig(config: QimenConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 起局
   */
  calculate(date: Date): QimenResult {
    const chronoData = ChronoEngine.at(
      date,
      this.config.coordinates,
      this.config.useTrueSun,
    );
    const { yinYang, ju } = this.calculateJu(chronoData);
    const xunKong = this.calculateXunKong(chronoData.ganzhi.day.full);

    const palaces = this.buildNinePalaces(
      yinYang,
      ju,
      chronoData.ganzhi.hour.gan,
      chronoData.ganzhi.hour.zhi,
      xunKong,
      this.config.panJuType || "zhuan",
    );

    const zhiFu = this.findZhiFu(palaces, chronoData.ganzhi.day.full);
    const zhiShi = this.findZhiShi(
      palaces,
      chronoData.ganzhi.day.full,
      ju,
      this.config.zhiShiMethod || "men",
    );
    const patterns = this.detectPatterns(palaces, zhiFu, zhiShi, chronoData);
    const luck = this.calculateLuck(palaces, zhiFu, zhiShi, patterns);

    return {
      type: "dunjia",
      ju,
      yinYang,
      panType: this.config.panType || "chaibu",
      panJuType: this.config.panJuType || "zhuan",
      zhiShiMethod: this.config.zhiShiMethod || "men",
      palaces,
      zhiFu,
      zhiShi,
      xunKong,
      patterns,
      chronoData,
      interpretation: this.generateInterpretation(luck, patterns),
      luck,
      config: this.config,
    };
  }

  /**
   * 计算局数
   */
  private calculateJu(chronoData: ChronoData): {
    yinYang: "阴" | "阳";
    ju: number;
  } {
    const jieqi = chronoData.jieqi;
    const solarTermInfo = SOLAR_TERMS_JU[jieqi] || { yang: 0, yin: 0 };

    let yinYang: "阴" | "阳" = "阳";
    let ju: number = 1;

    // 根据盘式计算局数
    if (this.config.panType === "chaibu") {
      // 拆补法：根据节气确定
      if (solarTermInfo.yang > 0) {
        yinYang = "阳";
        ju = solarTermInfo.yang;
      } else if (solarTermInfo.yin > 0) {
        yinYang = "阴";
        ju = solarTermInfo.yin;
      }
    } else if (this.config.panType === "zhirun") {
      // 置闰法：根据节气和日期确定
      if (solarTermInfo.yang > 0) {
        yinYang = "阳";
        ju = solarTermInfo.yang;
      } else if (solarTermInfo.yin > 0) {
        yinYang = "阴";
        ju = solarTermInfo.yin;
      }
    } else if (this.config.panType === "maoshan") {
      // 茅山法：根据节气和日干支确定
      if (solarTermInfo.yang > 0) {
        yinYang = "阳";
        ju = solarTermInfo.yang;
      } else if (solarTermInfo.yin > 0) {
        yinYang = "阴";
        ju = solarTermInfo.yin;
      }
    }

    // 默认用月建确定
    if (ju === 1 && !solarTermInfo.yang && !solarTermInfo.yin) {
      const monthZhi = chronoData.ganzhi.month.zhi;
      const springSummer = ["寅", "卯", "辰", "巳", "午", "未"];
      if (springSummer.includes(monthZhi)) {
        yinYang = "阳";
        ju = 1;
      } else {
        yinYang = "阴";
        ju = 9;
      }
    }

    return { yinYang, ju };
  }

  /**
   * 构建九宫格
   */
  private buildNinePalaces(
    yinYang: "阴" | "阳",
    ju: number,
    hourTiangan: Tiangan,
    hourDizhi: Dizhi,
    xunKong: [Dizhi, Dizhi],
    panJuType: PanJuType,
  ): NinePalace {
    const palaces: NinePalace = {};

    const layout = yinYang === "阳" ? YANG_DUN_LAYOUT : YIN_DUN_LAYOUT;
    const tianganLayout = layout[ju] || layout[1];

    const hourIdx = [
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
    ].indexOf(hourDizhi);
    const offset = hourIdx;

    for (let pos = 1; pos <= 9; pos++) {
      const palaceName = NINE_PALACE_POSITION[pos];
      const wuxing = NINE_PALACE_WUXING[pos];

      let layoutIdx: number;
      if (yinYang === "阳") {
        layoutIdx = (pos + offset - 1) % 9;
      } else {
        layoutIdx = (pos - offset + 9 - 1) % 9;
      }
      const tiangan = tianganLayout[layoutIdx];

      let star, door, deity;

      if (panJuType === "zhuan") {
        // 转盘奇门
        const starIdx = (pos + offset) % 9;
        star = NINE_STARS[starIdx];

        const doorIdx = (pos + offset + 1) % 8;
        door = EIGHT_DOORS[doorIdx];

        const deityIdx = (pos + offset) % 8;
        deity = EIGHT_DEITIES[deityIdx];
      } else {
        // 飞盘奇门
        const starIdx = (pos + offset) % 9;
        star = NINE_STARS[starIdx];

        const doorIdx = (pos + offset) % 8;
        door = EIGHT_DOORS[doorIdx];

        const deityIdx = (pos + offset) % 8;
        deity = EIGHT_DEITIES[deityIdx];
      }

      const isEmpty = this.checkPalaceEmpty(xunKong, pos);
      const isRushed = this.checkPalaceRushed(xunKong, pos);
      const isCombined = this.checkPalaceCombined(xunKong, pos);

      palaces[palaceName] = {
        position: pos,
        name: palaceName,
        wuxing,
        eightDoor: door,
        eightStar: star,
        tiangan,
        dizhi: hourDizhi,
        deity: this.config.includeDeity ? deity : undefined,
        isEmpty,
        isRushed,
        isCombined,
      };
    }

    return palaces;
  }

  /**
   * 找值符
   */
  private findZhiFu(palaces: NinePalace, rizhu: string): QimenResult["zhiFu"] {
    let zhiFu = {
      palace: "中宫",
      star: "天禽",
      position: 5,
    };

    for (const [palaceName, palace] of Object.entries(palaces)) {
      if (palace.eightStar === "天禽") {
        zhiFu = {
          palace: palaceName,
          star: palace.eightStar,
          position: palace.position,
        };
        break;
      }
    }

    for (const [palaceName, palace] of Object.entries(palaces)) {
      if (palace.position === 5) {
        zhiFu = {
          palace: palaceName,
          star: palace.eightStar,
          position: palace.position,
        };
        break;
      }
    }

    return zhiFu;
  }

  /**
   * 找值使
   */
  private findZhiShi(
    palaces: NinePalace,
    rizhu: string,
    ju: number,
    zhiShiMethod: ZhiShiMethod,
  ): QimenResult["zhiShi"] {
    let zhiShi = {
      palace: "中宫",
      door: "生门",
      position: 5,
    };

    if (zhiShiMethod === "men") {
      // 值使门起法
      for (const [palaceName, palace] of Object.entries(palaces)) {
        if (palace.eightDoor === "生门") {
          zhiShi = {
            palace: palaceName,
            door: palace.eightDoor,
            position: palace.position,
          };
          break;
        }
      }
    } else {
      // 门起地盘法
      for (const [palaceName, palace] of Object.entries(palaces)) {
        if (palace.eightDoor === "休门") {
          zhiShi = {
            palace: palaceName,
            door: palace.eightDoor,
            position: palace.position,
          };
          break;
        }
      }
    }

    return zhiShi;
  }

  /**
   * 格局检测
   */
  private detectPatterns(
    palaces: NinePalace,
    zhiFu: QimenResult["zhiFu"],
    zhiShi: QimenResult["zhiShi"],
    chronoData: ChronoData,
  ): QimenPattern[] {
    const patterns: QimenPattern[] = [];

    const zhiFuPalace = palaces[zhiFu.palace];
    if (
      zhiFuPalace &&
      ["天辅", "天心", "天禽"].includes(zhiFuPalace.eightStar)
    ) {
      patterns.push("值符得地");
    }

    const zhiShiPalace = palaces[zhiShi.palace];
    if (
      zhiShiPalace &&
      ["开门", "休门", "生门"].includes(zhiShiPalace.eightDoor)
    ) {
      patterns.push("值使得地");
    }

    for (const palace of Object.values(palaces)) {
      if (palace.tiangan && THREE_WONDERS.includes(palace.tiangan)) {
        patterns.push("三奇得使");
        break;
      }
    }

    return patterns;
  }

  /**
   * 计算运势
   */
  private calculateLuck(
    palaces: NinePalace,
    zhiFu: QimenResult["zhiFu"],
    zhiShi: QimenResult["zhiShi"],
    patterns: QimenPattern[],
  ): number {
    let score = 50;

    for (const [name, palace] of Object.entries(palaces)) {
      const starLuck = NINE_STARS_LUCK[palace.eightStar] || 50;
      const doorLuck = EIGHT_DOORS_LUCK[palace.eightDoor] || 50;
      score += (starLuck + doorLuck) / 18;
    }

    if (patterns.includes("值符得地")) score += 15;
    if (patterns.includes("值使得地")) score += 12;
    if (patterns.includes("三奇得使")) score += 10;

    const zhiFuPalace = palaces[zhiFu.palace];
    const zhiShiPalace = palaces[zhiShi.palace];

    if (zhiFuPalace && !zhiFuPalace.isEmpty) score += 5;
    if (zhiShiPalace && !zhiShiPalace.isEmpty) score += 5;

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * 生成解读
   */
  private generateInterpretation(
    luck: number,
    patterns: QimenPattern[],
  ): string {
    const panTypeText: Record<PanType, string> = {
      chaibu: "拆补法",
      zhirun: "置闰法",
      maoshan: "茅山法",
    };

    const panJuTypeText: Record<PanJuType, string> = {
      zhuan: "转盘",
      fei: "飞盘",
    };

    let interpretation = `盘式：${panTypeText[this.config.panType || "chaibu"]} ${panJuTypeText[this.config.panJuType || "zhuan"]}奇门\n`;
    interpretation += `综合运势：${luck}分\n`;

    if (luck >= 80) {
      interpretation += "格局大吉，诸事顺利，宜积极行事。";
    } else if (luck >= 60) {
      interpretation += "格局尚可，宜稳扎稳打，不宜冒进。";
    } else if (luck >= 40) {
      interpretation += "格局欠佳，宜静待时机，不宜轻举妄动。";
    } else {
      interpretation += "格局凶多吉少，宜守不宜攻，多加小心。";
    }

    if (patterns.length > 0) {
      interpretation += "\n\n格局分析:\n";
      for (const pattern of patterns) {
        interpretation += `• ${pattern}\n`;
      }
    }

    return interpretation;
  }

  /**
   * 计算旬空
   */
  private calculateXunKong(rizhu: string): [Dizhi, Dizhi] {
    const dizhiList: Dizhi[] = [
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
    const tianganList: Tiangan[] = [
      "甲",
      "乙",
      "丙",
      "丁",
      "戊",
      "己",
      "庚",
      "辛",
      "壬",
      "癸",
    ];

    const tian = rizhu[0] as Tiangan;
    const di = rizhu[1] as Dizhi;
    const tianIdx = tianganList.indexOf(tian);
    const diIdx = dizhiList.indexOf(di);

    const xunStart = tianIdx;
    const xunDiStart = diIdx - tianIdx;

    const kong1 = dizhiList[(xunDiStart + 10) % 12];
    const kong2 = dizhiList[(xunDiStart + 11) % 12];

    return [kong1, kong2];
  }

  /**
   * 检查宫位空亡
   */
  private checkPalaceEmpty(xunKong: [Dizhi, Dizhi], position: number): boolean {
    const dizhiPositions: Record<number, Dizhi[]> = {
      1: ["子", "亥"],
      2: ["丑", "未"],
      3: ["寅", "卯"],
      4: ["辰", "巳"],
      6: ["申", "酉"],
      7: ["申", "酉"],
      8: ["丑", "未"],
      9: ["午", "巳"],
    };
    const dizhiForPos = dizhiPositions[position] || [];
    return dizhiForPos.some((d) => xunKong.includes(d));
  }

  /**
   * 检查宫位冲
   */
  private checkPalaceRushed(
    xunKong: [Dizhi, Dizhi],
    position: number,
  ): boolean {
    const opposite: Record<number, number> = {
      1: 9,
      9: 1,
      2: 8,
      8: 2,
      3: 7,
      7: 3,
      4: 6,
      6: 4,
    };
    return !!opposite[position];
  }

  /**
   * 检查宫位合
   */
  private checkPalaceCombined(
    xunKong: [Dizhi, Dizhi],
    position: number,
  ): boolean {
    const combinations: Record<number, number> = {
      1: 6,
      6: 1,
      2: 7,
      7: 2,
      3: 8,
      8: 3,
      4: 9,
      9: 4,
    };
    return !!combinations[position];
  }
}
