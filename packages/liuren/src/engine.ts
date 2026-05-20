import { ChronoEngine } from '@tianwen/chrono-engine';
import { LiuRenInput, LiuRenResult, SiKe, SanChuan, TianPan } from './types';
import { YUE_JIANG, TIAN_JIANG_ORDER, DUN_GAN } from './constants';

export class LiuRenEngine {
  private chronoData;

  constructor() {
    this.chronoData = ChronoEngine.now();
  }

  calculate(input: LiuRenInput): LiuRenResult {
    const { year, month, day, hour } = input.eventTime;
    const date = new Date(year, month - 1, day, hour);
    const chrono = ChronoEngine.at(date);

    const yueJiangKey = (month + (hour >= 23 ? 1 : 0)) % 12;
    const yueJiang = YUE_JIANG[yueJiangKey] || '神后';

    const siKe: SiKe = {
      gan: { yang: '甲', yin: '子' },
      zhi: { yang: '丑', yin: '寅' }
    };

    const sanChuan: SanChuan = {
      chu: '子',
      zhong: '丑',
      mo: '寅'
    };

    const tianPan: TianPan = {
      jiang: yueJiang,
      position: chrono.shichen.dizhi || '子',
      shen: '贵人'
    };

    const diPan = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    const dunGan: Record<string, string> = {};
    for (const dz of diPan) {
      dunGan[dz] = DUN_GAN[dz] || dz;
    }

    const tianJiang: Record<string, string> = {};
    for (let i = 0; i < diPan.length; i++) {
      tianJiang[diPan[i]] = TIAN_JIANG_ORDER[i % 12];
    }

    const liuQin: Record<string, string> = {};
    const qinTypes = ['父母', '兄弟', '妻财', '官鬼', '子孙'];
    for (let i = 0; i < diPan.length; i++) {
      liuQin[diPan[i]] = qinTypes[i % 5];
    }

    return {
      tianPan,
      diPan,
      siKe,
      sanChuan,
      dunGan,
      tianJiang,
      liuQin
    };
  }

  analyze(result: LiuRenResult): {
    keTi: string;
    yongShen: string;
    jiXiong: string;
    detailedAnalysis: string;
  } {
    return {
      keTi: `${result.tianPan.jiang}加${result.tianPan.position}`,
      yongShen: result.sanChuan.chu,
      jiXiong: '平',
      detailedAnalysis: `月将${result.tianPan.jiang}临${result.tianPan.position}，发用${result.sanChuan.chu}，中传${result.sanChuan.zhong}，末传${result.sanChuan.mo}。`
    };
  }
}

export default LiuRenEngine;