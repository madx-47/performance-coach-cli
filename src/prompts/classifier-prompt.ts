import { ALL_DIMENSIONS } from '../types.js';
import { RUBRIC } from './rubric.js';

export function buildClassifierPrompt(title: string, description: string): string {
  const dims = ALL_DIMENSIONS.map(d => {
    const rubric = RUBRIC[d];
    return `- ${d}: ${rubric.summary}`;
  }).join('\n');

  return `Analyze this software engineering task and classify it against these 9 performance dimensions:
${dims}

Task Title: ${title}
Task Description: ${description || '(none provided)'}

## Rules for Classification
1. "commitment_ownership" is triggered by: reliability, accountability, follow-through, delivery,deadline, outcome, ownership.
2. "continuous_learning" is triggered by: spike, investigate, research, learn, study, understand, fundamentals.
3. "interpersonal_skills" is triggered by: discuss, align, sync, collaborate, communicate, review with, meeting, present.
4. "troubleshooting_fix" is triggered by: bug, performance, memory, slow, crash, fix, debug, regression.
5. "build_test_deployment" is triggered by: deploy, CI/CD, pipeline, release, staging, testing, automation.
6. "design_implementation" is triggered by: design, architecture, RFC, schema, model, implementation, coding.
7. "planning" is triggered by: plan, estimate, timeline, roadmap, milestone, dependencies.
8. "requirement_analysis" is triggered by: requirement, spec, scope, user story, acceptance criteria, ambiguity.
9. "leadership" is triggered by: lead, mentor, RFC, drive, knowledge share, initiative.

## Required Output
For each dimension that is relevant (high or medium confidence):
1. dimension: (exact string from the list above)
2. confidence: (0.0 to 1.0)
3. rationale: (one sentence explaining why it fits based on the rubric summary)
4. subSkills: (array of 2-3 specific sub-skills involved)

Also identify:
- primaryDimension: the single most relevant dimension for this specific task.
- secondaryDimensions: other relevant dimensions.

Respond ONLY with valid JSON in this exact shape (no markdown, no explanation):
{
  "dimensions": [
    { "dimension": "planning", "confidence": 0.85, "rationale": "...", "subSkills": ["estimation", "dependency mapping"] }
  ],
  "primaryDimension": "planning",
  "secondaryDimensions": ["commitment_ownership", "design_implementation"]
}`;
}

