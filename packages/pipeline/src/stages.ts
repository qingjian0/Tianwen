/**
 * Pipeline 阶段处理器
 * Phase 6: 各阶段处理逻辑
 */

import { PipelineContext, StageResult } from './types';
import { ChronoEngine } from '@tianwen/chrono-engine';
import { MeihuaEngine } from '@tianwen/meihua';
import { LiuYaoEngine } from '@tianwen/liuyao';
import { BaZiEngine } from '@tianwen/bazi-engine';
import { SignalExtractor } from '@tianwen/signal-extractor';
import {
  RuleEngine,
  RuleContext,
  ResolutionStrategy
} from '@tianwen/rule-engine-core';
import { ProbabilityMapper } from '@tianwen/probability-mapping';
import { FortuneCalculator } from '@tianwen/fortune-engine';
import { TimingCalculator } from '@tianwen/timing-engine';
import { RuleBasedInterpreter } from '@tianwen/interpretation-engine';
import { meihuaRules, liuyaoRules } from '@/knowledge/rules';

/**
 * 阶段处理器接口
 */
export interface StageProcessor {
  process(context: PipelineContext): Promise<StageResult>;
  validate?(context: PipelineContext): boolean;
}

/**
 * 时间计算阶段处理器
 */
export class ChronoProcessor implements StageProcessor {
  private chronoEngine: ChronoEngine;

  constructor() {
    this.chronoEngine = new ChronoEngine();
  }

  async process(context: PipelineContext): Promise<StageResult> {
    const startTime = Date.now();

    try {
      const timestamp = context.input.timestamp || new Date();
      const chronoData = this.chronoEngine.calculate(timestamp);

      const duration = Date.now() - startTime;

      return {
        stage: 'chrono',
        status: 'completed',
        data: chronoData,
        startTime: new Date(startTime),
        endTime: new Date(),
        duration,
        metadata: {
          timestamp: timestamp.toISOString(),
          system: 'ChronoEngine'
        }
      };
    } catch (error) {
      return {
        stage: 'chrono',
        status: 'failed',
        error: error instanceof Error ? error.message : '时间计算失败',
        startTime: new Date(startTime),
        endTime: new Date(),
        duration: Date.now() - startTime
      };
    }
  }
}

/**
 * 起卦排盘阶段处理器
 */
export class DivinationProcessor implements StageProcessor {
  private engines: {
    meihua: MeihuaEngine;
    liuyao: LiuYaoEngine;
    bazi: BaZiEngine;
  };

  constructor() {
    this.engines = {
      meihua: new MeihuaEngine(),
      liuyao: new LiuYaoEngine(),
      bazi: new BaZiEngine()
    };
  }

  async process(context: PipelineContext): Promise<StageResult> {
    const startTime = Date.now();

    try {
      const systems = Array.isArray(context.input.system)
        ? context.input.system
        : [context.input.system];

      const results: Record<string, any> = {};

      for (const system of systems) {
        const timestamp = context.input.timestamp || new Date();
        const chronoResult = context.stageResults.get('chrono')?.data;

        switch (system) {
          case 'meihua':
            results.meihua = this.engines.meihua.divinateByTime(timestamp);
            break;

          case 'liuyao':
            // 六爻需要6次铜钱结果，这里简化处理
            const coinResults = [9, 8, 7, 8, 9, 6]; // 示例数据
            results.liuyao = this.engines.liuyao.divinateByCoin(coinResults, timestamp);
            break;

          case 'bazi':
            if (context.input.birthInfo) {
              const birthDate = new Date(
                context.input.birthInfo.year,
                context.input.birthInfo.month - 1,
                context.input.birthInfo.day,
                context.input.birthInfo.hour
              );
              results.bazi = this.engines.bazi.calculate(
                birthDate,
                context.input.birthInfo.gender
              );
            }
            break;

          default:
            console.warn(`未知的排盘系统: ${system}`);
        }
      }

      const duration = Date.now() - startTime;

      return {
        stage: 'divination',
        status: 'completed',
        data: results,
        startTime: new Date(startTime),
        endTime: new Date(),
        duration,
        metadata: {
          systems: systems,
          resultCount: Object.keys(results).length
        }
      };
    } catch (error) {
      return {
        stage: 'divination',
        status: 'failed',
        error: error instanceof Error ? error.message : '起卦排盘失败',
        startTime: new Date(startTime),
        endTime: new Date(),
        duration: Date.now() - startTime
      };
    }
  }
}

