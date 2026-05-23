import { ChronoEngine } from '@tianwen/chrono-engine';
import { LiuRenConfig, LiuRenResult, LiuRenAnalysis, SiKe, SanChuan, TianPan } from './types';
import { YUE_JIANG, TIAN_JIANG_ORDER, DUN_GAN } from './constants';

export class LiuRenEngine {
  private config: LiuRenConfig;

  constructor(config?: Partial<LiuRenConfig>) {
    this.config = {
      useTrueSun: false,
      jiangMethod: 'yue',
      keMethod: 'tian',
      shehaiMethod: 'mengzhongji',
      dayNight: 'day',
      ...config
    };
  }

  /**
   * 设置配置
   */
  setConfig(config: LiuRenConfig): void {
    this.config = { ...this.config, ...config };
  }

  calculate(input: { year: number; month: number; day: number; hour: number; minute?: number }): LiuRenResult {
    const date = new Date(input.year, input.month - 1, input.day, input.hour);
    const chronoData = ChronoEngine.at(date, this.config.coordinates, this.config.useTrueSun);

    // 计算月将或时将
    const yueJiang = this.calculateYueJiang(chronoData.lunar.month, input.hour);

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
      position: chronoData.shichen.dizhi || '子',
      shen: '贵人'
    };

    const diPan = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    const dunGan: Record<string, string> = {};
    for (const dz of diPan) {
      dunGan[dz] = DUN_GAN[dz] || dz;
    }

    const tianJiang: Record<string, string> = {};
    for (let i = 0; i < diPan.length; i++) {
      tianJiang[diPan[i]] = TIAN_JIANG_ORDER[i % TIAN_JIANG_ORDER.length];
    }

    const liuQin: Record<string, string> = {};
    const qinTypes = ['父母', '兄弟', '妻财', '官鬼', '子孙'];
    for (let i = 0; i < diPan.length; i++) {
      liuQin[diPan[i]] = qinTypes[i % qinTypes.length];
    }

    return {
      config: this.config,
      chronoData,
      tianPan,
      diPan,
      siKe,
      sanChuan,
      dunGan,
      tianJiang,
      liuQin
    };
  }

  /**
   * 计算月将
   */
  private calculateYueJiang(lunarMonth: number, hour: number): string {
    if (this.config.jiangMethod === 'shi') {
      // 时将
      const dizhiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
      const hourIndex = Math.floor((hour + 1) % 12);
      return dizhiList[hourIndex];
    } else {
      // 月将
      const yueJiangKey = (lunarMonth + (hour >= 23 ? 1 : 0)) % 12;
      return YUE_JIANG[yueJiangKey] || '神后';
    }
  }

  analyze(result: LiuRenResult): LiuRenAnalysis {
    const jiangMethodText: Record<string, string> = {
      'yue': '月将',
      'shi': '时将'
    };
    
    const keMethodText: Record<string, string> = {
      'tian': '天盘',
      'di': '地盘'
    };
    
    const shehaiMethodText: Record<string, string> = {
      'mengzhongji': '孟仲季',
      'shenqian': '深浅'
    };
    
    const dayNightText: Record<string, string> = {
      'day': '昼',
      'night': '夜'
    };

    return {
      keTi: `${result.tianPan.jiang}加${result.tianPan.position}, 换将：${jiangMethodText[this.config.jiangMethod || 'yue']}, 起课：${keMethodText[this.config.keMethod || 'tian']}, 涉害：${shehaiMethodText[this.config.shehaiMethod || 'mengzhongji']}, 昼夜：${dayNightText[this.config.dayNight || 'day']}`,
      yongShen: result.sanChuan.chu,
      jiXiong: '平',
      detailedAnalysis: `月将${result.tianPan.jiang}临${result.tianPan.position}，发用${result.sanChuan.chu}，中传${result.sanChuan.zhong}，末传${result.sanChuan.mo}。`
    };
  }
}

export default LiuRenEngine;
