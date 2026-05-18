/**
 * 解释引擎类型定义
 */

import { z } from 'zod';
import { InterpretationTone, SuggestionType } from './constants';
import { Signal } from '@tianwen/signal-system';
import { ProbabilityScore } from '@tianwen/probability-engine';
import { FortuneScore } from '@tianwen/fortune-engine';

export interface Interpretation {
  summary: string;
  detailedAnalysis: string[];
  keyPoints: string[];
  tone: InterpretationTone;
  confidence: number;
}

export interface Suggestion {
  id: string;
  type: SuggestionType;
  content: string;
  priority: number;
  actionable: boolean;
  reason?: string;
}

export interface InterpretationResult {
  interpretation: Interpretation;
  suggestions: Suggestion[];
  risks: string[];
  opportunities: string[];
  sources: Signal[];
  metadata?: Record<string, unknown>;
}

export interface InterpretationConfig {
  maxSuggestions: number;
  tone: InterpretationTone;
  includeRisks: boolean;
  includeOpportunities: boolean;
  detailLevel: 'low' | 'medium' | 'high';
}
