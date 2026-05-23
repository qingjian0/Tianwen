/**
 * 紫微斗数核心引擎
 */

import {
  ChronoEngine,
  Tiangan,
  Dizhi,
  ChronoData,
} from "@tianwen/chrono-engine";
import { ZiweiResult, PalaceData, Palace, Star } from "./types";
import {
  FOURTEEN_MAIN_STARS,
  AUSPICIOUS_STARS,
  INAUSPICIOUS_STARS,
  STAR_LUCK,
  PALACE_ORDER,
  DIZHI_PALACE,
  PALACE_WUXING,
  ZIWEI_PATTERNS,
  TIANGAN_STARS,
  DIZHI_STARS,
} from "./constants";

export class ZiweiEngine {
  /**
   * 排盘
   */
  calculate(date: Date, gender: "男" | "女"): ZiweiResult {
    const chronoData = ChronoEngine.at(date);
    const palaces = this.buildPalaces(chronoData, gender);
    const mainPalace = palaces.find((p) => p.name === "命宫") || palaces[0];
    const luck = this.calculateLuck(palaces);
    const predictions = this.generatePredictions(palaces);

    return {
      type: "ziwei",
      palaces,
      mainPalace,
      chronoData,
      gender,
      interpretation: this.generateInterpretation(luck, palaces),
      luck,
      predictions,
    };
  }

  /**
   * 构建宫位
   */
  private buildPalaces(
    chronoData: ChronoData,
    gender: "男" | "女",
  ): PalaceData[] {
    const palaces: PalaceData[] = [];
    const { ganzhi } = chronoData;

    const tianganList: Tiangan[] = [
      "甲",
      "乙",
      "丙",
      "丙",
      "丁",
      "戊",
      "戊",
      "己",
      "庚",
      "辛",
      "壬",
      "癸",
    ];
    const dizhiList: Dizhi[] = [
      "子",
      "丑",
      "寅",
      "卯",
      "辰",
      "辰",
      "巳",
      "午",
      "未",
      "未",
      "申",
      "酉",
      "戌",
      "戌",
      "亥",
    ];

    for (let i = 0; i < 12; i++) {
      const palaceName = PALACE_ORDER[i];
      const position = i + 1;
      const tiangan = tianganList[i];
      const dizhi = dizhiList[i];
      const wuxing = PALACE_WUXING[palaceName];

      const mainStars = this.findMainStars(
        palaceName,
        ganzhi.day.gan,
        i,
        position,
      );
      const auxStars = this.findAuxiliaryStars(
        palaceName,
        ganzhi.day.zhi,
        i,
        ganzhi.hour.zhi,
      );

      palaces.push({
        name: palaceName,
        position,
        tiangan,
        dizhi,
        mainStars,
        auxStars,
        wuxing,
        isEmpty: this.checkPalaceEmpty(palaceName, ganzhi.day.full),
      });
    }

    return palaces;
  }

  /**
   * 找主星
   */
  private findMainStars(
    palaceName: Palace,
    dayTiangan: Tiangan,
    offset: number,
    position: number,
  ): Star[] {
    const stars: Star[] = [];

    const patternStar = ZIWEI_PATTERNS[dayTiangan];
    if (patternStar) {
      const starOffset = position % 4;
      if (starOffset === (position - 1) % 4) {
        stars.push(patternStar);
      }
    }

    const tianganStars = TIANGAN_STARS[dayTiangan];
    if (tianganStars && position % 3 === 0) {
      stars.push(...tianganStars.slice(0, 2));
    }

    if (stars.length === 0 && position % 2 === 0) {
      const candidateStars = FOURTEEN_MAIN_STARS.slice(
        FOURTEEN_MAIN_STARS.length - 3,
      );
      if (candidateStars.length > 0) {
        stars.push(...candidateStars.slice(0, 2));
      }
    }

    return Array.from(new Set(stars));
  }

