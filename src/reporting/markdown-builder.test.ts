import { describe, it, expect } from 'vitest';
import { generateFilename } from './markdown-builder.js';

describe('generateFilename', () => {
  it('should convert title to lowercase slug with hyphens', () => {
    const result = generateFilename('Design Auth Middleware');
    expect(result).toBe('design-auth-middleware.md');
  });

  it('should handle special characters', () => {
    const result = generateFilename('Fix API (v2) endpoint!');
    expect(result).toBe('fix-api-v2-endpoint.md');
  });

  it('should use timestamp fallback for empty titles', () => {
    const result = generateFilename('');
    expect(result).toMatch(/^task-[a-z0-9]+\.md$/);
  });

  it('should use timestamp fallback for very short titles', () => {
    const result = generateFilename('a');
    expect(result).toMatch(/^task-[a-z0-9]+\.md$/);
  });

  it('should handle collisions by appending counter', () => {
    const existingFiles = ['my-task.md'];
    const result = generateFilename('My Task', existingFiles);
    expect(result).toBe('my-task-1.md');
  });

  it('should handle multiple collisions', () => {
    const existingFiles = ['my-task.md', 'my-task-1.md', 'my-task-2.md'];
    const result = generateFilename('My Task', existingFiles);
    expect(result).toBe('my-task-3.md');
  });

  it('should strip .md extension from title before generating', () => {
    const result = generateFilename('already-has-extension.md');
    expect(result).toBe('already-has-extension.md');
  });
});
