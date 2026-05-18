/**
 * Prompt Builder - 流式API
 */

import { PromptDSL, PromptStyle, OutputMode } from './types';

export class PromptBuilder {
  private prompt: Partial<PromptDSL>;

  constructor() {
    this.prompt = {
      question: '',
      systems: [],
      weights: {},
      focus: [],
      style: 'balanced',
      outputMode: 'detailed',
    };
  }

  question(text: string): PromptBuilder {
    this.prompt.question = text;
    return this;
  }

  use(systems: string[]): PromptBuilder {
    this.prompt.systems = systems;
    return this;
  }

  weight(system: string, weight: number): PromptBuilder {
    this.prompt.weights[system] = weight;
    return this;
  }

  focus(on: string[]): PromptBuilder {
    this.prompt.focus = on;
    return this;
  }

  style(style: PromptStyle): PromptBuilder {
    this.prompt.style = style;
    return this;
  }

  output(mode: OutputMode): PromptBuilder {
    this.prompt.outputMode = mode;
    return this;
  }

  build(): PromptDSL {
    if (!this.prompt.question) {
      throw new Error('Question is required');
    }
    if (this.prompt.systems.length === 0) {
      throw new Error('At least one system is required');
    }
    return this.prompt as PromptDSL;
  }
}
