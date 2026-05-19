/**
 * 预测服务 - Pipeline 集成
 * 根据天问系统 API 设计文档 v1.0
 */

import { TianwenPipeline, PredictionInput } from '@tianwen/pipeline';
import {
  PredictionRequest,
  PredictionResponse,
  PredictionOutput,
  ApiResponse,
  HistoryResponse,
  HistoryItem,
  HealthCheckResponse,
  VersionResponse
} from './types';

export class PredictionService {
  private pipeline: TianwenPipeline;
  private cache: Map<string, PredictionResponse>;
  private history: PredictionResponse[];

  constructor() {
    this.pipeline = new TianwenPipeline({
      enableCache: true,
      enableConflictResolution: true
    });
    this.cache = new Map();
    this.history = [];
  }

  async predict(request: PredictionRequest): Promise<ApiResponse<PredictionResponse>> {
    const requestId = this.generateRequestId();
    const submittedAt = new Date();
    const estimatedCompletion = new Date(submittedAt.getTime() + 5000);

    const processingResponse: PredictionResponse = {
      id: requestId,
      status: 'processing',
      submittedAt: submittedAt.toISOString(),
      estimatedCompletion: estimatedCompletion.toISOString()
    };

    this.cache.set(requestId, processingResponse);

    try {
      const input: PredictionInput = {
        question: request.question,
        category: request.category,
        system: request.system as any,
        mode: request.mode as any,
        timestamp: request.timestamp ? new Date(request.timestamp) : new Date(),
        birthInfo: request.birthInfo as any
      };

      const result = await this.pipeline.execute(input);

      if (!result.success) {
        const failedResponse: PredictionResponse = {
          id: requestId,
          status: 'failed',
          submittedAt: submittedAt.toISOString()
        };
        this.cache.set(requestId, failedResponse);
        this.history.unshift(failedResponse);

        return {
          success: false,
          data: failedResponse,
          error: result.errors.join(', '),
          timestamp: new Date().toISOString(),
          requestId
        };
      }

      const output: PredictionOutput = {
        summary: result.output.summary,
        probability: {
          success: result.output.probability.success,
          failure: result.output.probability.failure,
          confidence: result.output.probability.confidence
        },
        fortune: {
          level: this.mapFortuneLevel(result.output.fortune.level as string),
          score: result.output.fortune.score,
          description: result.output.fortune.description
        },
        timing: {
          favorable: result.output.timing.favorable,
          unfavorable: result.output.timing.unfavorable,
          optimal: result.output.timing.optimal
        },
        signals: result.output.signals.map(s => ({
          name: s.id,
          value: s.description,
          confidence: s.strength === 'high' ? 0.8 : s.strength === 'medium' ? 0.6 : 0.4,
          polarity: s.polarity as any
        })),
        appliedRules: result.output.appliedRules.map(r => ({
          id: r.id,
          name: r.name,
          description: r.description || '',
          source: r.source,
          priority: this.mapPriority(r.priority),
          matched: r.matched,
          effects: r.effects
        })),
        knowledgeReferences: result.output.knowledgeReferences.map(k => ({
          source: k.title,
          chapter: k.chapter,
          page: k.page,
          author: k.author,
          quote: k.quote
        })),
        calculationTrace: result.output.calculationTrace.map(t => ({
          stage: t.stage,
          result: t.result,
          timestamp: t.timestamp.toISOString(),
          duration: t.duration
        })),
        actionableSuggestions: result.output.actionableSuggestions
      };

      const completedResponse: PredictionResponse = {
        id: requestId,
        status: 'completed',
        submittedAt: submittedAt.toISOString(),
        output
      };

      this.cache.set(requestId, completedResponse);
      this.history.unshift(completedResponse);

      if (this.history.length > 100) {
        this.history.pop();
      }

      return {
        success: true,
        data: completedResponse,
        timestamp: new Date().toISOString(),
        requestId
      };
    } catch (error) {
      const failedResponse: PredictionResponse = {
        id: requestId,
        status: 'failed',
        submittedAt: submittedAt.toISOString()
      };
      this.cache.set(requestId, failedResponse);
      this.history.unshift(failedResponse);

      return {
        success: false,
        data: failedResponse,
        error: error instanceof Error ? error.message : 'Prediction failed',
        timestamp: new Date().toISOString(),
        requestId
      };
    }
  }

  async getPrediction(id: string): Promise<ApiResponse<PredictionResponse>> {
    const cached = this.cache.get(id);
    if (cached) {
      return {
        success: true,
        data: cached,
        timestamp: new Date().toISOString(),
        requestId: id
      };
    }

    const historyItem = this.history.find(h => h.id === id);
    if (historyItem) {
      return {
        success: true,
        data: historyItem,
        timestamp: new Date().toISOString(),
        requestId: id
      };
    }

    return {
      success: false,
      error: 'Prediction not found',
      timestamp: new Date().toISOString(),
      requestId: id
    };
  }

  async getHistory(
    page: number = 1,
    limit: number = 20,
    system?: string,
    category?: string
  ): Promise<ApiResponse<HistoryResponse>> {
    let filtered = [...this.history];

    if (system) {
      filtered = filtered.filter(h => h.id.includes(system));
    }

    if (category) {
      filtered = filtered.filter(h => h.id.includes(category));
    }

    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    const historyItems: HistoryItem[] = items.map(item => ({
      id: item.id,
      question: '',
      system: '',
      category: '',
      status: item.status,
      summary: item.output?.summary,
      fortuneLevel: item.output?.fortune.level,
      createdAt: item.submittedAt
    }));

    return {
      success: true,
      data: {
        items: historyItems,
        total: filtered.length,
        page,
        limit
      },
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    };
  }

  async healthCheck(): Promise<ApiResponse<HealthCheckResponse>> {
    const health = await this.pipeline.healthCheck();

    return {
      success: true,
      data: {
        status: health.healthy ? 'healthy' : 'degraded',
        version: '1.0.0',
        uptime: process.uptime(),
        services: {
          pipeline: health.stages.length > 0,
          ruleEngine: true,
          cache: true
        },
        stats: {
          totalPredictions: this.history.length,
          totalRules: 70,
          cacheHitRate: 0
        }
      },
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    };
  }

  async getVersion(): Promise<ApiResponse<VersionResponse>> {
    return {
      success: true,
      data: {
        version: '1.0.0',
        buildDate: '2026-05-19',
        phases: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6', 'Phase 7'],
        modules: [
          '@tianwen/chrono-engine',
          '@tianwen/meihua',
          '@tianwen/liuyao',
          '@tianwen/bazi-engine',
          '@tianwen/qimen',
          '@tianwen/rule-engine-core',
          '@tianwen/pipeline',
          '@tianwen/api'
        ]
      },
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    };
  }

  private generateRequestId(): string {
    return `prediction_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private mapFortuneLevel(level: string): string {
    const mapping: Record<string, string> = {
      'greatFortune': '大吉',
      'fortune': '吉',
      'neutral': '平',
      'warning': '小凶',
      'danger': '凶'
    };
    return mapping[level] || level;
  }

  private mapPriority(priority: string): number {
    const mapping: Record<string, number> = {
      'critical': 5,
      'high': 4,
      'medium': 3,
      'low': 2,
      'informational': 1
    };
    return mapping[priority] || 3;
  }
}
