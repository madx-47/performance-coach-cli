import { describe, it, expect } from 'vitest';
import { safeParseJson } from './utils.js';

describe('safeParseJson', () => {
  it('should parse simple JSON', () => {
    const input = '{"key": "value"}';
    expect(safeParseJson(input)).toEqual({ key: 'value' });
  });

  it('should strip markdown code fences', () => {
    const input = '```json\n{"key": "value"}\n```';
    expect(safeParseJson(input)).toEqual({ key: 'value' });
  });

  it('should strip markdown code fences with case-insensitivity', () => {
    const input = '```JSON\n{"key": "value"}\n```';
    expect(safeParseJson(input)).toEqual({ key: 'value' });
  });

  it('should handle whitespace around fences', () => {
    const input = '  \n ```json \n {"key": "value"} \n ``` \n ';
    expect(safeParseJson(input)).toEqual({ key: 'value' });
  });

  it('should throw on invalid JSON', () => {
    const input = '{"key": "value"';
    expect(() => safeParseJson(input)).toThrow();
  });
});
