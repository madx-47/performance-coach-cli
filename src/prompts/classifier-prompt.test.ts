import { describe, it, expect } from 'vitest';
import { buildClassifierPrompt } from './classifier-prompt.js';
import { RUBRIC } from './rubric.js';

describe('buildClassifierPrompt', () => {
  it('should include all dimensions and their rubric summaries', () => {
    const prompt = buildClassifierPrompt('Test Task', 'Test Description');
    
    expect(prompt).toContain('Test Task');
    expect(prompt).toContain('Test Description');
    
    for (const key in RUBRIC) {
      const rubric = RUBRIC[key as keyof typeof RUBRIC];
      expect(prompt).toContain(key);
      expect(prompt).toContain(rubric.summary);
    }
  });

  it('should include classification rules', () => {
    const prompt = buildClassifierPrompt('Test Task', 'Test Description');
    expect(prompt).toContain('commitment_ownership');
    expect(prompt).toContain('continuous_learning');
  });
});
