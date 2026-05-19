/**
 * Pipeline 上下文管理
 */

import { PipelineContext, PipelineStage, StageResult, PredictionInput, PipelineMetadata } from './types';

export class PipelineContextManager {
  private contexts: Map<string, PipelineContext> = new Map();

  /**
   * 创建新的 Pipeline 上下文
   */
  createContext(input: PredictionInput): PipelineContext {
    const id = this.generateId();
    const metadata: PipelineMetadata = {
      version: '1.0.0',
      createdAt: new Date(),
      cacheHit: false,
      system: 'Tianwen-Pipeline-v1'
    };

    const context: PipelineContext = {
      id,
      input,
      currentStage: 'input',
      stageResults: new Map(),
      signals: [],
      metadata
    };

    this.contexts.set(id, context);
    return context;
  }

  /**
   * 获取上下文
   */
  getContext(id: string): PipelineContext | undefined {
    return this.contexts.get(id);
  }

  /**
   * 更新当前阶段
   */
  updateStage(context: PipelineContext, stage: PipelineStage): void {
    context.currentStage = stage;
  }

  /**
   * 记录阶段结果
   */
  recordStageResult(
    context: PipelineContext,
    stage: PipelineStage,
    status: StageResult['status'],
    data?: any,
    error?: string,
    metadata?: Record<string, any>
  ): StageResult {
    const startTime = context.stageResults.get(stage)?.startTime || new Date();
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    const result: StageResult = {
      stage,
      status,
      data,
      error,
      startTime,
      endTime,
      duration,
      metadata
    };

    context.stageResults.set(stage, result);
    return result;
  }

  /**
   * 标记阶段开始
   */
  markStageStart(context: PipelineContext, stage: PipelineStage): void {
    context.stageResults.set(stage, {
      stage,
      status: 'processing',
      startTime: new Date()
    });
  }

  /**
   * 标记阶段完成
   */
  markStageComplete(
    context: PipelineContext,
    stage: PipelineStage,
    data?: any,
    metadata?: Record<string, any>
  ): StageResult {
    return this.recordStageResult(context, stage, 'completed', data, undefined, metadata);
  }

  /**
   * 标记阶段失败
   */
  markStageFailed(
    context: PipelineContext,
    stage: PipelineStage,
    error: string,
    metadata?: Record<string, any>
  ): StageResult {
    return this.recordStageResult(context, stage, 'failed', undefined, error, metadata);
  }

  /**
   * 标记阶段跳过
   */
  markStageSkipped(
    context: PipelineContext,
    stage: PipelineStage,
    reason?: string
  ): StageResult {
    return this.recordStageResult(context, stage, 'skipped', undefined, reason);
  }

  /**
   * 获取阶段状态
   */
  getStageStatus(context: PipelineContext, stage: PipelineStage): StageResult['status'] | undefined {
    return context.stageResults.get(stage)?.status;
  }

  /**
   * 获取阶段结果
   */
  getStageResult<T = any>(context: PipelineContext, stage: PipelineStage): StageResult<T> | undefined {
    return context.stageResults.get(stage) as StageResult<T> | undefined;
  }

  /**
   * 检查阶段是否完成
   */
  isStageCompleted(context: PipelineContext, stage: PipelineStage): boolean {
    return this.getStageStatus(context, stage) === 'completed';
  }

  /**
   * 获取已完成阶段列表
   */
  getCompletedStages(context: PipelineContext): PipelineStage[] {
    const completed: PipelineStage[] = [];
    for (const [stage, result] of context.stageResults.entries()) {
      if (result.status === 'completed') {
        completed.push(stage);
      }
    }
    return completed;
  }

  /**
   * 获取失败阶段列表
   */
  getFailedStages(context: PipelineContext): PipelineStage[] {
    const failed: PipelineStage[] = [];
    for (const [stage, result] of context.stageResults.entries()) {
      if (result.status === 'failed') {
        failed.push(stage);
      }
    }
    return failed;
  }

  /**
   * 计算总执行时间
   */
  calculateTotalDuration(context: PipelineContext): number {
    let total = 0;
    for (const result of context.stageResults.values()) {
      if (result.duration) {
        total += result.duration;
      }
    }
    return total;
  }

  /**
   * 标记流水线完成
   */
  completePipeline(context: PipelineContext): void {
    context.metadata.completedAt = new Date();
    context.metadata.totalDuration = this.calculateTotalDuration(context);
  }

  /**
   * 删除上下文
   */
  deleteContext(id: string): boolean {
    return this.contexts.delete(id);
  }

  /**
   * 清理过期上下文（1小时前的）
   */
  cleanupExpiredContexts(): number {
    const now = Date.now();
    const expiryTime = 60 * 60 * 1000; // 1 hour
    let deletedCount = 0;

    for (const [id, context] of this.contexts.entries()) {
      if (now - context.metadata.createdAt.getTime() > expiryTime) {
        this.contexts.delete(id);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `tianwen_${timestamp}_${randomPart}`;
  }

  /**
   * 序列化上下文（用于存储）
   */
  serializeContext(context: PipelineContext): string {
    const serialized = {
      ...context,
      stageResults: Array.from(context.stageResults.entries())
    };
    return JSON.stringify(serialized);
  }

  /**
   * 反序列化上下文（从存储恢复）
   */
  deserializeContext(data: string): PipelineContext {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      stageResults: new Map(parsed.stageResults)
    };
  }
}
