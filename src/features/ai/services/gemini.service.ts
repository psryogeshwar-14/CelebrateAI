import { ComputedPlan } from '@/lib/engine/types';
import {
  IGeminiClientAdapter,
  ValidatedEnrichmentOutput,
  AssistantChatReply,
  RateLimitStatus,
  GeminiServiceOptions,
} from '../types';
import { geminiClientAdapter } from '../adapters/gemini-client';
import { recommendationService, RecommendationService, sanitizeText } from './recommendation.service';
import { buildEventPlannerPrompt } from '../prompts/event-planner.prompt';
import { buildReplanPrompt } from '../prompts/replan.prompt';
import { buildAssistantSystemPrompt } from '../prompts/assistant.prompt';
import {
  planEnrichmentResponseSchema,
  assistantChatResponseSchema,
  assistantChatZodSchema,
} from '../schemas/recommendation.schema';
import { PLANNING_CONSTANTS } from '@/shared/config/constants';
import { formatINR } from '@/lib/utils/deterministic';
import { logger } from '@/shared/lib/logger';

interface CacheEntry {
  timestamp: number;
  data: ValidatedEnrichmentOutput;
}

/**
 * GeminiService
 * Orchestrates prompt construction, 10-minute in-memory caching,
 * sliding-window rate limiting, schema validation, and error mapping.
 */
export class GeminiService {
  private adapter: IGeminiClientAdapter;
  private recommendationService: RecommendationService;
  private enrichmentCache = new Map<string, CacheEntry>();
  private rateLimitMap = new Map<string, number[]>();

  constructor(dependencies?: {
    adapter?: IGeminiClientAdapter;
    recommendationService?: RecommendationService;
  }) {
    this.adapter = dependencies?.adapter || geminiClientAdapter;
    this.recommendationService = dependencies?.recommendationService || recommendationService;
  }

  /**
   * Evaluates client IP sliding-window rate limiting (10 requests per minute).
   */
  public checkRateLimit(identifier: string): RateLimitStatus {
    const now = Date.now();
    const windowMs = PLANNING_CONSTANTS.RATE_LIMIT.WINDOW_MS;
    const maxRequests = PLANNING_CONSTANTS.RATE_LIMIT.MAX_REQUESTS;

    const timestamps = (this.rateLimitMap.get(identifier) || []).filter(
      (t) => now - t < windowMs
    );

    if (timestamps.length >= maxRequests) {
      const oldest = timestamps[0];
      const retryAfterSec = Math.ceil((windowMs - (now - oldest)) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSec: Math.max(1, retryAfterSec),
      };
    }

    timestamps.push(now);
    this.rateLimitMap.set(identifier, timestamps);

    return {
      allowed: true,
      remaining: maxRequests - timestamps.length,
    };
  }

  /**
   * Deterministically generates cache key from plan baseline parameters.
   */
  public createPlanCacheKey(plan: ComputedPlan): string {
    const { input, budget } = plan;
    return [
      input.eventType,
      input.city.toLowerCase().trim(),
      input.eventDate,
      input.guestCount,
      budget.totalBudget,
      input.style || 'balanced',
      input.venueType || 'indoor',
      (input.dietaryRequirements || []).slice().sort().join(','),
      (input.accessibilityRequirements || []).slice().sort().join(','),
    ].join('|');
  }

