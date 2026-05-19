/**
 * 天问事件类型
 */

import { EventBus } from './event-bus';

export const TIANWEN_EVENTS = {
  // 预测流程事件
  PREDICTION: {
    REQUESTED: 'prediction.requested',
    CHRONO_COMPLETED: 'prediction.chrono.completed',
    DIVINATION_COMPLETED: 'prediction.divination.completed',
    SIGNALS_EXTRACTED: 'prediction.signals.extracted',
    RULES_EXECUTED: 'prediction.rules.executed',
    CONFLICT_RESOLVED: 'prediction.conflict.resolved',
    FORTUNE_CALCULATED: 'prediction.fortune.calculated',
    COMPLETED: 'prediction.completed',
    FAILED: 'prediction.failed',
    PROGRESS: 'prediction.progress',
  },

  // 规则引擎事件
  RULES: {
    MATCHED: 'rules.matched',
    EFFECT_APPLIED: 'rules.effect.applied',
    CONFLICT_DETECTED: 'rules.conflict.detected',
  },

  // 系统事件
  SYSTEM: {
    READY: 'system.ready',
    ERROR: 'system.error',
    HEALTH_CHECK: 'system.health',
  },

  // 数据事件
  DATA: {
    LOADED: 'data.loaded',
    SAVED: 'data.saved',
  }
};

// 创建全局事件总线
export const globalEventBus = new EventBus();
export { EventBus };

// 事件发射器辅助类
export class TianwenEventEmitter {
  private bus: EventBus;
  private prefix: string;

  constructor(prefix: string = '', bus?: EventBus) {
    this.prefix = prefix ? `${prefix}.` : '';
    this.bus = bus || globalEventBus;
  }

  emit(eventType: string, payload: any, metadata?: Record<string, any>) {
    this.bus.emit(this.prefix + eventType, payload, metadata);
  }

  on(eventType: string, handler: any, options?: any) {
    return this.bus.on(this.prefix + eventType, handler, options);
  }

  emitPredictionRequested(data: any) {
    this.emit('prediction.requested', data);
  }

  emitChronoCompleted(data: any) {
    this.emit('prediction.chrono.completed', data);
  }

  emitDivinationCompleted(data: any) {
    this.emit('prediction.divination.completed', data);
  }

  emitSignalsExtracted(data: any) {
    this.emit('prediction.signals.extracted', data);
  }

  emitRulesExecuted(data: any) {
    this.emit('prediction.rules.executed', data);
  }

  emitConflictResolved(data: any) {
    this.emit('prediction.conflict.resolved', data);
  }

  emitFortuneCalculated(data: any) {
    this.emit('prediction.fortune.calculated', data);
  }

  emitPredictionCompleted(data: any) {
    this.emit('prediction.completed', data);
  }

  emitPredictionFailed(error: any) {
    this.emit('prediction.failed', { error });
  }

  emitProgress(progress: number, stage: string, message?: string) {
    this.emit('prediction.progress', { progress, stage, message });
  }
}
