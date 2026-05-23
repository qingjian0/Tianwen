import { ChronoEngine } from "@tianwen/chrono-engine";
import { HuangJiInput, HuangJiResult, YuanHuiYunShi, GuaMing } from "./types";
import { YUAN_BASE, HUI_NAMES, GUA_TABLE } from "./constants";

export class HuangJiEngine {
  private chronoData;

  constructor() {
    this.chronoData = ChronoEngine.now();
  }

  calculate(input: HuangJiInput): HuangJiResult {
    const totalYears = input.year + YUAN_BASE;

    const yuan = Math.floor(totalYears / 129600) + 1;
    const hui = Math.floor((totalYears % 129600) / 10800) + 1;
    const yun = Math.floor((totalYears % 10800) / 360) + 1;
    const shi = Math.floor((totalYears % 360) / 30) + 1;

    const yuanHuiYunShi: YuanHuiYunShi = { yuan, hui, yun, shi };

    const getGua = (n: number): GuaMing => {
      const num = ((n - 1) % 12) + 1;
      return { guaName: GUA_TABLE[num], guaNum: num };
    };

    return {
      yuanHuiYunShi,
      huiGua: getGua(hui),
      yunGua: getGua(yun),
      shiGua: getGua(shi),
      yearGua: getGua(input.year % 60),
      monthGua: getGua(input.month),
      dayGua: getGua(input.day),
      hourGua: getGua(input.hour + 1),
      baseNum: YUAN_BASE,
    };
  }

  analyze(result: HuangJiResult): {
    eraDescription: string;
    guaMingInterpretation: string;
    suggestions: string[];
  } {
    const huiDesc = HUI_NAMES[result.yuanHuiYunShi.hui] || "";
    return {
      eraDescription: `元${result.yuanHuiYunShi.yuan}，${huiDesc}，运${result.yuanHuiYunShi.yun}，世${result.yuanHuiYunShi.shi}`,
      guaMingInterpretation: `会卦${result.huiGua.guaName}，运卦${result.yunGua.guaName}，世卦${result.shiGua.guaName}`,
      suggestions: ["顺天应时", "知几其神"],
    };
  }
}

export default HuangJiEngine;
