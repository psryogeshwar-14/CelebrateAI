import { GoogleGenAI } from '@google/genai';
import { ComputedPlan } from '@/lib/engine/types';
import { planEnrichmentResponseSchema, assistantChatResponseSchema } from '@/lib/ai/schema';
import { buildEnrichmentPrompt, buildAssistantSystemInstruction } from '@/lib/ai/prompts';
import {
  validateAndMergeEnrichment,
  ValidatedEnrichmentOutput,
  sanitizeText,
} from '@/lib/ai/validate';
import { formatINR } from '@/lib/utils/deterministic';
import { getErrorMessage } from '@/shared/lib/errors';
import { logger } from '@/shared/lib/logger';
import { PLANNING_CONSTANTS } from '@/shared/config/constants';
import {
  checkRateLimit,
  clearEnrichmentCache,
  createPlanCacheKey,
  getCachedEnrichment,
  setCachedEnrichment,
} from './gemini-cache';
import { getOfflineFallback } from './gemini-fallbacks';

export { checkRateLimit, clearEnrichmentCache };

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = PLANNING_CONSTANTS.AI.REQUEST_TIMEOUT_MS
): Promise<T> {
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
 * Generates personalized creative enrichment via Gemini 2.5 Flash.
 * Enforces caching, rate limiting, timeouts, and automatic retry on 429/5xx.
 * Falls back safely to deterministic template ideas if Gemini is unavailable.
 */
export async function generatePlanEnrichment(
  plan: ComputedPlan,
  options?: { bypassCache?: boolean; userIdentifier?: string }
): Promise<ValidatedEnrichmentOutput> {
  const cacheKey = createPlanCacheKey(plan);

  // 1. Check in-memory cache
  if (!options?.bypassCache) {
    const cached = getCachedEnrichment(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const aiClient = getGeminiClient();
  if (!aiClient) {
    console.warn('GEMINI_API_KEY not configured. Loading deterministic fallback ideas.');
    const fallback = getOfflineFallback(plan);
    setCachedEnrichment(cacheKey, fallback);
    return fallback;
  }

  const prompt = buildEnrichmentPrompt(plan);

  const executeCall = async (attempt = 1): Promise<ValidatedEnrichmentOutput> => {
    try {
      const response = await withTimeout(
        aiClient.models.generateContent({
          model: process.env.GEMINI_MODEL || PLANNING_CONSTANTS.AI.DEFAULT_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseJsonSchema: planEnrichmentResponseSchema,
          },
        }),
        PLANNING_CONSTANTS.AI.REQUEST_TIMEOUT_MS
      );

      const rawText = response.text;
      if (!rawText) {
        throw new Error('Received empty text response from Gemini API');
      }

      const parsedJson = JSON.parse(rawText);
      const validated = validateAndMergeEnrichment(parsedJson, plan);

      setCachedEnrichment(cacheKey, validated);
      return validated;
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      const isStatusError = typeof err === 'object' && err !== null && 'status' in err;
      const status = isStatusError ? Number((err as { status?: unknown }).status) || 0 : 0;
      const isRetryable =
        status === 429 ||
        (status >= 500 && status < 600) ||
        errorMsg.includes('429') ||
        errorMsg.includes('timeout');

      if (attempt === 1 && isRetryable) {
        logger.warn(
          `Gemini call encountered error (${errorMsg}). Retrying in ${PLANNING_CONSTANTS.AI.RETRY_DELAY_MS}ms...`,
          undefined,
          'gemini-adapter'
        );
        await new Promise((r) => setTimeout(r, PLANNING_CONSTANTS.AI.RETRY_DELAY_MS));
        return executeCall(2);
      }

      logger.error('Gemini plan enrichment failed. Returning offline fallback template', err, undefined, 'gemini-adapter');
      const fallback = getOfflineFallback(plan);
      // Cache fallback briefly (3 minutes) to avoid slamming API repeatedly if down
      setCachedEnrichment(
        cacheKey,
        fallback,
        PLANNING_CONSTANTS.CACHE.TTL_MS - 3 * 60 * 1000
      );
      return fallback;
    }
  };

  return executeCall();
}

export interface AssistantChatReply {
  answer: string;
  suggestedQuestions: string[];
  citations: string[];
  isAIOffline: boolean;
}

/**
 * Executes grounded assistant chat about user's event plan.
 */
export async function generateGroundedAssistantReply(
  plan: ComputedPlan,
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<AssistantChatReply> {
  const aiClient = getGeminiClient();

  if (!aiClient) {
    return {
      answer: `[AI Offline] CelebrateAI assistant is currently offline. Your plan for "${sanitizeText(plan.input.title)}" has a total budget of ${formatINR(plan.budget.totalBudget)} and ${plan.timeline.length} back-scheduled milestones.`,
      suggestedQuestions: [
        'What are my top budget categories?',
        'Which milestones are due next?',
        'What vendors do I need to book first?',
      ],
      citations: ['Budget Total', 'Timeline Overview'],
      isAIOffline: true,
    };
  }

  const systemInstruction = buildAssistantSystemInstruction(plan);

  const contents = [
    ...history.slice(-6).map((h) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }],
    })),
    {
      role: 'user',
      parts: [{ text: message }],
    },
  ];

  try {
    const response = await withTimeout(
      aiClient.models.generateContent({
        model: process.env.GEMINI_MODEL || PLANNING_CONSTANTS.AI.DEFAULT_MODEL,
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseJsonSchema: assistantChatResponseSchema,
        },
      }),
      PLANNING_CONSTANTS.AI.ASSISTANT_TIMEOUT_MS
    );

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty assistant response');
    }

    const parsed = JSON.parse(rawText);
    const answer = sanitizeText(parsed.answer || '');
    const suggestedQuestions = (parsed.suggestedQuestions || [])
      .slice(0, 3)
      .map((q: string) => sanitizeText(q));
    const citations = (parsed.citations || []).map((c: string) => sanitizeText(c));

    return {
      answer,
      suggestedQuestions:
        suggestedQuestions.length === 3
          ? suggestedQuestions
          : [
              'What tasks are overdue right now?',
              'How can I optimize our catering spend?',
              'What is our contingency plan for weather?',
            ],
      citations,
      isAIOffline: false,
    };
  } catch (err: unknown) {
    logger.error('Grounded assistant error, returning safe fallback', err, undefined, 'gemini-adapter');
    return {
      answer: `I am currently having trouble connecting to Gemini. For "${sanitizeText(plan.input.title)}", you have ${plan.timeline.length} back-scheduled tasks and ${formatINR(plan.budget.contingencyAmount)} in contingency reserve.`,
      suggestedQuestions: [
        'Review our budget health',
        'Check upcoming vendor deadlines',
        'Show day-of run sheet',
      ],
      citations: ['Contingency Reserve'],
      isAIOffline: true,
    };
  }
}
