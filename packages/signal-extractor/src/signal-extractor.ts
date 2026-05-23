import { Signal, SignalPolarity, SignalStrength } from "@tianwen/signal-system";
import { MeihuaResult } from "@tianwen/meihua";
import { LiuYaoResult } from "@tianwen/liuyao";
import { BaZiResult } from "@tianwen/bazi-engine";
import { MEIHUA_TIYONG_SIGNALS, LIUYAO_SHISHEN_SIGNALS } from "./constants";
import { ExtractedSignals, ExtractionConfig } from "./types";

export class SignalExtractor {
  private static nextId = 1;

  /**
   * 提取梅花易数信号
   */
  extractMeihua(
    result: MeihuaResult,
    config?: ExtractionConfig,
  ): ExtractedSignals {
    const signals: Signal[] = [];
    const keyFindings: string[] = [];

    // 体用关系信号
    if (result.tiYong) {
      const tiYongSignal =
        MEIHUA_TIYONG_SIGNALS[result.tiYong.relation as string];
      if (tiYongSignal) {
        signals.push(
          this.createSignal(
            "meihua_tiyong",
            tiYongSignal.description,
            tiYongSignal.polarity as any,
            tiYongSignal.strength as any,
          ),
        );
        keyFindings.push(tiYongSignal.description);
      }
    }

    // 动爻信号
    if (result.dongYaoPositions && result.dongYaoPositions.length > 0) {
      const polarity: SignalPolarity =
        result.dongYaoPositions.length > 2 ? "unstable" : "neutral";
      signals.push(
        this.createSignal(
          "meihua_dongyao",
          `动爻：${result.dongYaoPositions.join(",")}`,
          polarity,
          "medium",
        ),
      );
      keyFindings.push(`有${result.dongYaoPositions.length}个动爻`);
    }

    // 变卦信号
    if (result.bianGua) {
      signals.push(
        this.createSignal(
          "meihua_biangua",
          "有变卦，主过程变化",
          "neutral",
          "medium",
        ),
      );
    }

    return {
      system: "meihua",
      signals,
      keyFindings,
      summary: this.generateSummary("meihua", signals),
      timingHints: {
        favorable: ["春季", "寅卯日"],
        unfavorable: ["秋季", "申酉日"],
      },
    };
  }

  /**
   * 提取六爻信号
   */
  extractLiuYao(
    result: LiuYaoResult,
    config?: ExtractionConfig,
  ): ExtractedSignals {
    const signals: Signal[] = [];
    const keyFindings: string[] = [];

    // 世爻信号
    const shiYao = result.benGua.yaos.find((y) => y.isShiyao);
    if (shiYao) {
      const shiYaoSignal = LIUYAO_SHISHEN_SIGNALS[shiYao.liushao];
      signals.push(
        this.createSignal(
          "liuyao_shiyao",
          `世爻：${shiYao.liushao}，主自己`,
          (shiYaoSignal?.polarity as any) || "neutral",
          "high",
        ),
      );
    }

    // 应爻信号
    const yingYao = result.benGua.yaos.find((y) => y.isYingyao);
    if (yingYao) {
      signals.push(
        this.createSignal(
          "liuyao_yingyao",
          `应爻：${yingYao.liushao}，主他人`,
          "neutral",
          "medium",
        ),
      );
    }

    // 动爻信号
    const dongYaoCount = result.benGua.yaos.filter((y) => y.isChanging);
    if (dongYaoCount.length > 0) {
      const polarity: SignalPolarity =
        dongYaoCount.length > 2 ? "unstable" : "neutral";
      signals.push(
        this.createSignal(
          "liuyao_dongyao",
          `动爻：${dongYaoCount.map((y) => y.position).join(",")}`,
          polarity,
          "medium",
        ),
      );
      keyFindings.push(`有${dongYaoCount.length}个动爻`);
    }

    return {
      system: "liuyao",
      signals,
      keyFindings,
      summary: this.generateSummary("liuyao", signals),
      timingHints: {
        favorable: ["本月"],
        unfavorable: [],
      },
    };
  }

  /**
   * 提取八字信号
   */
  extractBaZi(result: BaZiResult, config?: ExtractionConfig): ExtractedSignals {
    const signals: Signal[] = [];
    const keyFindings: string[] = [];

    // 日主强弱信号
    const dmStrengthSignal: SignalPolarity =
      result.dayMasterStrength === "balanced" ? "positive" : "neutral";
    signals.push(
      this.createSignal(
        "bazi_rizhu",
        `日主${result.dayMaster}${result.dayMasterStrength === "balanced" ? "中和" : result.dayMasterStrength}`,
        dmStrengthSignal,
        "high",
      ),
    );
    keyFindings.push(
      `日主${result.dayMasterStrength === "balanced" ? "中和" : result.dayMasterStrength}`,
    );

    // 喜用神信号
    if (result.favorableWuxing.length > 0) {
      signals.push(
        this.createSignal(
          "bazi_xiyong",
          `喜用神：${result.favorableWuxing.join(",")}`,
          "positive",
          "high",
        ),
      );
      keyFindings.push(`喜用神为${result.favorableWuxing.join("、")}`);
    }

    // 流年信号
    const currentYear = result.currentLiunian;
    const isFavorable =
      result.favorableWuxing.includes(currentYear.tianganWuxing) ||
      result.favorableWuxing.includes(currentYear.dizhiWuxing);
    signals.push(
      this.createSignal(
        "bazi_liunian",
        `${currentYear.year}年：${currentYear.tiangan}${currentYear.dizhi}，十神：${currentYear.shishen}`,
        isFavorable ? "positive" : "neutral",
        "high",
      ),
    );

    return {
      system: "bazi",
      signals,
      keyFindings,
      summary: this.generateSummary("bazi", signals),
      timingHints: {
        favorable: result.favorableWuxing.map((w) => `${w}年`),
        unfavorable: result.unfavorableWuxing.map((w) => `${w}年`),
      },
    };
  }

  /**
   * 创建标准信号对象
   */
  private createSignal(
    source: string,
    description: string,
    polarity: SignalPolarity,
    strength: SignalStrength,
  ): Signal {
    return {
      id: `sig_${this.nextId++}`,
      source,
      polarity,
      strength,
      confidence: 0.8,
      timing: null,
      description,
    };
  }

  /**
   * 生成信号摘要
   */
  private generateSummary(system: string, signals: Signal[]): string {
    const positiveCount = signals.filter(
      (s) => s.polarity === "positive",
    ).length;
    const negativeCount = signals.filter(
      (s) => s.polarity === "negative",
    ).length;
    const unstableCount = signals.filter(
      (s) => s.polarity === "unstable",
    ).length;

    return `${this.getSystemName(system)}分析：发现${positiveCount}个积极信号，${negativeCount}个消极信号，${unstableCount}个不稳定信号。`;
  }

  private getSystemName(system: string): string {
    const names: Record<string, string> = {
      meihua: "梅花易数",
      liuyao: "六爻纳甲",
      bazi: "四柱八字",
    };
    return names[system] || system;
  }
}
