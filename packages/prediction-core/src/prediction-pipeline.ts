/**
 * 推演流水线
 */

import {
  PredictionContext,
  PredictionOutput,
  PredictionInput,
  PipelineState
} from './types';
import { PredictionContextManager } from './prediction-context';
import { PipelineStage } from './constants';
import { Signal } from '@tianwen/signal-system';

export class PredictionPipeline {
  private state: PipelineState;
  private listeners: Array<(state: PipelineState) => void> = [];

  constructor() {
    this.state = {
      stage: PipelineStage.INPUT,
      signals: [],
      errors: [],
      warnings: []
    };
  }

  /**
   * 订阅状态变化
   */
  subscribe(listener: (state: PipelineState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * 通知状态变化
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * 更新状态
   */
  private updateState(updates: Partial<PipelineState>): void {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  /**
   * 执行推演流水线
   */
  async execute(input: PredictionInput): Promise<PredictionOutput> {
    try {
      // Stage 1: 输入处理
      this.updateState({ stage: PipelineStage.INPUT });
      const context = PredictionContextManager.create(input);
      
      if (!PredictionContextManager.validate(context)) {
        throw new Error('Invalid prediction context');
      }

      this.updateState({ context });

      // Stage 2: 预处理
      this.updateState({ stage: PipelineStage.PREPROCESSING });
      const preprocessedContext = await this.preprocess(context);
      this.updateState({ context: preprocessedContext });

      // Stage 3: 系统执行（占位）
      this.updateState({ stage: PipelineStage.SYSTEM_EXECUTION });
      const signals = await this.executeSystems(preprocessedContext);
      this.updateState({ signals });

      // Stage 4: 融合（占位）
      this.updateState({ stage: PipelineStage.FUSION });
      const fusedSignals = await this.fuseSignals(signals);

      // Stage 5: 概率评分（占位）
      this.updateState({ stage: PipelineStage.PROBABILITY_SCORING });

      // Stage 6: 解释生成（占位）
      this.updateState({ stage: PipelineStage.INTERPRETATION });
      const output = await this.generateOutput(preprocessedContext, fusedSignals);

      // 完成
      this.updateState({
        stage: PipelineStage.COMPLETE,
        outputs: output
      });

      return output;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.updateState({
        errors: [...this.state.errors, errorMessage]
      });
      throw error;
    }
  }

  /**
   * 预处理
   */
  private async preprocess(context: PredictionContext): Promise<PredictionContext> {
    return {
      ...context,
      metadata: {
        ...context.metadata,
        preprocessed: true,
        preprocessingTimestamp: new Date()
      }
    };
  }

  /**
   * 执行术数系统
   */
  private async executeSystems(context: PredictionContext): Promise<Signal[]> {
    return [];
  }

  /**
   * 信号融合
   */
  private async fuseSignals(signals: Signal[]): Promise<Signal[]> {
    return signals;
  }

  /**
   * 生成输出
   */
  private async generateOutput(
    context: PredictionContext,
    signals: Signal[]
  ): Promise<PredictionOutput> {
    return {
      id: `output_${Date.now()}`,
      contextId: context.id,
      summary: '推演结果待生成',
      probability: 0.5,
      fortuneLevel: 'neutral',
      timingWindows: [],
      keySignals: signals,
      risks: [],
      opportunities: [],
      suggestions: [],
      confidence: 0.5,
      timestamp: new Date()
    };
  }

  /**
   * 获取当前状态
   */
  getState(): PipelineState {
    return this.state;
  }

  /**
   * 重置流水线
   */
  reset(): void {
    this.state = {
      stage: PipelineStage.INPUT,
      signals: [],
      errors: [],
      warnings: []
    };
    this.notify();
  }
}
