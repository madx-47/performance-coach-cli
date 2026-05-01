import { callNim } from './nim-client.js';
import { buildClassifierPrompt } from '../prompts/classifier-prompt.js';
import { safeParseJson } from './utils.js';
import type { ClassifierOutput, PerformanceDimension, DimensionResult } from '../types.js';
import { ALL_DIMENSIONS } from '../types.js';

function validateDimension(d: string): d is PerformanceDimension {
  return ALL_DIMENSIONS.includes(d as PerformanceDimension);
}

export async function classifyTask(title: string, description: string): Promise<ClassifierOutput> {
  const prompt = buildClassifierPrompt(title, description);

  const res = await callNim({
    userPrompt: prompt,
    temperature: 0.3,
    maxTokens: 1200,
  });

  let parsed: unknown;
  try {
    parsed = safeParseJson(res.content);
  } catch (err) {
    throw new Error(`Failed to parse classifier JSON: ${err}. Raw: ${res.content.slice(0, 500)}`, { cause: err });
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Classifier returned non-object JSON');
  }

  const obj = parsed as Record<string, unknown>;

  // Validate dimensions array
  const rawDims = obj.dimensions;
  if (!Array.isArray(rawDims)) {
    throw new Error('Classifier JSON missing "dimensions" array');
  }

  const dimensions: DimensionResult[] = rawDims.map((d: unknown, idx: number) => {
    if (!d || typeof d !== 'object') {
      throw new Error(`Dimension[${idx}] is not an object`);
    }
    const dim = d as Record<string, unknown>;
    const name = String(dim.dimension ?? '');
    if (!validateDimension(name)) {
      throw new Error(`Invalid dimension name: "${name}"`);
    }
    return {
      dimension: name,
      confidence: Math.min(1, Math.max(0, Number(dim.confidence ?? 0))),
      rationale: String(dim.rationale ?? ''),
      subSkills: Array.isArray(dim.subSkills) ? dim.subSkills.map(String) : [],
    };
  });

  const primary = String(obj.primaryDimension ?? '');
  if (!validateDimension(primary)) {
    throw new Error(`Invalid primaryDimension: "${primary}"`);
  }

  const secondary = Array.isArray(obj.secondaryDimensions)
    ? obj.secondaryDimensions.map(String).filter(validateDimension)
    : [];

  // Ensure commitment_ownership is present
  if (!secondary.includes('commitment_ownership') && primary !== 'commitment_ownership') {
    secondary.push('commitment_ownership');
  }

  return {
    dimensions,
    primaryDimension: primary,
    secondaryDimensions: secondary,
  };
}
