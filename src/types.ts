/**
 * Performance Dimensions from the rubric
 */
export type PerformanceDimension =
  | 'planning'
  | 'requirement_analysis'
  | 'design_implementation'
  | 'build_test_deployment'
  | 'troubleshooting_fix'
  | 'commitment_ownership'
  | 'leadership'
  | 'continuous_learning'
  | 'interpersonal_skills';

export const ALL_DIMENSIONS: PerformanceDimension[] = [
  'planning',
  'requirement_analysis',
  'design_implementation',
  'build_test_deployment',
  'troubleshooting_fix',
  'commitment_ownership',
  'leadership',
  'continuous_learning',
  'interpersonal_skills',
];

export interface DimensionResult {
  dimension: PerformanceDimension;
  confidence: number; // 0.0 - 1.0
  rationale: string;
  subSkills: string[];
}

export interface ClassifierOutput {
  dimensions: DimensionResult[];
  primaryDimension: PerformanceDimension;
  secondaryDimensions: PerformanceDimension[];
}

export interface PlaybookOutput {
  dimensions: {
    dimension: PerformanceDimension;
    aboveAverage: string[];
    outstanding: string[];
    pitfalls: string[];
    personalHooks: string[];
  }[];
  planningChecklist: string[];
  executionChecklist: string[];
  prePRChecklist: string[];
  growthNudges: { trigger: string; message: string }[];
  completionGuide: string; // Narrative guide for the task
}

export interface GrowthPluginItem {
  areaName: string;
  relevanceScore: number;
  whatNeedsImprovement: string;
  whyThisMatters: string;
  howToImprove: string[];
}

export interface GrowthPluginOutput {
  growthPlugin: GrowthPluginItem[];
  shouldDisplay: boolean;
}

export interface NimRequest {
  model?: string;
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface NimResponse {
  content: string;
  usage: { promptTokens: number; completionTokens: number };
  model: string;
  latencyMs: number;
}

export class NimApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly retryable: boolean,
    public readonly rawResponse?: unknown,
  ) {
    super(message);
    this.name = 'NimApiError';
  }
}
