/**
 * Prompt 编排器主类
 */

import { AssembledPrompt, OrchestrationConfig, PromptTemplate } from "./types";
import { PromptLayer, OutputMode } from "./constants";
import { PromptBuilder } from "./prompt-builder";
import { PredictionContext } from "@tianwen/prediction-core";
import { FusionResult } from "@tianwen/fusion-engine";

export class PromptOrchestrator {
  private templates: Map<string, PromptTemplate>;
  private defaultConfig: OrchestrationConfig;

  constructor() {
    this.templates = new Map();
    this.defaultConfig = {
      includeLayers: Object.values(PromptLayer),
      outputMode: OutputMode.DETAILED,
    };
    this.registerDefaultTemplates();
  }

  /**
   * 注册默认模板
   */
  private registerDefaultTemplates(): void {
    const investmentTemplate: PromptTemplate = {
      id: "investment",
      name: "投资决策模板",
      layers: {
        [PromptLayer.CORE]: "你是一个专业的投资决策术数顾问。",
        [PromptLayer.SYSTEM]: "从资金安全、收益潜力、风险控制的角度分析。",
        [PromptLayer.INTERPRETATION]:
          "提供清晰的投资建议，包括潜在收益和风险。",
        [PromptLayer.RISK]: "重点提示风险和需要注意的投资风险。",
        [PromptLayer.TIMING]: "分析最佳的投资时机。",
      },
      defaultMode: OutputMode.ANALYTICAL,
      category: "investment",
    };

    const relationshipTemplate: PromptTemplate = {
      id: "relationship",
      name: "人际关系模板",
      layers: {
        [PromptLayer.CORE]: "你是一个专业的人际关系术数顾问。",
        [PromptLayer.SYSTEM]: "从缘分、和谐、沟通的角度分析。",
        [PromptLayer.INTERPRETATION]: "提供建议和改善关系的方法。",
        [PromptLayer.RISK]: "指出潜在的问题和需要注意的方面。",
        [PromptLayer.TIMING]: "分析关系的时间发展。",
      },
      defaultMode: OutputMode.NARRATIVE,
      category: "relationship",
    };

    this.templates.set("investment", investmentTemplate);
    this.templates.set("relationship", relationshipTemplate);
    this.templates.set("default", this.createDefaultTemplate());
  }

  /**
   * 创建默认模板
   */
  private createDefaultTemplate(): PromptTemplate {
    return {
      id: "default",
      name: "通用模板",
      layers: {
        [PromptLayer.CORE]: "你是一个专业的术数推演助手。",
        [PromptLayer.SYSTEM]: "使用东方哲学思维方式进行分析。",
        [PromptLayer.INTERPRETATION]: "提供清晰有深度的解释。",
        [PromptLayer.RISK]: "指出潜在风险。",
        [PromptLayer.TIMING]: "分析最佳时机。",
      },
      defaultMode: OutputMode.DETAILED,
      category: "general",
    };
  }

  /**
   * 注册模板
   */
  registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * 获取模板
   */
  getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * 生成 Prompt
   */
  async generate(
    context: PredictionContext,
    templateId?: string,
    config?: Partial<OrchestrationConfig>,
    fusionResult?: FusionResult,
  ): Promise<AssembledPrompt> {
    const template = templateId
      ? this.templates.get(templateId) || this.templates.get("default")!
      : this.templates.get("default")!;

    const useConfig: OrchestrationConfig = {
      ...this.defaultConfig,
      ...config,
    };

    const builder = new PromptBuilder(template);
    return builder.assemble(context, useConfig, fusionResult);
  }

  /**
   * 更新默认配置
   */
  updateDefaultConfig(config: Partial<OrchestrationConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * 获取所有可用模板
   */
  getAvailableTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }
}
