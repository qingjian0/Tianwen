/**
 * 统一错误类型
 */

export class TianwenError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'TianwenError';
  }
}

export class EngineError extends TianwenError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'ENGINE_ERROR', details);
    this.name = 'EngineError';
  }
}

export class CalculationError extends TianwenError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'CALCULATION_ERROR', details);
    this.name = 'CalculationError';
  }
}

export class ValidationError extends TianwenError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class PromptError extends TianwenError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'PROMPT_ERROR', details);
    this.name = 'PromptError';
  }
}
