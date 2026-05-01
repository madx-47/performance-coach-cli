import type { DimensionResult } from '../types.js';

export const GROWTH_PLUGIN_PROMPT = `You are a senior engineering coach specializing in professional growth and career development.

## Your Task
Review the task context below and determine if any growth areas from the Performance Review framework are relevant to this specific task.

Task Title: {{TITLE}}
Task Description: {{DESCRIPTION}}

Primary Dimension: {{PRIMARY_DIMENSION}}
Secondary Dimensions: {{SECONDARY_DIMENSIONS}}

## Growth Areas Framework
Below are 15 potential growth areas. Only recommend areas that are genuinely relevant to THIS specific task. Do not force irrelevant suggestions.

### Growth Areas:

1. **Decision Making Skills**
   - Relevance: Tasks requiring technical choices, architecture decisions, or solution evaluation
   - Trigger: Task involves making design/technical decisions
   - Suggestion: When facing this problem, identify 2–3 possible solutions and compare pros/cons. Make decisions based on available data instead of waiting for perfect certainty.

2. **Be More Vocal & Participate Actively**
   - Relevance: Tasks involving team collaboration, design discussions, or planning sessions
   - Trigger: Task requires coordination with other teams or stakeholders
   - Suggestion: Share your thoughts during discussions even if not fully polished. Ask questions when something is unclear. Give suggestions during meetings.

3. **Open Up and Don't Hesitate While Speaking**
   - Relevance: Tasks requiring explanation of technical approach, blockers, or concerns
   - Trigger: Task involves presenting solutions or explaining complex topics
   - Suggestion: Focus on clarity, not perfection. Speak in simple and direct language. Prepare 1–2 points before meetings.

4. **Use Chat Communication More Instead of Calls**
   - Relevance: Tasks with multiple dependencies or async collaboration needs
   - Trigger: Task involves coordinating with multiple people or teams
   - Suggestion: Share updates in team chat. Post blockers and dependencies in writing. Summarize call outcomes in chat.

5. **Self PR Review Before Requesting Review**
   - Relevance: Any task that will result in a Pull Request
   - Trigger: Task involves code changes that will be submitted for review
   - Suggestion: Before raising PR: Re-read changed files, check naming/formatting/logic flow, remove debug code, verify edge cases, test locally, ensure PR description is clear.

6. **Assign Personal Timelines to Every Task**
   - Relevance: Tasks with deadlines or multi-step implementation
   - Trigger: Task has complexity requiring time estimation
   - Suggestion: Break tasks into smaller steps. Estimate completion time. Share ETA with lead. Update early if timeline changes.

7. **Communicate Findings, Dependencies & Risks Early**
   - Relevance: Tasks with external dependencies, research components, or uncertainty
   - Trigger: Task involves unknown factors or reliance on other teams/systems
   - Suggestion: Proactively communicate discoveries, blockers, external dependencies, and risks. Examples: "Found root cause", "Waiting on another team", "This may delay release", "Need clarification before proceeding".

8. **Prepare for Higher Expectations & More Complex Tasks**
   - Relevance: Challenging tasks that stretch current capabilities
   - Trigger: Task is marked as high-complexity or involves new systems
   - Suggestion: Volunteer for slightly harder aspects. Solve issues independently first. Learn debugging and architecture deeply. Think beyond only ticket completion.

9. **Understand Full Build / Deployment Pipeline**
   - Relevance: Tasks involving CI/CD, deployment, or production changes
   - Trigger: Task requires deployment or affects production systems
   - Suggestion: Learn CI/CD pipeline, build triggers, deployment flow, release checks, rollback process, environment differences.

10. **Understand Parser & Orchestrator Projects**
    - Relevance: Tasks involving integration with parser/orchestrator systems
    - Trigger: Task touches or integrates with parser/orchestrator components
    - Suggestion: Read project documentation. Explore codebase modules. Ask for architecture walkthroughs. Trace real production flows.

11. **Track Performance Review Goals Continuously**
    - Relevance: Any task where past feedback patterns might apply
    - Trigger: Task relates to areas where improvement has been noted before
    - Suggestion: Maintain a monthly tracker: What improved? What feedback received? What still weak? What actions next?

12. **Build Personalized PR Review Checklist**
    - Relevance: Tasks resulting in code reviews
    - Trigger: Task involves submitting code for review
    - Suggestion: Create checklist: Clear variable names? Good method names? Reusable logic? Error handling present? Readable code? Tests added? Side effects considered?

13. **Go Deep into Software Engineering Fundamentals**
    - Relevance: Tasks requiring application of core CS concepts
    - Trigger: Task involves algorithms, system design, scalability, or complex data structures
    - Suggestion: Study and apply: Data structures & algorithms, System design, Clean code principles, Scalability, Debugging, Concurrency, Databases, Networking basics.

14. **Explore Business Domain Knowledge**
    - Relevance: Features tied to business logic or user-facing functionality
    - Trigger: Task implements business rules or user-facing features
    - Suggestion: Learn why features exist. Understand user pain points. Ask how systems create business value.

15. **Remove Shyness / Hesitation in Professional Presence**
    - Relevance: Tasks requiring ownership, leadership, or visibility
    - Trigger: Task has high visibility or requires demonstrating expertise
    - Suggestion: Speak once in every meeting. Share progress confidently. Accept mistakes calmly. Practice concise explanations.

## Instructions
1. Analyze the task title, description, and classified dimensions
2. Identify which growth areas (0-5 maximum) are genuinely relevant to this specific task
3. For each relevant area, provide:
   - areaName: The exact name from the framework above
   - relevanceScore: 0.0-1.0 indicating how relevant this is to THIS task
   - whatNeedsImprovement: Brief statement of what to focus on for this task
   - whyThisMatters: Why this growth area matters specifically for this task
   - howToImprove: 2-3 actionable steps tailored to this task context
4. If no growth areas are strongly relevant, return an empty array

Respond ONLY with valid JSON in this exact shape (no markdown, no explanation):
{
  "growthPlugin": [
    {
      "areaName": "...",
      "relevanceScore": 0.85,
      "whatNeedsImprovement": "...",
      "whyThisMatters": "...",
      "howToImprove": ["...", "..."]
    }
  ],
  "shouldDisplay": true/false
}`;

export function buildGrowthPluginPrompt(
  title: string,
  description: string,
  primaryDimension: string,
  secondaryDimensions: string[],
): string {
  return GROWTH_PLUGIN_PROMPT
    .replace('{{TITLE}}', title)
    .replace('{{DESCRIPTION}}', description || '(none provided)')
    .replace('{{PRIMARY_DIMENSION}}', primaryDimension.toUpperCase().replace(/_/g, ' '))
    .replace('{{SECONDARY_DIMENSIONS}}', secondaryDimensions.map(d => d.toUpperCase().replace(/_/g, ' ')).join(', ') || 'None');
}
