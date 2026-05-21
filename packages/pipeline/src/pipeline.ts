/**
 * 天问推演流水线主类
 * Phase 6: Pipeline 核心引擎
 */

import {
  PipelineContext,
  PipelineResult,
  PipelineConfig,
  PipelineStage,
  PredictionInput,
  PredictionOutput,
  StageResult,
  TraceStep
} from './types';
import { PipelineContextManager } from './pipeline-context';
import {
  RandomProcessor,
  ChronoProcessor,
  DivinationProcessor,
  SignalProcessor,
  RuleProcessor,
  ProbabilityProcessor,
  FortuneProcessor,
  InterpretationProcessor,
  StageProcessor
} from './stages';
import { DEFAULT_PIPELINE_CONFIG, PIPELINE_STAGE_ORDER } from './constants';

/**
 * 天问推演流水线
 */
export class TianwenPipeline {
  private config: PipelineConfig;
  private contextManager: PipelineContextManager;
  private processors: Map<PipelineStage, StageProcessor>;

  constructor(config?: Partial<PipelineConfig>) {
    this.config = { ...DEFAULT_PIPELINE_CONFIG, ...config };
    this.contextManager = new PipelineContextManager();
    this.processors = new Map();

    // 初始化阶段处理器
    this.initializeProcessors();
  }

  /**
   * 初始化阶段处理器
   */
  private initializeProcessors(): void {
    this.processors.set('random', new RandomProcessor());
    this.processors.set('chrono', new ChronoProcessor());
    this.processors.set('divination', new DivinationProcessor());
    this.processors.set('signal', new SignalProcessor());
    this.processors.set('rule', new RuleProcessor());
    this.processors.set('probability', new ProbabilityProcessor());
    this.processors.set('fortune', new FortuneProcessor());
    this.processors.set('interpretation', new InterpretationProcessor());
  }

  /**
   * 执行推演
   */
  async execute(input: PredictionInput): Promise<PipelineResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. 创建上下文
    const context = this.contextManager.createContext(input);
    this.contextManager.markStageStart(context, 'input');

    // 2. 标记输入完成
    this.contextManager.markStageComplete(context, 'input', input);

    try {
      // 3. 依次执行各阶段
      const stages = this.getEnabledStages();

      for (const stage of stages) {
        await this.executeStage(context, stage, errors, warnings);
      }

      // 4. 生成最终输出
      const output = this.generateOutput(context);

      // 5. 标记完成
      this.contextManager.completePipeline(context);

      return {
        success: errors.length === 0,
        context,
        output,
        errors,
        warnings
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '流水线执行失败';
      errors.push(errorMsg);

      return {
        success: false,
        context,
        output: this.generateOutput(context),
        errors,
        warnings
      };
    }
  }

