import type { DimensionResult } from '../types.js';
import { RUBRIC } from './rubric.js';

export function buildPlaybookPrompt(
  title: string,
  description: string,
  dimensions: DimensionResult[],
): string {
  const contextList = dimensions.map(d => {
    const rubric = RUBRIC[d.dimension];
    return `### Dimension: ${d.dimension}
Rationale: ${d.rationale}
Sub-skills identified: ${d.subSkills.join(', ')}

Target "Above Average" signals to emulate:
${rubric.aboveAverageSignals.map(s => `- ${s}`).join('\n')}

Pitfalls to avoid:
${rubric.pitfalls.map(p => `- ${p}`).join('\n')}`;
  }).join('\n\n');

  return `You are a senior engineering coach. Based on the task and its classified performance dimensions, generate a detailed playbook for how to complete this task at an "Above Average" level.

Task Title: ${title}
Task Description: ${description || '(none provided)'}

## Classification Context
The task has been analyzed and the following dimensions are most relevant. Use the "Above Average signals" provided below as the standard for your recommendations.

${contextList}

## Your Task
Generate a specific, actionable playbook for this task. Do not be generic; tailor the advice to the title and description of the task while adhering to the performance standards above.

For each dimension listed above, provide:
- aboveAverage: 2-3 specific behaviors that would demonstrate Above Average performance for THIS task
- outstanding: 1-2 stretch behaviors for Outstanding level for THIS task
- pitfalls: 2-3 common mistakes for THIS task that would rate Below Average
- personalHooks: 1 actionable coaching nudge specific to this task

Also provide:
- planningChecklist: 4-5 items to verify before starting coding
- executionChecklist: 4-5 items to verify while implementing
- prePRChecklist: 5-6 items before requesting code review
- growthNudges: 2-3 contextual reminders (e.g., "Communicate dependencies early", "Set personal timeline") with a "trigger" (when to think about it) and "message"
- estimatedTimeline: **Mandatory**. Provide a concise estimate of how long this task should take (e.g., "2-4 hours", "2 days", "1 week") based on the task description and complexity.
- completionGuide: A 3-4 paragraph narrative guide explaining HOW to approach this task to hit Above Average, written like a mentor giving advice. Be specific to the task, not generic.

Respond ONLY with valid JSON in this exact shape (no markdown, no explanation):
{
  "dimensions": [
    {
      "dimension": "...", 
      "aboveAverage": ["...", "..."],
      "outstanding": ["..."],
      "pitfalls": ["...", "..."],
      "personalHooks": ["..."]
    }
  ],
  "planningChecklist": ["..."],
  "executionChecklist": ["..."],
  "prePRChecklist": ["..."],
  "growthNudges": [
    { "trigger": "...", "message": "..." }
  ],
  "estimatedTimeline": "e.g. 2-4 hours",
  "completionGuide": "..."
}`;
}
