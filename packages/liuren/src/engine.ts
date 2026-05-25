import { ChronoEngine } from "@tianwen/chrono-engine";
import {
  LiuRenConfig,
  LiuRenResult,
  LiuRenAnalysis,
  SiKe,
  SanChuan,
  TianPan,
} from "./types";
import {
  YUE_JIANG,
  TIAN_JIANG_ORDER,
  DUN_GAN,
  SHI_SHEN_MAP,
  DIZHI_CHONG,
} from "./constants";

export class LiuRenEngine {
  private config: LiuRenConfig;

  constructor(config?: Partial<LiuRenConfig>) {
    this.config = {
      useTrueSun: false,
      jiangMethod: "yue",
      keMethod: "tian",
      shehaiMethod: "mengzhongji",
      dayNight: "day",
      ...config,
    };
  }

  setConfig(config: LiuRenConfig): void {
    this.config = { ...this.config, ...config };
  }

  calculate(input: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute?: number;
  }): LiuRenResult {
    const date = new Date(input.year, input.month - 1, input.day, input.hour);
    const chronoData = ChronoEngine.at(
      date,
      this.config.coordinates,
      this.config.useTrueSun,
    );

    const lunarMonth = chronoData.lunar.month;
    const dayGan = chronoData.ganzhi.day.gan;
    const dayZhi = chronoData.ganzhi.day.zhi;
    const hourGan = chronoData.ganzhi.hour.gan;
    const hourZhi = chronoData.ganzhi.hour.zhi;

    const yueJiang = this.calculateYueJiang(lunarMonth, input.hour);

    const diPan = [
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

    const tianPan = this.buildTianPan(diPan, yueJiang, hourZhi);

    const dunGan: Record<string, string> = {};
    for (const dz of diPan) {
      dunGan[dz] = DUN_GAN[dz] || dz;
    }

    const tianJiang: Record<string, string> = {};
    const jiangStartIdx = TIAN_JIANG_ORDER.indexOf(yueJiang);
    for (let i = 0; i < diPan.length; i++) {
      const jiangIdx = (jiangStartIdx + i) % TIAN_JIANG_ORDER.length;
      tianJiang[diPan[i]] = TIAN_JIANG_ORDER[jiangIdx];
    }

    const siKe = this.buildSiKe(
      dayGan,
      dayZhi,
      hourGan,
      hourZhi,
      diPan,
      tianJiang,
      dunGan,
    );

    const sanChuan = this.buildSanChuan(
      siKe,
      diPan,
      tianJiang,
      this.config.shehaiMethod || "mengzhongji",
    );

    const keTi = this.generateKeTi(yueJiang, hourZhi);

    const shiShen = this.calculateShiShen(dayGan, diPan, tianJiang);

    const liuQin = this.calculateLiuQin(dayGan, diPan);

    const yongShen = this.determineYongShen(sanChuan, siKe);

    return {
      config: this.config,
      chronoData,
      tianPan,
      diPan,
      siKe,
      sanChuan,
      dunGan,
      tianJiang,
      liuQin,
      keTi,
      shiShen,
      yongShen,
    };
  }

  private calculateYueJiang(lunarMonth: number, hour: number): string {
    if (this.config.jiangMethod === "shi") {
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
      const hourIndex = Math.floor((hour + 1) % 12);
      const jiangMap: Record<string, string> = {
        子: "神后",
        丑: "大吉",
        寅: "功曹",
        卯: "太冲",
        辰: "天罡",
        巳: "太乙",
        午: "胜光",
        未: "小吉",
        申: "传送",
        酉: "从魁",
        戌: "河魁",
        亥: "登明",
      };
      return jiangMap[dizhiList[hourIndex]] || "神后";
    } else {
      const yueJiangKey = (lunarMonth + (hour >= 23 ? 1 : 0)) % 12;
      return YUE_JIANG[yueJiangKey] || "神后";
    }
  }

  private buildTianPan(diPan: string[], yueJiang: string, hourZhi: string): TianPan {
    const jiangStartIdx = TIAN_JIANG_ORDER.indexOf(yueJiang);
    const hourIdx = diPan.indexOf(hourZhi);
    const jiangAtHour = TIAN_JIANG_ORDER[(jiangStartIdx + hourIdx) % TIAN_JIANG_ORDER.length];

    return {
      jiang: yueJiang,
      position: hourZhi,
      shen: jiangAtHour,
    };
  }

  private buildSiKe(
    dayGan: string,
    dayZhi: string,
    hourGan: string,
    hourZhi: string,
    diPan: string[],
    tianJiang: Record<string, string>,
    dunGan: Record<string, string>,
  ): SiKe {
    const dayGanOnDay = tianJiang[dayZhi];
    const dayGanOnHour = tianJiang[hourZhi];
    const hourGanOnDay = tianJiang[dunGan[dayZhi]];
    const hourGanOnHour = tianJiang[dunGan[hourZhi]];

    return {
      gan: {
        yang: `${dayGan}${dayGanOnDay}`,
        yin: `${hourGan}${hourGanOnHour}`,
      },
      zhi: {
        yang: `${dayGan}${dayGanOnHour}`,
        yin: `${hourGan}${hourGanOnDay}`,
      },
    };
  }

  private buildSanChuan(
    siKe: SiKe,
    diPan: string[],
    tianJiang: Record<string, string>,
    shehaiMethod: string,
  ): SanChuan {
    const keList = [siKe.gan.yang, siKe.gan.yin, siKe.zhi.yang, siKe.zhi.yin];

    let chu = "子";
    let zhong = "丑";
    let mo = "寅";

    const tianJiangOrder = [...TIAN_JIANG_ORDER];

    for (const ke of keList) {
      if (ke.length >= 2) {
        const jiang = ke.slice(-1);
        if (tianJiangOrder.includes(jiang)) {
          const idx = tianJiangOrder.indexOf(jiang);
          chu = diPan[idx];
          zhong = diPan[(idx + 1) % 12];
          mo = diPan[(idx + 2) % 12];
          break;
        }
      }
    }

    return { chu, zhong, mo };
  }

  private generateKeTi(yueJiang: string, hourZhi: string): string {
    const jiangMethodText = this.config.jiangMethod === "yue" ? "月将" : "时将";
    return `${jiangMethodText}${yueJiang}加${hourZhi}`;
  }

  private calculateShiShen(
    dayGan: string,
    diPan: string[],
    tianJiang: Record<string, string>,
  ): Record<string, string> {
    const shiShen: Record<string, string> = {};

    for (const dz of diPan) {
      const jiang = tianJiang[dz];
      shiShen[dz] = SHI_SHEN_MAP[dayGan]?.[jiang] || "未知";
    }

    return shiShen;
  }

  private calculateLiuQin(dayGan: string, diPan: string[]): Record<string, string> {
    const liuQin: Record<string, string> = {};
    const tianGanOrder = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const dayIdx = tianGanOrder.indexOf(dayGan);

    const qinTypes = ["比肩", "劫财", "食神", "伤官", "偏财", "正财", "七杀", "正官", "偏印", "正印"];

    for (const dz of diPan) {
      const gan = DUN_GAN[dz];
      const ganIdx = tianGanOrder.indexOf(gan);
      if (ganIdx >= 0) {
        let qinIdx = (ganIdx - dayIdx + 10) % 10;
        liuQin[dz] = qinTypes[qinIdx];
      } else {
        liuQin[dz] = "未知";
      }
    }

    return liuQin;
  }

  private determineYongShen(sanChuan: SanChuan, siKe: SiKe): string {
    return sanChuan.chu;
  }

  analyze(result: LiuRenResult): LiuRenAnalysis {
    const jiangMethodText: Record<string, string> = {
      yue: "月将",
      shi: "时将",
    };

    const keMethodText: Record<string, string> = {
      tian: "天盘",
      di: "地盘",
    };

    const shehaiMethodText: Record<string, string> = {
      mengzhongji: "孟仲季",
      shenqian: "深浅",
    };

    const dayNightText: Record<string, string> = {
      day: "昼",
      night: "夜",
    };

    const patterns: string[] = this.detectPatterns(result);
    const jiXiong = this.judgeJiXiong(result, patterns);

    return {
      keTi: `${result.keTi}, 换将：${jiangMethodText[this.config.jiangMethod || "yue"]}, 起课：${keMethodText[this.config.keMethod || "tian"]}, 涉害：${shehaiMethodText[this.config.shehaiMethod || "mengzhongji"]}, 昼夜：${dayNightText[this.config.dayNight || "day"]}`,
      yongShen: result.yongShen,
      jiXiong,
      detailedAnalysis: `月将${result.tianPan.jiang}临${result.tianPan.position}，发用${result.sanChuan.chu}，中传${result.sanChuan.zhong}，末传${result.sanChuan.mo}。`,
      patterns,
    };
  }

  private detectPatterns(result: LiuRenResult): string[] {
    const patterns: string[] = [];
    const { sanChuan, siKe } = result;

    if (sanChuan.chu === sanChuan.zhong && sanChuan.zhong === sanChuan.mo) {
      patterns.push("三传相同");
    }

    if (DIZHI_CHONG[sanChuan.chu] === sanChuan.mo) {
      patterns.push("首尾相冲");
    }

    if (siKe.gan.yang === siKe.zhi.yang) {
      patterns.push("干支同位");
    }

    return patterns;
  }

  private judgeJiXiong(result: LiuRenResult, patterns: string[]): string {
    if (patterns.includes("三传相同")) return "吉";
    if (patterns.includes("首尾相冲")) return "凶";
    return "平";
  }
}

export default LiuRenEngine;