  /**
   * Retrieves unexpired cached recommendation if present.
   */
  public getCachedEnrichment(cacheKey: string): ValidatedEnrichmentOutput | null {
    const cached = this.enrichmentCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < PLANNING_CONSTANTS.CACHE.TTL_MS) {
      return cached.data;
    }
    return null;
  }

  /**
   * Stores validated recommendations into cache.
   */
  public setCachedEnrichment(
    cacheKey: string,
    data: ValidatedEnrichmentOutput,
    ttlOffsetMs = 0
  ): void {
    this.enrichmentCache.set(cacheKey, {
      timestamp: Date.now() - ttlOffsetMs,
      data,
    });
  }

  /**
   * Clears the recommendation cache.
   */
  public clearCache(): void {
    this.enrichmentCache.clear();
  }

  /**
   * Generates creative enrichment via Gemini with caching, prompt injection defense,
   * Zod post-validation, and fallback degradation.
   */
  public async generateEnrichment(
    plan: ComputedPlan,
    options?: GeminiServiceOptions
  ): Promise<ValidatedEnrichmentOutput> {
    const cacheKey = this.createPlanCacheKey(plan);

    // 1. In-memory cache hit
    if (!options?.bypassCache) {
      const cached = this.getCachedEnrichment(cacheKey);
      if (cached) {
        logger.info('Returning cached plan enrichment', { cacheKey }, 'gemini-service');
        return cached;
      }
    }

    // 2. Check if Gemini credentials / adapter are available
    if (!this.adapter.isAvailable()) {
      logger.warn('Gemini client not configured. Loading deterministic fallback recommendations.', undefined, 'gemini-service');
      const fallback = this.recommendationService.getOfflineFallback(plan);
      this.setCachedEnrichment(cacheKey, fallback);
      return fallback;
    }

    // 3. Select versioned prompt
    const prompt = options?.isReplan
      ? buildReplanPrompt(plan, options.changesSummary)
      : buildEventPlannerPrompt(plan);

    try {
      const response = await this.adapter.generateContent({
        contents: prompt,
        responseSchema: planEnrichmentResponseSchema,
        timeoutMs: PLANNING_CONSTANTS.AI.REQUEST_TIMEOUT_MS,
      });

      const parsedJson = JSON.parse(response.text);
      const validated = this.recommendationService.validateAndMerge(parsedJson, plan);

      this.setCachedEnrichment(cacheKey, validated);
      return validated;
    } catch (err: unknown) {
      logger.error('Gemini plan enrichment failed. Returning offline fallback template', err, undefined, 'gemini-service');
      const fallback = this.recommendationService.getOfflineFallback(plan);
      // Cache fallback briefly (3 minutes) to prevent hammering during outages
      this.setCachedEnrichment(cacheKey, fallback, PLANNING_CONSTANTS.CACHE.TTL_MS - 3 * 60 * 1000);
      return fallback;
    }
  }

  /**
   * Executes grounded assistant Q&A strictly constrained to event plan context.
   */
  public async generateAssistantReply(
    plan: ComputedPlan,
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<AssistantChatReply> {
    if (!this.adapter.isAvailable()) {
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

    const systemInstruction = buildAssistantSystemPrompt(plan);

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
      const response = await this.adapter.generateContent({
        contents,
        systemInstruction,
        responseSchema: assistantChatResponseSchema,
        timeoutMs: PLANNING_CONSTANTS.AI.ASSISTANT_TIMEOUT_MS,
      });

      const parsed = JSON.parse(response.text);
      const validated = assistantChatZodSchema.safeParse(parsed);

      if (!validated.success) {
        logger.warn('Assistant response failed Zod validation', { issues: validated.error.flatten() }, 'gemini-service');
        return {
          answer: sanitizeText(parsed.answer || 'I am ready to help you plan your event within your budget and timeline.'),
          suggestedQuestions: [
            'What tasks are overdue right now?',
            'How can I optimize our catering spend?',
            'What is our contingency plan for weather?',
          ],
          citations: ['Event Overview'],
          isAIOffline: false,
        };
      }

      const answer = sanitizeText(validated.data.answer);
      const suggestedQuestions = (validated.data.suggestedQuestions || [])
        .slice(0, 3)
        .map((q) => sanitizeText(q));
      const citations = (validated.data.citations || []).map((c) => sanitizeText(c));

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
      logger.error('Grounded assistant error, returning safe fallback', err, undefined, 'gemini-service');
      return {
        answer: `I am having trouble connecting to the planning service right now. However, your plan is locked with a budget of ${formatINR(plan.budget.totalBudget)} and ${plan.timeline.length} milestones.`,
        suggestedQuestions: [
          'What are my top budget allocations?',
          'Which milestones are due next?',
          'What is our contingency reserve?',
        ],
        citations: ['Budget Total'],
        isAIOffline: true,
      };
    }
  }
}

// Default exportable singleton instance
export const geminiService = new GeminiService();