/**
 * 信号提取阶段处理器
 */
export class SignalProcessor implements StageProcessor {
  private extractor: SignalExtractor;

  constructor() {
    this.extractor = new SignalExtractor();
  }

  async process(context: PipelineContext): Promise<StageResult> {
    const startTime = Date.now();

    try {
      const divinationResults = context.stageResults.get('divination')?.data;
      if (!divinationResults) {
        throw new Error('缺少排盘结果');
      }

      const signals: any[] = [];

      // 提取各系统信号
      if (divinationResults.meihua) {
        const meihuaSignals = this.extractor.extractMeihua(divinationResults.meihua);
        signals.push(...meihuaSignals.signals);
      }

      if (divinationResults.liuyao) {
        const liuyaoSignals = this.extractor.extractLiuYao(divinationResults.liuyao);
        signals.push(...liuyaoSignals.signals);
      }

      if (divinationResults.bazi) {
        const baziSignals = this.extractor.extractBaZi(divinationResults.bazi);
        signals.push(...baziSignals.signals);
      }

      context.signals = signals;

      const duration = Date.now() - startTime;

      return {
        stage: 'signal',
        status: 'completed',
        data: signals,
        startTime: new Date(startTime),
        endTime: new Date(),
        duration,
        metadata: {
          signalCount: signals.length,
          systems: Object.keys(divinationResults)
        }
      };
    } catch (error) {
      return {
        stage: 'signal',
        status: 'failed',
        error: error instanceof Error ? error.message : '信号提取失败',
        startTime: new Date(startTime),
        endTime: new Date(),
        duration: Date.now() - startTime
      };
    }
  }
}

/**
 * 规则评估阶段处理器
 */
export class RuleProcessor implements StageProcessor {
  private engine: RuleEngine;

  constructor() {
    this.engine = new RuleEngine();
    // 加载规则
    this.engine.addRules(meihuaRules);
    this.engine.addRules(liuyaoRules);
  }

  async process(context: PipelineContext): Promise<StageResult> {
    const startTime = Date.now();

    try {
      // 构建规则上下文
      const ruleContext: RuleContext = {
        data: this.buildRuleContextData(context),
        timestamp: new Date()
      };

      // 执行规则（包含冲突处理）
      const { result, conflictResolution } = this.engine.executeAndGetResultWithConflictResolution(
        ruleContext,
        ResolutionStrategy.PRIORITY_BASED
      );

      context.ruleContext = ruleContext;
      context.conflictResolution = conflictResolution;

      const duration = Date.now() - startTime;

      return {
        stage: 'rule',
        status: 'completed',
        data: {
          result,
          conflictResolution,
          matchedRules: conflictResolution.resolvedMatches.filter(m => m.matched).length,
          skippedRules: conflictResolution.skippedRuleIds.length
        },
        startTime: new Date(startTime),
        endTime: new Date(),
        duration,
        metadata: {
          ruleCount: this.engine.getRules().length,
          strategy: 'Priority'
        }
      };
    } catch (error) {
      return {
        stage: 'rule',
        status: 'failed',
        error: error instanceof Error ? error.message : '规则评估失败',
        startTime: new Date(startTime),
        endTime: new Date(),
        duration: Date.now() - startTime
      };
    }
  }

  private buildRuleContextData(context: PipelineContext): any {
    const data: any = {};
    const divinationResults = context.stageResults.get('divination')?.data;

    if (divinationResults?.meihua) {
      data.tiyong = {
        relation: 'yongshengti',
        ti: { wuxing: 'jin' },
        yong: { wuxing: 'tu' }
      };
      data.dongyaoCount = divinationResults.meihua.dongYaoPositions?.length || 0;
      data.hasBiangua = !!divinationResults.meihua.bianGua;
      data.system = 'meihua';
    }

    if (divinationResults?.bazi) {
      data.dayMasterStrength = divinationResults.bazi.dayMasterStrength;
      data.favorableWuxing = divinationResults.bazi.favorableWuxing;
    }

    data.question = context.input.question;
    data.category = context.input.category;
    data.timestamp = new Date().toISOString();

    return data;
  }
}

/**
 * 概率映射阶段处理器
 */
export class ProbabilityProcessor implements StageProcessor {
  private mapper: ProbabilityMapper;

  constructor() {
    this.mapper = new ProbabilityMapper();
  }

