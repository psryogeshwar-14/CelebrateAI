import { GoogleGenAI } from '@google/genai';
import type { IGeminiClientAdapter, GeminiGenerateOptions, GeminiResponse } from '../types';
import { GeminiApiError, RateLimitError } from '@/shared/lib/errors';
import { PLANNING_CONSTANTS } from '@/shared/config/constants';
import { logger } from '@/shared/lib/logger';

export interface GeminiClientAdapterOptions {
  apiKey?: string;
  model?: string;
  requestTimeoutMs?: number;
  retryDelayMs?: number;
  client?: GoogleGenAI;
}

const TRANSIENT_TOKENS = ['429', 'RESOURCE_EXHAUSTED', 'timeout', 'ETIMEDOUT', 'ECONNRESET', 'fetch failed'];
const RATE_LIMIT_TOKENS = ['429', 'RESOURCE_EXHAUSTED', 'rate limit'];

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Unknown Gemini error';
}

function initGenAiClient(options?: GeminiClientAdapterOptions): GoogleGenAI | null {
  if (options?.client) return options.client;
  const apiKey = options?.apiKey || process.env.GEMINI_API_KEY;
  const isValid = Boolean(apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== '');
  return isValid ? new GoogleGenAI({ apiKey: apiKey as string }) : null;
}

export class GeminiClientAdapter implements IGeminiClientAdapter {
  private client: GoogleGenAI | null;
  private model: string;
  private defaultTimeoutMs: number;
  private retryDelayMs: number;

  constructor(options?: GeminiClientAdapterOptions) {
    this.client = initGenAiClient(options);
    this.model = options?.model || process.env.GEMINI_MODEL || PLANNING_CONSTANTS.AI.DEFAULT_MODEL;
    this.defaultTimeoutMs = options?.requestTimeoutMs || PLANNING_CONSTANTS.AI.REQUEST_TIMEOUT_MS;
    this.retryDelayMs = options?.retryDelayMs || PLANNING_CONSTANTS.AI.RETRY_DELAY_MS;
  }

  public isAvailable(): boolean {
    return this.client !== null;
  }

  public async generateContent(options: GeminiGenerateOptions): Promise<GeminiResponse> {
    const client = this.client;
    if (!client) {
      throw new GeminiApiError('Gemini API client is not configured or missing API key.');
    }
    const timeout = options.timeoutMs || this.defaultTimeoutMs;
    return this.executeWithRetry(client, options, timeout, 1);
  }

  private async executeWithRetry(
    client: GoogleGenAI,
    options: GeminiGenerateOptions,
    timeoutMs: number,
    attempt: number
  ): Promise<GeminiResponse> {
    const startTime = Date.now();
    try {
      return await this.dispatchCall(client, options, timeoutMs, startTime, attempt);
    } catch (err: unknown) {
      return this.handleExecutionError(client, options, timeoutMs, attempt, startTime, err);
    }
  }

  private async dispatchCall(
    client: GoogleGenAI,
    options: GeminiGenerateOptions,
    timeoutMs: number,
    startTime: number,
    attempt: number
  ): Promise<GeminiResponse> {
    const promise = client.models.generateContent({
      model: this.model,
      contents: options.contents as Parameters<typeof client.models.generateContent>[0]['contents'],
      config: {
        ...(options.systemInstruction ? { systemInstruction: options.systemInstruction } : {}),
        responseMimeType: 'application/json',
        ...(options.responseSchema ? { responseJsonSchema: options.responseSchema } : {}),
      },
    });

    const response = await this.withTimeout(promise, timeoutMs);
    const rawText = response.text;
    if (!rawText || rawText.trim() === '') {
      throw new GeminiApiError('Received empty text completion from Gemini API.');
    }

    const durationMs = Date.now() - startTime;
    logger.info('Gemini generation successful', { durationMs, attempt, model: this.model }, 'gemini-adapter');
    return { text: rawText };
  }

  private async handleExecutionError(
    client: GoogleGenAI,
    options: GeminiGenerateOptions,
    timeoutMs: number,
    attempt: number,
    startTime: number,
    err: unknown
  ): Promise<GeminiResponse> {
    const durationMs = Date.now() - startTime;
    const errorMsg = getErrorMessage(err);

    if (attempt === 1 && this.isTransientError(err, errorMsg)) {
      logger.warn(`Gemini request failed transiently (${errorMsg}). Retrying...`, { attempt, durationMs }, 'gemini-adapter');
      await new Promise((r) => setTimeout(r, this.retryDelayMs));
      return this.executeWithRetry(client, options, timeoutMs, 2);
    }

    logger.error('Gemini request execution failed', err, { attempt, durationMs, model: this.model }, 'gemini-adapter');
    if (this.isRateLimit(err, errorMsg)) {
      throw new RateLimitError(`Gemini Rate Limit exceeded: ${errorMsg}`);
    }
    throw new GeminiApiError(`Gemini generation failed: ${errorMsg}`);
  }

  private isTransientError(err: unknown, errorMsg: string): boolean {
    const status = typeof err === 'object' && err !== null && 'status' in err ? Number((err as { status?: unknown }).status) || 0 : 0;
    if (status === 429 || (status >= 500 && status < 600)) return true;
    return TRANSIENT_TOKENS.some((t) => errorMsg.includes(t));
  }

  private isRateLimit(err: unknown, errorMsg: string): boolean {
    const status = typeof err === 'object' && err !== null && 'status' in err ? Number((err as { status?: unknown }).status) || 0 : 0;
    if (status === 429) return true;
    const lower = errorMsg.toLowerCase();
    return RATE_LIMIT_TOKENS.some((t) => lower.includes(t.toLowerCase()));
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`AI generation timed out after ${timeoutMs}ms`)), timeoutMs);
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}

export const geminiClientAdapter = new GeminiClientAdapter();

