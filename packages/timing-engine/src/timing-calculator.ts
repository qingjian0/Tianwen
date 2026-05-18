/**
 * 时间计算器
 */

import { TimingWindow, TimingAnalysis, TimingFactors } from './types';
import { TimeStrength, TimeHorizon, TIME_HORIZON_DAYS, TIME_STRENGTH_LABELS } from './constants';

export class TimingCalculator {
  /**
   * 确定时间强度等级
   */
  static determineStrengthLevel(strength: number): TimeStrength {
    if (strength >= 0.8) return TimeStrength.PEAK;
    if (strength >= 0.6) return TimeStrength.RISING;
    if (strength >= 0.4) return TimeStrength.STABLE;
    if (strength >= 0.2) return TimeStrength.DECLINING;
    return TimeStrength.COLLAPSE;
  }

  /**
   * 创建时间窗口
   */
  static createWindow(
    start: Date,
    end: Date,
    strength: number,
    horizon: TimeHorizon,
    description?: string
  ): TimingWindow {
    const strengthLevel = this.determineStrengthLevel(strength);
    return {
      id: `window_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      start,
      end,
      strength,
      strengthLevel,
      horizon,
      description: description || TIME_STRENGTH_LABELS[strengthLevel],
      tags: [horizon, strengthLevel]
    };
  }

  /**
   * 计算当前时间因素
   */
  static calculateFactors(baseDate: Date = new Date()): TimingFactors {
    const dayOfMonth = baseDate.getDate();
    const dayOfWeek = baseDate.getDay();
    
    const currentPosition = (dayOfMonth % 30) / 30;
    const trendDirection = Math.sin(currentPosition * Math.PI * 2);
    const momentum = 0.5 + Math.cos(currentPosition * Math.PI * 4) * 0.3;
    const cyclePhase = currentPosition;

    return {
      currentPosition,
      trendDirection,
      momentum,
      cyclePhase
    };
  }
}
