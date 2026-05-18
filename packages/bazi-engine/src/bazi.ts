import { ChronoEngine, Tiangan, Dizhi, Wuxing, ChronoData } from '@tianwen/chrono-engine';
import {
  TIANGAN_WUXING,
  DIZHI_WUXING,
  DIZHI_CANGGAN,
  SHISHEN_MAP,
  WUXING_SHENG,
  WUXING_KE,
  TIANGAN_ORDER,
  DIZHI_ORDER
} from './constants';
import { BaZiResult, BaZiPillar, DayunPillar, LiunianPillar, WuxingStrength } from './types';

export class BaZiEngine {
  private chronoEngine: ChronoEngine;

  constructor() {
    this.chronoEngine = new ChronoEngine();
  }

  /**
   * 排八字
   */
  calculate(date: Date, gender: 'male' | 'female'): BaZiResult {
    const chronoData = ChronoEngine.at(date);
    const ganzhi = chronoData.ganzhi;

    // 1. 日柱
    const dayMaster = ganzhi.day.gan;
    const dayMasterWuxing = TIANGAN_WUXING[dayMaster];

    // 2. 四柱
    const yearPillar = this.createPillar(ganzhi.year.gan, ganzhi.year.zhi, dayMasterWuxing);
    const monthPillar = this.createPillar(ganzhi.month.gan, ganzhi.month.zhi, dayMasterWuxing);
    const dayPillar = this.createPillar(ganzhi.day.gan, ganzhi.day.zhi, dayMasterWuxing);
    const hourPillar = this.createPillar(ganzhi.hour.gan, ganzhi.hour.zhi, dayMasterWuxing);

    // 3. 五行强弱分析
    const wuxingStrengths = this.calculateWuxingStrengths([yearPillar, monthPillar, dayPillar, hourPillar]);

    // 4. 日主强弱
    const dayMasterStrength = this.calculateDayMasterStrength(dayMasterWuxing, wuxingStrengths);

    // 5. 喜用神
    const { favorableWuxing, unfavorableWuxing } = this.calculateFavorableWuxing(dayMasterWuxing, dayMasterStrength, wuxingStrengths);

    // 6. 大运
    const dayuns = this.calculateDayuns(ganzhi.month.gan, ganzhi.month.zhi, gender, dayMasterWuxing);

    // 7. 流年
    const currentYear = new Date().getFullYear();
    const liunians = this.calculateLiunians(currentYear - 10, currentYear + 20, dayMasterWuxing);
    const currentLiunian = liunians.find(l => l.year === currentYear) || liunians[0];

    return {
      chronoData,
      gender,
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      dayMaster,
      dayMasterWuxing,
      wuxingStrengths,
      dayMasterStrength,
      favorableWuxing,
      unfavorableWuxing,
      dayuns,
      currentLiunian,
      liunians
    };
  }

  /**
   * 创建单柱
   */
  private createPillar(tiangan: Tiangan, dizhi: Dizhi, dayMasterWuxing: Wuxing): BaZiPillar {
    const tianganWuxing = TIANGAN_WUXING[tiangan];
    const dizhiWuxing = DIZHI_WUXING[dizhi];
    const canggan = DIZHI_CANGGAN[dizhi];
    const shishen = this.getShishen(dayMasterWuxing, tianganWuxing, tiangan);

    return {
      tiangan,
      dizhi,
      tianganWuxing,
      dizhiWuxing,
      canggan,
      shishen
    };
  }

  /**
   * 计算十神
   */
  private getShishen(dayMasterWuxing: Wuxing, targetWuxing: Wuxing, targetTiangan: Tiangan): string {
    const dayMasterIdx = TIANGAN_ORDER.indexOf(targetTiangan);
    const isYang = dayMasterIdx % 2 === 0;

    const basic = SHISHEN_MAP[dayMasterWuxing][targetWuxing];
    
    // 简化十神计算（完整版本需要考虑阴阳）
    if (basic === '正官' && !isYang) return '七杀';
    if (basic === '正财' && !isYang) return '偏财';
    if (basic === '正印' && !isYang) return '偏印';
    if (basic === '食神' && !isYang) return '伤官';
    if (basic === '比肩' && !isYang) return '劫财';

    return basic;
  }

  /**
   * 计算五行强弱
   */
  private calculateWuxingStrengths(pillars: BaZiPillar[]): WuxingStrength[] {
    const wuxingScores: Record<Wuxing, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

    for (const pillar of pillars) {
      // 天干得分
      wuxingScores[pillar.tianganWuxing] += 2;
      
      // 地支本气得分
      wuxingScores[pillar.dizhiWuxing] += 3;
      
      // 藏干得分
      pillar.canggan.forEach((cang, idx) => {
        const weight = idx === 0 ? 1.5 : idx === 1 ? 0.8 : 0.5;
        wuxingScores[TIANGAN_WUXING[cang]] += weight;
      });
    }

    const total = Object.values(wuxingScores).reduce((a, b) => a + b, 0);

    return Object.entries(wuxingScores).map(([wuxing, score]) => {
      const normalized = score / total;
      let level: 'strong' | 'medium' | 'weak';
      if (normalized > 0.28) level = 'strong';
      else if (normalized > 0.16) level = 'medium';
      else level = 'weak';

      return {
        wuxing: wuxing as Wuxing,
        score: normalized,
        level
      };
    }).sort((a, b) => b.score - a.score);
  }

