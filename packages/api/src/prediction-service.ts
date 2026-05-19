/**
 * 预测服务 - Pipeline 集成
 */

import { TianwenPipeline, PredictionInput } from '@tianwen/pipeline';
import {
  PredictionRequest,
  PredictionResponse,
  ApiResponse
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
    const startTime = Date.now();

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
        return {
          success: false,
          error: result.errors.join(', '),
          timestamp: new Date().toISOString(),
          requestId
        };
      }

      const response: PredictionResponse = {
        predictionId: requestId,
        summary: result.output.summary,
        probability: result.output.probability,
        fortune: result.output.fortune as any,
        timing: result.output.timing,
        signals: result.output.signals.map(s => ({
          id: s.id,
          description: s.description,
          polarity: s.polarity as any,
          strength: s.strength as any,
          source: s.source
        })),
        appliedRules: result.output.appliedRules.map(r => ({
          id: r.id,
          name: r.name,
          category: r.category,
          priority: r.priority,
          source: r.source,
          confidence: r.confidence,
          matched: r.matched,
          effects: r.effects
        })),
        knowledgeReferences: result.output.knowledgeReferences.map(k => ({
          title: k.title,
          author: k.author,
          chapter: k.chapter,
          page: k.page,
          quote: k.quote
        })),
        calculationTrace: result.output.calculationTrace.map(t => ({
          stage: t.stage,
          timestamp: t.timestamp.toISOString(),
          action: t.action,
          result: t.result,
          duration: t.duration
        })),
        actionableSuggestions: result.output.actionableSuggestions,
        createdAt: new Date().toISOString()
      };

      this.cache.set(requestId, response);
      this.history.unshift(response);

      if (this.history.length > 100) {
        this.history.pop();
      }

      return {
        success: true,
        data: response,
        timestamp: new Date().toISOString(),
        requestId
      };
    } catch (error) {
      return {
        success: false,
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

    const historyItem = this.history.find(h => h.predictionId === id);
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
    limit: number = 20
  ): Promise<ApiResponse<{ items: PredictionResponse[]; total: number; page: number }>> {
    const start = (page - 1) * limit;
    const items = this.history.slice(start, start + limit);

    return {
      success: true,
      data: {
        items,
        total: this.history.length,
        page
      },
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    };
  }

  async healthCheck(): Promise<ApiResponse<any>> {
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

  private generateRequestId(): string {
    return `pred_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