  /**
   * 执行单个阶段
   */
  private async executeStage(
    context: PipelineContext,
    stage: PipelineStage,
    errors: string[],
    warnings: string[]
  ): Promise<void> {
    const processor = this.processors.get(stage);
    if (!processor) {
      warnings.push(`阶段 ${stage} 没有处理器，跳过`);
      this.contextManager.markStageSkipped(context, stage, 'No processor');
      return;
    }

    // 检查是否应跳过
    if (this.shouldSkipStage(context, stage)) {
      this.contextManager.markStageSkipped(context, stage, 'Dependency not met');
      return;
    }

    this.contextManager.markStageStart(context, stage);

    try {
      const result = await this.executeStageWithTimeout(processor, context);

      if (result.status === 'completed') {
        this.contextManager.markStageComplete(context, stage, result.data, result.metadata);
      } else if (result.status === 'failed') {
        errors.push(`${stage}: ${result.error}`);
        
        const stageConfig = this.getStageConfig(stage);
        if (stageConfig?.onError === 'fail') {
          throw new Error(result.error);
        } else if (stageConfig?.onError === 'skip') {
          this.contextManager.markStageSkipped(context, stage, result.error);
        } else {
          this.contextManager.markStageFailed(context, stage, result.error!);
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '阶段执行失败';
      this.contextManager.markStageFailed(context, stage, errorMsg);
      errors.push(`${stage}: ${errorMsg}`);

      const stageConfig = this.getStageConfig(stage);
      if (stageConfig?.onError === 'fail') {
        throw error;
      }
    }
  }

  /**
   * 带超时的阶段执行
   */
  private async executeStageWithTimeout(
    processor: StageProcessor,
    context: PipelineContext,
    timeout?: number
  ): Promise<StageResult> {
    const timeoutMs = timeout || 10000;

    return Promise.race([
      processor.process(context),
      new Promise<StageResult>((_, reject) =>
        setTimeout(() => reject(new Error('Stage timeout')), timeoutMs)
      )
    ]);
  }

  /**
   * 获取启用的阶段列表
   */
  private getEnabledStages(): PipelineStage[] {
    const enabled: PipelineStage[] = [];

    for (const stageName of PIPELINE_STAGE_ORDER) {
      const stage = stageName as PipelineStage;
      const stageConfig = this.config.stages.find(s => s.name === stage);

      if (!stageConfig || stageConfig.enabled) {
        enabled.push(stage);
      }
    }

    return enabled;
  }

  /**
   * 检查是否应跳过阶段
   */
  private shouldSkipStage(context: PipelineContext, stage: PipelineStage): boolean {
    switch (stage) {
      case 'random':
        return false;

      case 'chrono':
        return false;

      case 'divination':
        return !this.contextManager.isStageCompleted(context, 'chrono');

      case 'signal':
        return !this.contextManager.isStageCompleted(context, 'divination');

      case 'rule':
        if (!this.config.rules?.enabled) return true;
        return !this.contextManager.isStageCompleted(context, 'signal');

      case 'conflict':
        if (!this.config.enableConflictResolution) return true;
        return !this.contextManager.isStageCompleted(context, 'rule');

      case 'probability':
        const needSignal = this.contextManager.isStageCompleted(context, 'signal');
        const needRule = this.contextManager.isStageCompleted(context, 'rule');
        return !needSignal && !needRule;

      case 'fortune':
        return !this.contextManager.isStageCompleted(context, 'probability');

      case 'timing':
        return !this.contextManager.isStageCompleted(context, 'fortune');

      case 'interpretation':
        if (!this.config.interpretation?.enabled) return true;
        return !this.contextManager.isStageCompleted(context, 'fortune');

      case 'output':
        return !this.contextManager.isStageCompleted(context, 'interpretation');

      default:
        return false;
    }
  }

  /**
   * 获取阶段配置
   */
  private getStageConfig(stage: PipelineStage) {
    return this.config.stages.find(s => s.name === stage);
  }

  /**
   * 生成最终输出
   */
  private generateOutput(context: PipelineContext): PredictionOutput {
    const interpretation = context.interpretation;
    const probabilityScore = context.probabilityScore;
    const fortuneLevel = context.fortuneLevel;

    // 生成计算轨迹
    const calculationTrace = this.generateTrace(context);

    // 构建信号输出
    const signalOutputs = context.signals.map(signal => ({
      id: signal.id,
      description: signal.description || '',
      polarity: signal.polarity,
      strength: signal.strength,
      source: signal.source,
      sourceRule: undefined
    }));

    // 构建规则输出
    const ruleOutputs: any[] = [];
    const ruleData = context.stageResults.get('rule')?.data;
    if (ruleData?.conflictResolution?.resolvedMatches) {
      for (const match of ruleData.conflictResolution.resolvedMatches) {
        if (match.matched) {
          ruleOutputs.push({
            id: match.rule.metadata.id,
            name: match.rule.metadata.name,
            category: match.rule.metadata.category,
            priority: match.rule.metadata.priority,
            source: match.rule.metadata.source.name,
            confidence: match.rule.confidence || 0.8,
            matched: true,
            effects: match.rule.effects.map(e => e.description || e.type)
          });
        }
      }
    }

    // 构建知识引用
    const knowledgeReferences: any[] = [];
    if (interpretation?.knowledgeReferences) {
      for (const ref of interpretation.knowledgeReferences) {
        knowledgeReferences.push({
          title: ref.title,
          author: ref.author,
          chapter: ref.chapter,
          page: ref.page,
          quote: ref.quote
        });
      }
    }

    return {
      summary: interpretation?.summary || '推演完成',
      probability: {
        success: probabilityScore?.successProbability || 0.5,
        failure: probabilityScore?.failureProbability || 0.5,
        confidence: probabilityScore?.confidence || 0.5
      },
      fortune: {
        level: fortuneLevel || 'neutral',
        score: interpretation?.fortuneLevel || 50,
        description: interpretation?.summary || ''
      },
      timing: {
        favorable: interpretation?.timingAdvice || [],
        unfavorable: [],
        optimal: undefined
      },
      signals: signalOutputs,
      appliedRules: ruleOutputs,
      knowledgeReferences,
      calculationTrace,
      actionableSuggestions: interpretation?.actionableSuggestions || []
    };
  }

  /**
   * 生成计算轨迹
   */
  private generateTrace(context: PipelineContext): TraceStep[] {
    const trace: TraceStep[] = [];

    for (const [stage, result] of context.stageResults.entries()) {
      trace.push({
        stage,
        timestamp: result.startTime,
        action: this.getStageAction(stage, result),
        result: this.getStageResultDescription(stage, result),
        duration: result.duration || 0
      });
    }

    return trace;
  }

  /**
   * 获取阶段动作描述
   */
  private getStageAction(stage: PipelineStage, result: StageResult): string {
    const actions: Record<PipelineStage, string> = {
      input: '接收用户输入',
      random: '生成随机数',
      chrono: '计算时间干支',
      divination: '起卦排盘',
      signal: '提取信号',
      rule: '规则匹配',
      conflict: '冲突检测与解决',
      probability: '概率映射',
      fortune: '吉凶判定',
      timing: '时间分析',
      interpretation: '生成解释',
      output: '输出结果'
    };
    return actions[stage] || stage;
  }

  /**
   * 获取阶段结果描述
   */
  private getStageResultDescription(stage: PipelineStage, result: StageResult): string {
    if (result.status === 'failed') {
      return `失败: ${result.error}`;
    }
    if (result.status === 'skipped') {
      return '已跳过';
    }

    const stageResult = result.data;
    if (!stageResult) return '完成';

    switch (stage) {
      case 'random':
        return `生成 ${stageResult.numbers?.length || 0} 个随机数`;
      case 'chrono':
        return '时间计算完成';
      case 'divination':
        return `生成 ${Object.keys(stageResult).length} 种排盘`;
      case 'signal':
        return `提取 ${stageResult.length || 0} 个信号`;
      case 'rule':
        return `匹配 ${stageResult.matchedRules || 0} 条规则`;
      case 'probability':
        return `成功概率 ${Math.round(stageResult.probabilityScore?.successProbability * 100)}%`;
      case 'fortune':
        return `吉凶等级: ${stageResult.level}`;
      case 'interpretation':
        return '解释生成完成';
      default:
        return '完成';
    }
  }

  /**
   * 获取上下文管理器
   */
  getContextManager(): PipelineContextManager {
    return this.contextManager;
  }

  /**
   * 获取流水线配置
   */
  getConfig(): PipelineConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<PipelineConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 注册自定义处理器
   */
  registerProcessor(stage: PipelineStage, processor: StageProcessor): void {
    this.processors.set(stage, processor);
  }

  /**
   * 获取处理器
   */
  getProcessor(stage: PipelineStage): StageProcessor | undefined {
    return this.processors.get(stage);
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<{ healthy: boolean; stages: string[] }> {
    const healthyStages: string[] = [];

    for (const [stage, processor] of this.processors.entries()) {
      if (processor) {
        healthyStages.push(stage);
      }
    }

    return {
      healthy: healthyStages.length === PIPELINE_STAGE_ORDER.length,
      stages: healthyStages
    };
  }
}