  /**
   * 计算日主强弱
   */
  private calculateDayMasterStrength(dayMasterWuxing: Wuxing, strengths: WuxingStrength[]): 'weak' | 'balanced' | 'strong' {
    const dmStrength = strengths.find(s => s.wuxing === dayMasterWuxing)!;
    
    if (dmStrength.score > 0.32) return 'strong';
    if (dmStrength.score < 0.18) return 'weak';
    return 'balanced';
  }

  /**
   * 计算喜用神
   */
  private calculateFavorableWuxing(
    dayMasterWuxing: Wuxing,
    dmStrength: 'weak' | 'balanced' | 'strong',
    strengths: WuxingStrength[]
  ): { favorableWuxing: Wuxing[], unfavorableWuxing: Wuxing[] } {
    const favorable: Wuxing[] = [];
    const unfavorable: Wuxing[] = [];

    if (dmStrength === 'strong') {
      // 身强，喜克泄耗
      const keWuxing = WUXING_KE[dayMasterWuxing];
      favorable.push(keWuxing);
      
      const xieWuxing = WUXING_SHENG[dayMasterWuxing];
      favorable.push(xieWuxing);
      
      // 忌生扶
      unfavorable.push(WUXING_KE[WUXING_KE[dayMasterWuxing]]); // 生我者
      unfavorable.push(dayMasterWuxing); // 同气者
    } else if (dmStrength === 'weak') {
      // 身弱，喜生扶
      const shengWuxing = WUXING_KE[WUXING_KE[dayMasterWuxing]];
      favorable.push(shengWuxing);
      favorable.push(dayMasterWuxing);
      
      // 忌克泄耗
      unfavorable.push(WUXING_KE[dayMasterWuxing]);
      unfavorable.push(WUXING_SHENG[dayMasterWuxing]);
    } else {
      // 中和，喜流通
      const allWuxing: Wuxing[] = ['木', '火', '土', '金', '水'];
      const weakWuxing = strengths.filter(s => s.level === 'weak').map(s => s.wuxing);
      favorable.push(...weakWuxing);
    }

    return {
      favorableWuxing: Array.from(new Set(favorable)),
      unfavorableWuxing: Array.from(new Set(unfavorable))
    };
  }

  /**
   * 计算大运
   */
  private calculateDayuns(
    monthTiangan: Tiangan,
    monthDizhi: Dizhi,
    gender: 'male' | 'female',
    dayMasterWuxing: Wuxing
  ): DayunPillar[] {
    const dayuns: DayunPillar[] = [];
    const tianganIdx = TIANGAN_ORDER.indexOf(monthTiangan);
    const dizhiIdx = DIZHI_ORDER.indexOf(monthDizhi);
    
    const isShunxing = (TIANGAN_ORDER.indexOf(monthTiangan) % 2 === 0 && gender === 'male') ||
                      (TIANGAN_ORDER.indexOf(monthTiangan) % 2 === 1 && gender === 'female');

    let currentTianganIdx = tianganIdx;
    let currentDizhiIdx = dizhiIdx;

    for (let i = 0; i < 8; i++) {
      if (isShunxing) {
        currentTianganIdx = (currentTianganIdx + 1) % 10;
        currentDizhiIdx = (currentDizhiIdx + 1) % 12;
      } else {
        currentTianganIdx = (currentTianganIdx - 1 + 10) % 10;
        currentDizhiIdx = (currentDizhiIdx - 1 + 12) % 12;
      }

      const tiangan = TIANGAN_ORDER[currentTianganIdx];
      const dizhi = DIZHI_ORDER[currentDizhiIdx];

      dayuns.push({
        startAge: i * 10 + 1,
        endAge: i * 10 + 10,
        tiangan,
        dizhi,
        tianganWuxing: TIANGAN_WUXING[tiangan],
        dizhiWuxing: DIZHI_WUXING[dizhi],
        shishen: this.getShishen(dayMasterWuxing, TIANGAN_WUXING[tiangan], tiangan)
      });
    }

    return dayuns;
  }

  /**
   * 计算流年
   */
  private calculateLiunians(
    startYear: number,
    endYear: number,
    dayMasterWuxing: Wuxing
  ): LiunianPillar[] {
    const liunians: LiunianPillar[] = [];

    for (let year = startYear; year <= endYear; year++) {
      const chrono = ChronoEngine.at(new Date(year, 0, 1));
      const { gan, zhi } = chrono.ganzhi.year;
      const tianganWuxing = TIANGAN_WUXING[gan];
      const dizhiWuxing = DIZHI_WUXING[zhi];
      
      liunians.push({
        year,
        tiangan: gan,
        dizhi: zhi,
        tianganWuxing,
        dizhiWuxing,
        shishen: this.getShishen(dayMasterWuxing, tianganWuxing, gan)
      });
    }

    return liunians;
  }
}
