import { ChronoEngine } from '@tianwen/chrono-engine';
import { CeGuiInput, CeGuiResult, DongZhiShu, GuaGui } from './types';

export class CeGuiEngine {
  private chronoData;

  constructor() {
    this.chronoData = ChronoEngine.now();
  }

  calculate(input: CeGuiInput): CeGuiResult {
    const chrono = ChronoEngine.at(new Date(input.year, input.month - 1, input.day, input.hour));

    const yearNum = input.year % 100;
    const dongShu = (yearNum + input.month * 3 + input.day * 5 + input.hour * 2) % 72 || 72;
    const zhiShu = (yearNum * 3 + input.month + input.day * 7 + input.hour * 4) % 72 || 72;

    const dongZhiShu: DongZhiShu = {
      dongShu,
      zhiShu,
      totalShu: dongShu + zhiShu
    };

    const ceShu = dongShu % 64 || 64;
    const guiShu = zhiShu % 64 || 64;

    const guaNames = [
      '乾', '坤', '屯', '蒙', '需', '讼', '师', '比',
      '小畜', '履', '泰', '否', '同人', '大有', '谦', '豫',
      '随', '蛊', '临', '观', '噬嗑', '贲', '剥', '复',
      '无妄', '大畜', '颐', '大过', '坎', '离', '咸', '恒',
      '遁', '大壮', '晋', '明夷', '家人', '睽', '蹇', '解',
      '损', '益', '夬', '姤', '萃', '升', '困', '井',
      '革', '鼎', '震', '艮', '渐', '归妹', '丰', '旅',
      '巽', '兑', '涣', '节', '中孚', '小过', '既济', '未济'
    ];

    const guaGui: GuaGui = {
      guaName: guaNames[(ceShu - 1) % 64],
      guiName: guaNames[(guiShu - 1) % 64]
    };

    return {
      dongZhiShu,
      guaGui,
      ceShu,
      guiShu,
      yearGua: guaNames[input.year % 64]
    };
  }

  analyze(result: CeGuiResult): {
    overview: string;
    interpretation: string;
  } {
    return {
      overview: `动数${result.dongZhiShu.dongShu}，植数${result.dongZhiShu.zhiShu}，总和${result.dongZhiShu.totalShu}`,
      interpretation: `策轨卦象：策${result.ceShu}为${result.guaGui.guaName}卦，轨${result.guiShu}为${result.guaGui.guiName}卦`
    };
  }
}

export default CeGuiEngine;