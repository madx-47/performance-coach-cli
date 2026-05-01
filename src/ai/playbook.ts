import { callNim } from './nim-client.js';
import { buildPlaybookPrompt } from '../prompts/playbook-prompt.js';
import { safeParseJson } from './utils.js';
import type { PlaybookOutput, DimensionResult, PerformanceDimension } from '../types.js';

export async function generatePlaybook(
  title: string,
  description: string,
  dimensions: DimensionResult[],
): Promise<PlaybookOutput> {
  const prompt = buildPlaybookPrompt(title, description, dimensions);

  const res = await callNim({
    userPrompt: prompt,
    temperature: 0.7,
    maxTokens: 2500,
  });

  let parsed: unknown;
  try {
    parsed = safeParseJson(res.content);
  } catch (err) {
    throw new Error(`Failed to parse playbook JSON: ${err}. Raw: ${res.content.slice(0, 500)}`, { cause: err });
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Playbook returned non-object JSON');
  }

  const obj = parsed as Record<string, unknown>;

  const rawDims = obj.dimensions;
  if (!Array.isArray(rawDims)) {
    throw new Error('Playbook JSON missing "dimensions" array');
  }

  const dimensionsOut = rawDims.map((d: unknown, idx: number) => {
    if (!d || typeof d !== 'object') throw new Error(`Playbook dimension[${idx}] not an object`);
    const dim = d as Record<string, unknown>;
    const dimName = String(dim.dimension ?? '');
    
    return {
      dimension: dimName as PerformanceDimension,
      aboveAverage: Array.isArray(dim.aboveAverage) ? dim.aboveAverage.map(String) : [],
      outstanding: Array.isArray(dim.outstanding) ? dim.outstanding.map(String) : [],
      pitfalls: Array.isArray(dim.pitfalls) ? dim.pitfalls.map(String) : [],
      personalHooks: Array.isArray(dim.personalHooks) ? dim.personalHooks.map(String) : [],
    };
  });

  const playbook: PlaybookOutput = {
    dimensions: dimensionsOut,
    planningChecklist: Array.isArray(obj.planningChecklist) ? obj.planningChecklist.map(String) : [],
    executionChecklist: Array.isArray(obj.executionChecklist) ? obj.executionChecklist.map(String) : [],
    prePRChecklist: Array.isArray(obj.prePRChecklist) ? obj.prePRChecklist.map(String) : [],
    growthNudges: Array.isArray(obj.growthNudges)
      ? obj.growthNudges.map((n: unknown) => {
          const nn = n as Record<string, unknown>;
          return { trigger: String(nn.trigger ?? ''), message: String(nn.message ?? '') };
        })
      : [],
    completionGuide: String(obj.completionGuide ?? ''),
  };

  return playbook;
}
