import process from 'node:process';
import config from '../config.js';
import {
  NimRequest,
  NimResponse,
  NimApiError,
} from '../types.js';

const BASE_URL = process.env.NVIDIA_NIM_BASE_URL ?? 'https://integrate.api.nvidia.com/v1';
const TIMEOUT_MS = 15*60*1_000;
const MAX_RETRIES = 3;
const RETRY_DELAYS = [500, 1_000, 2_000];

function log(level: 'info' | 'error' | 'warn', msg: string, meta?: Record<string, unknown>) {
  const ts = new Date().toISOString();
  if (level === 'error') {
    console.error(`[${ts}] ERROR: ${msg}`, meta ? JSON.stringify(meta) : '');
  } else if (level === 'warn') {
    console.warn(`[${ts}] WARN: ${msg}`, meta ? JSON.stringify(meta) : '');
  } else {
    if (process.env.LOG_LEVEL === 'debug' || level === 'info') {
      console.log(`[${ts}] INFO: ${msg}`, meta ? JSON.stringify(meta) : '');
    }
  }
}

export async function callNim(req: NimRequest): Promise<NimResponse> {
  const apiKey = config.get('nimApiKey') || process.env.NVIDIA_NIM_API_KEY;
  
  if (!apiKey) {
    throw new NimApiError(
      'NVIDIA NIM API Key is not configured. Please run "/connect" to set your key.',
      0,
      false,
    );
  }

  const model = req.model || config.get('model');
  const url = `${BASE_URL}/chat/completions`;

  const body = {
    model,
    messages: [
      ...(req.systemPrompt ? [{ role: 'system', content: req.systemPrompt }] : []),
      { role: 'user', content: req.userPrompt },
    ],
    temperature: req.temperature ?? 0.3,
    max_tokens: req.maxTokens ?? 32500,
    stream: req.stream ?? false,
  };

  let lastError: NimApiError | undefined;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const start = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const latencyMs = Date.now() - start;

      if (!res.ok) {
        const status = res.status;
        const raw = await res.text().catch(() => 'unknown');
        const retryable = status === 429 || status >= 500 || status === 0;
        throw new NimApiError(
          `NIM API error: ${status} - ${raw.slice(0, 200)}`,
          status,
          retryable,
          raw,
        );
      }

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content ?? '';
      const usage = {
        promptTokens: json.usage?.prompt_tokens ?? 0,
        completionTokens: json.usage?.completion_tokens ?? 0,
      };

      log('info', 'NIM call complete', { model, promptTokens: usage.promptTokens, completionTokens: usage.completionTokens, latencyMs });

      return {
        content,
        usage,
        model,
        latencyMs,
      };
    } catch (err) {
      const latencyMs = Date.now() - start;

      if (err instanceof NimApiError) {
        lastError = err;
        log('warn', `NIM attempt ${attempt + 1} failed`, { statusCode: err.statusCode, retryable: err.retryable, latencyMs });
        if (!err.retryable) break;
      } else if (err instanceof Error && err.name === 'AbortError') {
        lastError = new NimApiError('NIM request timed out after 15 minutes', 0, true);
        log('warn', `NIM attempt ${attempt + 1} timed out`, { latencyMs });
      } else {
        lastError = new NimApiError(String(err), 0, true);
        log('warn', `NIM attempt ${attempt + 1} network error`, { error: String(err) });
      }

      if (attempt < MAX_RETRIES - 1) {
        const delay = RETRY_DELAYS[attempt] ?? 2_000;
        log('info', `Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  log('error', 'NIM call failed after all retries', { statusCode: lastError?.statusCode });
  throw lastError ?? new NimApiError('Unknown NIM failure', 0, false);
}
