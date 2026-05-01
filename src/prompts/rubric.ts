import type { PerformanceDimension } from '../types.js';

export interface RubricDetail {
  id: PerformanceDimension;
  summary: string;
  aboveAverageSignals: string[];
  pitfalls: string[];
}

export const RUBRIC: Record<PerformanceDimension, RubricDetail> = {
  planning: {
    id: 'planning',
    summary: 'Ability to break down complex work into clear steps, define dependencies, identify risks ahead of time, set realistic timelines, and communicate the plan to stakeholders before starting execution.',
    aboveAverageSignals: [
      'Decomposes problem into deliverable sub-tasks before writing code',
      'Explicitly lists external dependencies and validates them',
      'Identifies risks and communicates them to lead/team proactively',
      'Sets and meets self-imposed personal timelines (before official deadline)',
      'Considers edge cases during planning, not mid-implementation'
    ],
    pitfalls: [
      'Starts coding before understanding scope',
      'Discovers dependencies mid-implementation',
      'Misses official deadlines without early communication',
      'No written plan or estimate provided'
    ]
  },
  requirement_analysis: {
    id: 'requirement_analysis',
    summary: 'Understanding what the feature/fix actually needs to do, not just what was written in the ticket. Asking the right questions, validating assumptions, and ensuring alignment before building.',
    aboveAverageSignals: [
      'Asks clarifying questions before starting',
      'Documents assumptions and gets them validated',
      'Understands the business/user reason for the requirement',
      'Proactively identifies ambiguity and resolves it'
    ],
    pitfalls: [
      'Builds what the ticket says literally, not what was needed',
      'Makes assumptions without validating',
      'Completes work only to find requirements were misunderstood'
    ]
  },
  design_implementation: {
    id: 'design_implementation',
    summary: 'Quality of technical design decisions and code implementation. Covers architecture choices, code quality, reusability, and adherence to existing patterns.',
    aboveAverageSignals: [
      'Evaluates multiple approaches before choosing one',
      'Reuses existing patterns rather than reinventing',
      'Code is readable, well-named, and self-documenting',
      'Considers edge cases and error handling in design',
      'PR has zero or minimal revision cycles'
    ],
    pitfalls: [
      'Force-fits existing solutions to new problems',
      'Naming is unclear or inconsistent',
      'No consideration of error cases',
      'Large, monolithic changes that are hard to review'
    ]
  },
  build_test_deployment: {
    id: 'build_test_deployment',
    summary: 'Understanding and correctly using the CI/CD pipeline, writing tests, validating in staging, and ensuring safe deployment.',
    aboveAverageSignals: [
      'Writes unit + integration tests before raising PR',
      'Verifies CI passes before requesting review',
      'Validates in staging environment',
      'Understands impact on deployment pipeline',
      'Checks for side effects in related systems'
    ],
    pitfalls: [
      'Raises PR with failing tests',
      'Skips staging validation',
      'Doesn\'t understand CI/CD configuration',
      'No tests for new logic'
    ]
  },
  troubleshooting_fix: {
    id: 'troubleshooting_fix',
    summary: 'Systematic debugging approach, root cause identification, and clean fix without introducing new bugs.',
    aboveAverageSignals: [
      'Identifies root cause, not just symptoms',
      'Documents the investigation process',
      'Fix is minimal and targeted (no scope creep)',
      'Adds regression test to prevent recurrence',
      'Explains the cause and fix clearly in PR description'
    ],
    pitfalls: [
      'Applies band-aid fix without understanding root cause',
      'Fix introduces new bugs',
      'No test added for the regression',
      'Cannot explain why the bug occurred'
    ]
  },
  commitment_ownership: {
    id: 'commitment_ownership',
    summary: 'Reliability, accountability, and follow-through. Taking full responsibility for the outcome of your work, not just the code you wrote.',
    aboveAverageSignals: [
      'Delivers on personal commitments consistently',
      'Proactively communicates if timeline is at risk',
      'Sees work through to production, not just merge',
      'Takes ownership of bugs in own code',
      'Follows up on open questions without being reminded'
    ],
    pitfalls: [
      'Misses deadlines without advance notice',
      'Blames dependencies/others without taking ownership',
      'Done means merged, not running in production',
      'Open items left unresolved'
    ]
  },
  leadership: {
    id: 'leadership',
    summary: 'Taking initiative beyond assigned scope, mentoring others, driving technical decisions, and elevating the team.',
    aboveAverageSignals: [
      'Proactively identifies and raises technical debt',
      'Helps teammates with blockers without being asked',
      'Documents learnings for team benefit',
      'Drives RFC or design discussions',
      'Escalates risk/issues at right time with recommendation'
    ],
    pitfalls: [
      'Only does exactly what was assigned',
      'Silent on issues visible to them',
      'Doesn\'t share knowledge'
    ]
  },
  continuous_learning: {
    id: 'continuous_learning',
    summary: 'Actively improving technical skills, understanding new systems, and applying learning to work.',
    aboveAverageSignals: [
      'Researches fundamentals before implementing unfamiliar patterns',
      'Applies new learning from previous feedback',
      'Reads relevant docs/RFCs before asking for help',
      'Shares learnings with team after a spike',
      'Improves approach based on PR feedback'
    ],
    pitfalls: [
      'Asks questions Google would answer',
      'Repeats same mistake in multiple PRs',
      'Doesn\'t apply feedback from previous cycle'
    ]
  },
  interpersonal_skills: {
    id: 'interpersonal_skills',
    summary: 'Quality of communication with teammates, leads, and stakeholders. Async communication, meeting participation, and conflict resolution.',
    aboveAverageSignals: [
      'Communicates dependencies and risks early and clearly',
      'Raises blockers proactively, not at deadline',
      'PR descriptions explain WHY, not just WHAT',
      'Active participation in team discussions',
      'Clear, concise async messages (no walls of text)'
    ],
    pitfalls: [
      'Silent on blockers until it\'s too late',
      'Vague messages that require clarification loops',
      'Avoids speaking up in meetings',
      'Over-reliance on synchronous calls for async-able topics'
    ]
  }
};
