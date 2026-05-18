/**
 * MetaphysicsEngine - 统一术数引擎基础接口
 * Phase 2: 所有术数引擎必须实现此接口
 * 包括：梅花、六爻、奇门、八字、紫微等
 */

import { PredictionInput, PredictionResult } from '../prediction-schema';
import { EngineConfig, EngineState, CalculationResult } from './types';

export abstract class MetaphysicsEngine {
  protected config: EngineConfig;
  protected state: EngineState;

  constructor(config: EngineConfig) {
    this.config = config;
    this.state = {
      initialized: false,
      ready: false,
    };
  }

  /**
   * 初始化引擎
   */
  abstract initialize(): Promise<void>;

  /**
   * 执行核心计算
   * 根据输入计算结果
   */
  abstract calculate(input: PredictionInput): Promise<CalculationResult>;

  /**
   * 分析计算结果
   * 生成详细分析
   */
  abstract analyze(calculationResult: CalculationResult): Promise<PredictionResult>;

  /**
   * 生成解读
   * 自然语言解释
   */
  abstract generateInterpretation(result: PredictionResult): Promise<string>;

  /**
   * 获取引擎状态
   */
  getState(): EngineState {
    return this.state;
  }

  /**
   * 获取引擎配置
   */
  getConfig(): EngineConfig {
    return this.config;
  }

  /**
   * 完整推演（一体化流程
   * 调用 initialize -> calculate -> analyze -> generateInterpretation
   */
  async predict(input: PredictionInput): Promise<PredictionResult> {
    if (!this.state.initialized) {
      await this.initialize();
    }

    const calcResult = await this.calculate(input);
    const predictionResult = await this.analyze(calcResult);

    return predictionResult;
  }
}
