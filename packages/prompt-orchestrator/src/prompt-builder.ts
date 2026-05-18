/**
 * Prompt 构建器
 */

import { PromptSection, AssembledPrompt, PromptTemplate, OrchestrationConfig } from './types';
import { PromptLayer, OutputMode, PROMPT_LAYER_LABELS } from './constants';
import { PredictionContext } from '@tianwen/prediction-core';
import { FusionResult } from '@tianwen/fusion-engine';

export class PromptBuilder {
  private template: PromptTemplate;

  constructor(template?: PromptTemplate) {
    this.template = template || this.createDefaultTemplate();
  }

  /**
   * 创建默认模板
   */
  private createDefaultTemplate(): PromptTemplate {
    return {
      id: 'default',
      name: '默认推演模板',
      layers: {
        [PromptLayer.CORE]: '你是一个专业的术数推演助手，请基于以下信息进行推演分析。',
        [PromptLayer.SYSTEM]: '使用东方哲学思维方式进行分析，注重阴阳五行等概念。',
        [PromptLayer.INTERPRETATION]: '请提供清晰、有深度的解释，避免过于技术性的术语。',
        [PromptLayer.RISK]: '请指出潜在风险和需要注意的事项。',
        [PromptLayer.TIMING]: '分析最佳时机分析，包括短期、中期、长期。'
      },
      defaultMode: OutputMode.DETAILED,
      category: 'general'
    };
  }

  /**
   * 构建核心层
   */
  buildCoreLayer(context: PredictionContext): PromptSection {
    return {
      layer: PromptLayer.CORE,
      content: this.template.layers[PromptLayer.CORE] + '\n\n' +
               `问题：${context.question}\n` +
               `时间：${context.timestamp.toLocaleString()}\n` +
               `类别：${context.category}`,
      priority: 10
    };
  }

  /**
   * 构建系统层
   */
  buildSystemLayer(context: PredictionContext): PromptSection {
    const systemsList = context.systems.join('、');
    return {
      layer: PromptLayer.SYSTEM,
      content: this.template.layers[PromptLayer.SYSTEM] + '\n\n' +
               `使用的术数系统：${systemsList}`,
      priority: 9
    };
  }

  /**
   * 构建解释层
   */
  buildInterpretationLayer(): PromptSection {
    return {
      layer: PromptLayer.INTERPRETATION,
      content: this.template.layers[PromptLayer.INTERPRETATION],
      priority: 8
    };
  }

  /**
   * 构建风险层
   */
  buildRiskLayer(): PromptSection {
    return {
      layer: PromptLayer.RISK,
      content: this.template.layers[PromptLayer.RISK],
      priority: 7
    };
  }

  /**
   * 构建时间层
   */
  buildTimingLayer(): PromptSection {
    return {
      layer: PromptLayer.TIMING,
      content: this.template.layers[PromptLayer.TIMING],
      priority: 6
    };
  }

  /**
   * 构建融合结果层
   */
  buildFusionLayer(fusionResult?: FusionResult): PromptSection {
    if (!fusionResult) {
      return {
        layer: PromptLayer.SYSTEM,
        content: '',
        priority: 5
      };
    }

    return {
      layer: PromptLayer.SYSTEM,
      content: `\n融合分析结果：\n` +
               `置信度：${Math.round(fusionResult.confidence * 100)}%\n` +
               `策略：${fusionResult.strategy}`,
      priority: 5
    };
  }

  /**
   * 组装完整 Prompt
   */
  assemble(
    context: PredictionContext,
    config: OrchestrationConfig,
    fusionResult?: FusionResult
  ): AssembledPrompt {
    const sections: PromptSection[] = [];

    if (config.includeLayers.includes(PromptLayer.CORE)) {
      sections.push(this.buildCoreLayer(context));
    }
    if (config.includeLayers.includes(PromptLayer.SYSTEM)) {
      sections.push(this.buildSystemLayer(context));
    }
    if (fusionResult && config.includeLayers.includes(PromptLayer.SYSTEM)) {
      sections.push(this.buildFusionLayer(fusionResult));
    }
    if (config.includeLayers.includes(PromptLayer.INTERPRETATION)) {
      sections.push(this.buildInterpretationLayer()));
    }
    if (config.includeLayers.includes(PromptLayer.RISK)) {
      sections.push(this.buildRiskLayer()));
    }
    if (config.includeLayers.includes(PromptLayer.TIMING)) {
      sections.push(this.buildTimingLayer()));
    }

    sections.sort((a, b) => b.priority - a.priority);

    const fullText = sections.map(s => `## ${PROMPT_LAYER_LABELS[s.layer]}\n${s.content}`).join('\n\n');

    return {
      sections,
      fullText,
      context,
      fusionResult,
      outputMode: config.outputMode
    };
  }
}