  /**
   * 找辅星
   */
  private findAuxiliaryStars(
    palaceName: Palace,
    dayDizhi: Dizhi,
    offset: number,
    hourDizhi: Dizhi,
  ): Star[] {
    const stars: Star[] = [];

    const dizhiStars = DIZHI_STARS[dayDizhi] || [];
    if (dizhiStars.length > 0 && offset % 2 === 0) {
      stars.push(...dizhiStars.slice(0, 2));
    }

    if (offset % 3 === 0) {
      const luckyStars = ["左辅", "右弼", "文昌", "文曲", "天魁", "天钺"];
      stars.push(...luckyStars.slice(offset % luckyStars.length));
    }

    if (offset % 5 === 0) {
      const loveStars = ["红鸾", "天喜"];
      stars.push(...loveStars);
    }

    return Array.from(new Set(stars));
  }

  /**
   * 检查宫位空亡
   */
  private checkPalaceEmpty(palaceName: Palace, rizhu: string): boolean {
    const emptyPalaces: Palace[] = ["迁移", "交友"];
    return emptyPalaces.includes(palaceName) && Math.random() > 0.7;
  }

  /**
   * 计算运势
   */
  private calculateLuck(palaces: PalaceData[]): number {
    let score = 50;

    for (const palace of palaces) {
      for (const star of palace.mainStars) {
        const luck = STAR_LUCK[star] || 50;
        score += (luck - 50) / 12;
      }

      for (const star of palace.auxStars) {
        const luck = STAR_LUCK[star] || 50;
        score += (luck - 50) / 24;
      }
    }

    const mainPalace = palaces.find((p) => p.name === "命宫");
    if (mainPalace) {
      for (const star of mainPalace.mainStars) {
        const luck = STAR_LUCK[star] || 50;
        score += (luck - 50) / 6;
      }
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * 生成预测
   */
  private generatePredictions(palaces: PalaceData): {
    career: string;
    wealth: string;
    relationships: string;
    health: string;
  } {
    const careerPalace = palaces.find((p) => p.name === "官禄");
    const wealthPalace = palaces.find((p) => p.name === "财帛");
    const relationshipsPalace = palaces.find((p) => p.name === "夫妻");
    const healthPalace = palaces.find((p) => p.name === "疾厄");

    const career = this.analyzePalace(careerPalace, "事业");
    const wealth = this.analyzePalace(wealthPalace, "财运");
    const relationships = this.analyzePalace(relationshipsPalace, "感情");
    const health = this.analyzePalace(healthPalace, "健康");

    return { career, wealth, relationships, health };
  }

  /**
   * 分析宫位
   */
  private analyzePalace(palace: PalaceData | undefined, area: string): string {
    if (!palace) {
      return `${area}方面运势一般，宜谨慎行事。`;
    }

    const hasGoodStars = palace.mainStars.some((s) =>
      AUSPICIOUS_STARS.includes(s),
    );
    const hasBadStars = palace.mainStars.some((s) =>
      INAUSPICIOUS_STARS.includes(s),
    );

    if (hasGoodStars && !hasBadStars) {
      return `${area}方面运势良好，宜积极行动。`;
    } else if (!hasGoodStars && hasBadStars) {
      return `${area}方面需多加小心，宜守不宜攻。`;
    } else if (hasGoodStars && hasBadStars) {
      return `${area}方面有喜有忧，宜中庸之道。`;
    } else {
      return `${area}方面运势平稳，宜顺其自然。`;
    }
  }

  /**
   * 生成解读
   */
  private generateInterpretation(luck: number, palaces: PalaceData[]): string {
    let interpretation = `综合运势: ${luck}分\n\n`;

    if (luck >= 80) {
      interpretation += "格局大吉，格局良好，宜积极行事。";
    } else if (luck >= 60) {
      interpretation += "格局尚可，宜稳扎稳打。";
    } else if (luck >= 40) {
      interpretation += "格局欠佳，宜静待时机。";
    } else {
      interpretation += "格局一般，宜守不宜攻。";
    }

    interpretation += "\n\n宫位分析:\n";

    for (const palace of palaces.slice(0, 6)) {
      const stars = [...palace.mainStars.slice(0, 2)];
      if (stars.length > 0) {
        interpretation += `${palace.name}: ${stars.join(", ")}\n`;
      }
    }

    return interpretation;
  }
}
