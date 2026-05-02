import { describe, it, expect } from 'vitest';
import { buildPlaybookPrompt } from './playbook-prompt.js';
import { RUBRIC } from './rubric.js';
import type { DimensionResult } from '../types.js';

describe('buildPlaybookPrompt', () => {
  it('should include task details and relevant rubric signals', () => {
    const dimensions: DimensionResult[] = [
      {
        dimension: 'planning',
        confidence: 0.9,
        rationale: 'High level planning needed',
        subSkills: ['milestones']
      }
    ];
    
    const prompt = buildPlaybookPrompt('Design API', 'Create REST endpoints', dimensions);
    
    expect(prompt).toContain('Design API');
    expect(prompt).toContain('Create REST endpoints');
    expect(prompt).toContain('planning');
    expect(prompt).toContain('High level planning needed');
    expect(prompt).toContain('milestones');
    
    // Check if rubric signals for planning are included
    RUBRIC.planning.aboveAverageSignals.forEach(signal => {
      expect(prompt).toContain(signal);
    });
    
    RUBRIC.planning.pitfalls.forEach(pitfall => {
      expect(prompt).toContain(pitfall);
    });

    expect(prompt).toContain('estimatedTimeline');
  });
});
