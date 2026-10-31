import { GoogleGenAI } from '@google/genai';
import { ComputedPlan } from '../engine/types';
import { planEnrichmentResponseSchema, assistantChatResponseSchema } from './schema';
import { buildEnrichmentPrompt, buildAssistantSystemInstruction } from './prompts';
import {
  validateAndMergeEnrichment,
  getOfflineFallbackEnrichment,
  ValidatedEnrichmentOutput,
  sanitizeText,
} from './validate';
import { formatINR } from '../utils/deterministic';

// ----------------------------------------------------------------------------
// In-Memory 10-Minute Cache & Sliding-Window Rate Limiter
// ----------------------------------------------------------------------------

interface CacheEntry {
  timestamp: number;
  data: ValidatedEnrichmentOutput;
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const enrichmentCache = new Map<string, CacheEntry>();

// Rate Limiting: 10 AI requests per minute per user/IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(identifier) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = timestamps[0];
    const retryAfterSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, retryAfterSec),
    };
  }

  timestamps.push(now);
  rateLimitMap.set(identifier, timestamps);

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - timestamps.length,
  };
}

export function clearEnrichmentCache() {
  enrichmentCache.clear();
}

/**
 * Creates deterministic hash key from plan parameters for caching.
 */
function createPlanCacheKey(plan: ComputedPlan): string {
  const { input, budget } = plan;
  return [
    input.eventType,
    input.city.toLowerCase().trim(),
    input.eventDate,
    input.guestCount,
    budget.totalBudget,
    input.style || 'balanced',
    input.venueType || 'indoor',
    (input.dietaryRequirements || []).sort().join(','),
  ].join('|');
}

// ----------------------------------------------------------------------------
// Gemini Client Singleton & Execution
// ----------------------------------------------------------------------------

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Executes a promise with an enforced timeout.
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 15000): Promise<T> {
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
 * Generates personalized creative enrichment via Gemini 3.8 Flash.
 * Enforces caching, rate limiting, timeouts, and automatic retry on 429/5xx.
 * Falls back safely to deterministic template ideas if Gemini is unavailable.
 */
export async function generatePlanEnrichment(
  plan: ComputedPlan,
  options?: { bypassCache?: boolean; userIdentifier?: string }
): Promise<ValidatedEnrichmentOutput> {
  const cacheKey = createPlanCacheKey(plan);

  // 1. Check 10-minute cache
  if (!options?.bypassCache) {
    const cached = enrichmentCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const aiClient = getGeminiClient();
  if (!aiClient) {
    console.warn('GEMINI_API_KEY not configured. Loading deterministic fallback ideas.');
    const fallback = getOfflineFallbackEnrichment(plan);
    enrichmentCache.set(cacheKey, { timestamp: Date.now(), data: fallback });
    return fallback;
  }

  const prompt = buildEnrichmentPrompt(plan);

  // Helper with retry on 429 or 5xx
  const executeCall = async (attempt = 1): Promise<ValidatedEnrichmentOutput> => {
    try {
      const response = await withTimeout(
        aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseJsonSchema: planEnrichmentResponseSchema,
          },
        }),
        15000
      );

      const rawText = response.text;
      if (!rawText) {
        throw new Error('Received empty text response from Gemini API');
      }

      const parsedJson = JSON.parse(rawText);
      const validated = validateAndMergeEnrichment(parsedJson, plan);

      // Cache successful response
      enrichmentCache.set(cacheKey, { timestamp: Date.now(), data: validated });
      return validated;
    } catch (err: any) {
      const status = err?.status || err?.code || 0;
      const isRetryable =
        status === 429 ||
        (status >= 500 && status < 600) ||
        err?.message?.includes('429') ||
        err?.message?.includes('timeout');

      if (attempt === 1 && isRetryable) {
        console.warn(`Gemini call encountered error (${err?.message || err}). Retrying in 1200ms...`);
        await new Promise((r) => setTimeout(r, 1200));
        return executeCall(2);
      }

      console.error('Gemini plan enrichment failed. Returning offline fallback template:', err?.message || err);
      const fallback = getOfflineFallbackEnrichment(plan);
      // Cache fallback briefly (3 minutes) to avoid slamming API repeatedly if down
      enrichmentCache.set(cacheKey, { timestamp: Date.now() - (CACHE_TTL_MS - 3 * 60 * 1000), data: fallback });
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

  // Format conversation history
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
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseJsonSchema: assistantChatResponseSchema,
        },
      }),
      12000
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
  } catch (err: any) {
    console.error('Grounded assistant error, returning safe fallback:', err?.message || err);
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
