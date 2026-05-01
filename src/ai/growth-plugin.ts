import { callNim } from './nim-client.js';
import { buildGrowthPluginPrompt } from '../prompts/growth-plugin-prompt.js';
import { safeParseJson } from './utils.js';
import type { GrowthPluginOutput, GrowthPluginItem, DimensionResult } from '../types.js';

export async function generateGrowthPlugin(
  title: string,
  description: string,
  dimensions: DimensionResult[],
): Promise<GrowthPluginOutput> {
  const primaryDimension = dimensions.length > 0
    ? dimensions.reduce((prev, curr) => (curr.confidence > prev.confidence ? curr : prev)).dimension
    : 'planning';
  const secondaryDimensions = dimensions.filter(d => d.dimension !== primaryDimension).map(d => d.dimension);

  const prompt = buildGrowthPluginPrompt(
    title,
    description,
    primaryDimension,
    secondaryDimensions,
  );

  const res = await callNim({
    userPrompt: prompt,
    temperature: 0.5,
    maxTokens: 4096,
  });

  let parsed: unknown;
  try {
    parsed = safeParseJson(res.content);
  } catch (err) {
    // If parsing fails, return empty growth plugin
    console.warn('Failed to parse growth plugin JSON, returning empty:', err);
    return { growthPlugin: [], shouldDisplay: false };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { growthPlugin: [], shouldDisplay: false };
  }

  const obj = parsed as Record<string, unknown>;

  const rawGrowthPlugin = obj.growthPlugin;
  const growthPluginArray = Array.isArray(rawGrowthPlugin) ? rawGrowthPlugin : [];

  const growthPluginItems: GrowthPluginItem[] = growthPluginArray.map((item: unknown) => {
    if (!item || typeof item !== 'object') {
      return null;
    }
    const it = item as Record<string, unknown>;

    const areaName = String(it.areaName ?? '').trim();
    const whatNeedsImprovement = String(it.whatNeedsImprovement ?? '').trim();
    const whyThisMatters = String(it.whyThisMatters ?? '').trim();
    const howToImproveRaw = it.howToImprove;
    const howToImprove = Array.isArray(howToImproveRaw)
      ? howToImproveRaw.map(s => String(s).trim()).filter(s => s.length > 0)
      : [];

    if (!areaName || !whatNeedsImprovement || !whyThisMatters || howToImprove.length === 0) {
      return null;
    }

    return {
      areaName,
      relevanceScore: typeof it.relevanceScore === 'number' ? it.relevanceScore : 0,
      whatNeedsImprovement,
      whyThisMatters,
      howToImprove,
    };
  }).filter((item): item is GrowthPluginItem => item !== null);

  const shouldDisplay = Boolean(obj.shouldDisplay) && growthPluginItems.length > 0;

  return {
    growthPlugin: growthPluginItems,
    shouldDisplay,
  };
}
