import { GoogleGenAI } from '@google/genai';
import {
  IGeminiClientAdapter,
  GeminiGenerateOptions,
  GeminiResponse,
} from '../types';
import { PLANNING_CONSTANTS } from '@/shared/config/constants';
import { GeminiApiError, RateLimitError, getErrorMessage } from '@/shared/lib/errors';
import { logger } from '@/shared/lib/logger';

export interface GeminiClientAdapterOptions {
  apiKey?: string;
  model?: string;
  client?: GoogleGenAI;
  requestTimeoutMs?: number;
  retryDelayMs?: number;
}

/**
 * GeminiClientAdapter
 * Owns low-level Google GenAI SDK communication, timeout race handling,
 * single-attempt transient retry, and typed error mapping.
 */
export class GeminiClientAdapter implements IGeminiClientAdapter {
  private client: GoogleGenAI | null = null;
  private model: string;
  private defaultTimeoutMs: number;
  private retryDelayMs: number;

  constructor(options?: GeminiClientAdapterOptions) {
    const apiKey = options?.apiKey || process.env.GEMINI_API_KEY;
    this.model = options?.model || process.env.GEMINI_MODEL || PLANNING_CONSTANTS.AI.DEFAULT_MODEL;
    this.defaultTimeoutMs = options?.requestTimeoutMs || PLANNING_CONSTANTS.AI.REQUEST_TIMEOUT_MS;
    this.retryDelayMs = options?.retryDelayMs || PLANNING_CONSTANTS.AI.RETRY_DELAY_MS;

    if (options?.client) {
      this.client = options.client;
    } else if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== '') {
      this.client = new GoogleGenAI({ apiKey });
    }
  }

  /**
   * Returns true if client has valid credentials and is ready for network calls.
   */
  public isAvailable(): boolean {
    return this.client !== null;
  }

  /**
   * Executes Gemini JSON completion with timeout and automatic transient retry.
   */
  public async generateContent(options: GeminiGenerateOptions): Promise<GeminiResponse> {
    if (!this.client) {
      throw new GeminiApiError('Gemini API client is not configured or missing API key.');
    }

    const timeoutMs = options.timeoutMs || this.defaultTimeoutMs;

    const executeCall = async (attempt: number): Promise<GeminiResponse> => {
      const startTime = Date.now();
      try {
        const promise = this.client!.models.generateContent({
          model: this.model,
          contents: options.contents as Parameters<typeof this.client.models.generateContent>[0]['contents'],
          config: {
            ...(options.systemInstruction ? { systemInstruction: options.systemInstruction } : {}),
            responseMimeType: 'application/json',
            ...(options.responseSchema ? { responseJsonSchema: options.responseSchema } : {}),
          },
        });

        const response = await this.withTimeout(promise, timeoutMs);
        const durationMs = Date.now() - startTime;

        const rawText = response.text;
        if (!rawText || rawText.trim() === '') {
          throw new GeminiApiError('Received empty text completion from Gemini API.');
        }

        logger.info('Gemini generation successful', { durationMs, attempt, model: this.model }, 'gemini-adapter');
        return { text: rawText };
      } catch (err: unknown) {
        const durationMs = Date.now() - startTime;
        const errorMsg = getErrorMessage(err);
        const isTransient = this.isTransientError(err, errorMsg);

        if (attempt === 1 && isTransient) {
          logger.warn(
            `Gemini request failed transiently (${errorMsg}). Retrying in ${this.retryDelayMs}ms...`,
            { attempt, durationMs },
            'gemini-adapter'
          );
          await new Promise((resolve) => setTimeout(resolve, this.retryDelayMs));
          return executeCall(2);
        }

        // Final failure after retry
        logger.error(
          'Gemini request execution failed',
          err,
          { attempt, durationMs, model: this.model },
          'gemini-adapter'
        );

        if (this.isRateLimit(err, errorMsg)) {
          throw new RateLimitError('Gemini API rate limit reached. Please wait a moment before trying again.', 60);
        }

        throw new GeminiApiError(`Gemini completion failed: ${errorMsg}`, { originalError: errorMsg });
      }
    };

    return executeCall(1);
  }

  /**
   * Enforces request timeout race condition.
   */
  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`AI generation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
      clearTimeout(timer);
    });
  }

  /**
   * Detects transient errors eligible for 1 retry.
   */
  private isTransientError(err: unknown, errorMsg: string): boolean {
    const isStatusError = typeof err === 'object' && err !== null && 'status' in err;
    const status = isStatusError ? Number((err as { status?: unknown }).status) || 0 : 0;

    return (
      status === 429 ||
      (status >= 500 && status < 600) ||
      errorMsg.includes('429') ||
      errorMsg.includes('RESOURCE_EXHAUSTED') ||
      errorMsg.includes('timeout') ||
      errorMsg.includes('ETIMEDOUT') ||
      errorMsg.includes('ECONNRESET') ||
      errorMsg.includes('fetch failed')
    );
  }

  /**
   * Identifies 429 rate limit exceptions.
   */
  private isRateLimit(err: unknown, errorMsg: string): boolean {
    const isStatusError = typeof err === 'object' && err !== null && 'status' in err;
    const status = isStatusError ? Number((err as { status?: unknown }).status) || 0 : 0;

    return (
      status === 429 ||
      errorMsg.includes('429') ||
      errorMsg.includes('RESOURCE_EXHAUSTED') ||
      errorMsg.toLowerCase().includes('rate limit')
    );
  }
}

// Default exportable singleton instance
export const geminiClientAdapter = new GeminiClientAdapter();
