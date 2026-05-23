/**
 * 窗口生成器
 */

import { TimingWindow, TimingAnalysis } from "./types";
import { TimingCalculator } from "./timing-calculator";
import { TimeHorizon, TIME_HORIZON_DAYS } from "./constants";

export class WindowGenerator {
  /**
   * 生成时间窗口分析
   */
  static generateAnalysis(baseDate: Date = new Date()): TimingAnalysis {
    const factors = TimingCalculator.calculateFactors(baseDate);
    const currentStrength = 0.5 + factors.trendDirection * 0.3;

    const currentWindow = TimingCalculator.createWindow(
      baseDate,
      this.addDays(baseDate, TIME_HORIZON_DAYS[TimeHorizon.SHORT]),
      currentStrength,
      TimeHorizon.SHORT,
      "当前时间窗口",
    );

    const upcomingWindows = this.generateUpcomingWindows(baseDate);
    const recommendations = this.generateRecommendations(
      currentWindow,
      upcomingWindows,
    );

    return {
      currentWindow,
      upcomingWindows,
      recommendations,
    };
  }

  /**
   * 生成未来窗口
   */
  private static generateUpcomingWindows(baseDate: Date): TimingWindow[] {
    const windows: TimingWindow[] = [];
    let currentDate = this.addDays(
      baseDate,
      TIME_HORIZON_DAYS[TimeHorizon.SHORT],
    );

    for (let i = 0; i < 3; i++) {
      const strength = 0.3 + Math.random() * 0.5;
      const horizon = i === 0 ? TimeHorizon.MEDIUM : TimeHorizon.LONG;
      const days = TIME_HORIZON_DAYS[horizon];

      const window = TimingCalculator.createWindow(
        currentDate,
        this.addDays(currentDate, days),
        strength,
        horizon,
        `未来第${i + 1}个时间窗口`,
      );

      windows.push(window);
      currentDate = this.addDays(currentDate, days);
    }

    return windows;
  }

  /**
   * 生成建议
   */
  private static generateRecommendations(
    currentWindow: TimingWindow,
    upcomingWindows: TimingWindow[],
  ): string[] {
    const recommendations: string[] = [];

    if (currentWindow.strength >= 0.7) {
      recommendations.push("当前是行动的好时机");
    } else if (currentWindow.strength <= 0.3) {
      recommendations.push("建议暂缓重大决策");
    } else {
      recommendations.push("保持观望，观察局势变化");
    }

    const bestUpcoming = upcomingWindows.reduce(
      (best, w) => (w.strength > best.strength ? w : best),
      upcomingWindows[0],
    );

    if (bestUpcoming && bestUpcoming.strength > currentWindow.strength) {
      recommendations.push("未来有更好的时机，可考虑等待");
    }

    return recommendations;
  }

  /**
   * 添加天数
   */
  private static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
