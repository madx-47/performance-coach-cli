/**
 * Strips markdown code fences if present and parses the JSON string.
 */
export function safeParseJson(text: string): unknown {
  const cleaned = text
    .replace(/^\s*```json\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  return JSON.parse(cleaned);
}