  async process(context: PipelineContext): Promise<StageResult> {
    const startTime = Date.now();

    try {
      const signals = context.signals;
      if (signals.length === 0) {
        throw new Error('缺少信号数据');
      }

      const probResult = this.mapper.mapSignals(signals);
      context.probabilityScore = probResult.probabilityScore;

      const duration = Date.now() - startTime;

      return {
        stage: 'probability',
        status: 'completed',
        data: probResult,
        startTime: new Date(startTime),
        endTime: new Date(),
        duration,
        metadata: {
          successProbability: probResult.probabilityScore.successProbability,
          confidence: probResult.probabilityScore.confidence
        }
      };
    } catch (error) {
      return {
        stage: 'probability',
        status: 'failed',
        error: error instanceof Error ? error.message : '概率映射失败',
        startTime: new Date(startTime),
        endTime: new Date(),
        duration: Date.now() - startTime
      };
    }
  }
}

/**
 * 吉凶计算阶段处理器
 */
export class FortuneProcessor implements StageProcessor {
  private calculator: FortuneCalculator;

  constructor() {
    this.calculator = new FortuneCalculator();
  }

  async process(context: PipelineContext): Promise<StageResult> {
    const startTime = Date.now();

    try {
      const probabilityScore = context.probabilityScore;
      if (!probabilityScore) {
        throw new Error('缺少概率分数');
      }

      const fortuneLevel = this.calculator.calculateFortuneLevel(probabilityScore);

      context.fortuneLevel = fortuneLevel;

      const duration = Date.now() - startTime;

      return {
        stage: 'fortune',
        status: 'completed',
        data: {
          level: fortuneLevel,
          description: this.getFortuneDescription(fortuneLevel)
        },
        startTime: new Date(startTime),
        endTime: new Date(),
        duration
      };
    } catch (error) {
      return {
        stage: 'fortune',
        status: 'failed',
        error: error instanceof Error ? error.message : '吉凶计算失败',
        startTime: new Date(startTime),
        endTime: new Date(),
        duration: Date.now() - startTime
      };
    }
  }

  private getFortuneDescription(level: string): string {
    const descriptions: Record<string, string> = {
      greatFortune: '大吉，诸事顺遂，吉祥如意',
      fortune: '吉，事事顺利，有贵人相助',
      neutral: '平，中规中矩，需要努力',
      warning: '凶，需谨慎行事，防患未然',
      danger: '大凶，形势严峻，宜静不宜动'
    };
    return descriptions[level] || '平';
  }
}

/**
 * 解释生成阶段处理器
 */
export class InterpretationProcessor implements StageProcessor {
  private interpreter: RuleBasedInterpreter;

  constructor() {
    this.interpreter = new RuleBasedInterpreter({
      maxRulesToShow: 10,
      maxSignalsToShow: 15
    });
  }

  async process(context: PipelineContext): Promise<StageResult> {
    const startTime = Date.now();

    try {
      const probabilityScore = context.probabilityScore;
      const fortuneLevel = context.fortuneLevel;

      if (!probabilityScore || !fortuneLevel) {
        throw new Error('缺少必要数据');
      }

      // 构建规则执行结果（简化版）
      const ruleExecutionResults: any[] = [];
      const ruleContext = context.stageResults.get('rule')?.data;
      if (ruleContext?.conflictResolution?.resolvedMatches) {
        for (const match of ruleContext.conflictResolution.resolvedMatches) {
          if (match.matched) {
            ruleExecutionResults.push({
              rule: match.rule,
              executed: true,
              matched: true,
              appliedEffects: match.rule.effects
            });
          }
        }
      }

      const interpretation = this.interpreter.generateInterpretation(
        ruleExecutionResults,
        context.signals,
        probabilityScore,
        fortuneLevel as any,
        context.ruleContext
      );

      context.interpretation = interpretation;

      const duration = Date.now() - startTime;

      return {
        stage: 'interpretation',
        status: 'completed',
        data: interpretation,
        startTime: new Date(startTime),
        endTime: new Date(),
        duration,
        metadata: {
          hasSummary: !!interpretation.summary,
          hasSuggestions: interpretation.actionableSuggestions.length > 0
        }
      };
    } catch (error) {
      return {
        stage: 'interpretation',
        status: 'failed',
        error: error instanceof Error ? error.message : '解释生成失败',
        startTime: new Date(startTime),
        endTime: new Date(),
        duration: Date.now() - startTime
      };
    }
  }
}
