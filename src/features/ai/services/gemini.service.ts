import type { ComputedPlan } from '@/lib/engine/types';
import type {
  IGeminiClientAdapter,
  ValidatedEnrichmentOutput,
  AssistantChatReply,
  RateLimitStatus,
  GeminiServiceOptions,
} from '../types';
import { geminiClientAdapter } from '../adapters/gemini-client';
import type { RecommendationService} from './recommendation.service';
import { recommendationService, sanitizeText } from './recommendation.service';
import type { AICacheService } from './ai-cache';
import { aiCacheService } from './ai-cache';
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

/**
 * GeminiService
 * Orchestrates prompt construction, in-memory caching, sliding-window rate limiting,
 * schema validation, and error mapping.
 */
export class GeminiService {
  private adapter: IGeminiClientAdapter;
  private recommendationService: RecommendationService;
  private cacheService: AICacheService;

  constructor(dependencies?: {
    adapter?: IGeminiClientAdapter;
    recommendationService?: RecommendationService;
    cacheService?: AICacheService;
  }) {
    this.adapter = dependencies?.adapter || geminiClientAdapter;
    this.recommendationService = dependencies?.recommendationService || recommendationService;
    this.cacheService = dependencies?.cacheService || aiCacheService;
  }

  public checkRateLimit(identifier: string): RateLimitStatus {
    return this.cacheService.checkRateLimit(identifier);
  }

  public createPlanCacheKey(plan: ComputedPlan): string {
    return this.cacheService.createPlanCacheKey(plan);
  }

  public getCachedEnrichment(cacheKey: string): ValidatedEnrichmentOutput | null {
    return this.cacheService.getCachedEnrichment(cacheKey);
  }

  public setCachedEnrichment(
    cacheKey: string,
    data: ValidatedEnrichmentOutput,
    ttlOffsetMs = 0
  ): void {
    this.cacheService.setCachedEnrichment(cacheKey, data, ttlOffsetMs);
  }

  public clearCache(): void {
    this.cacheService.clearCache();
  }

  public async generateEnrichment(
    plan: ComputedPlan,
    options?: GeminiServiceOptions
  ): Promise<ValidatedEnrichmentOutput> {
    const cacheKey = this.createPlanCacheKey(plan);

    if (!options?.bypassCache) {
      const cached = this.getCachedEnrichment(cacheKey);
      if (cached) {
        logger.info('Returning cached plan enrichment', { cacheKey }, 'gemini-service');
        return cached;
      }
    }

    if (!this.adapter.isAvailable()) {
      logger.warn('Gemini client not configured. Loading deterministic fallback recommendations.', undefined, 'gemini-service');
      const fallback = this.recommendationService.getOfflineFallback(plan);
      this.setCachedEnrichment(cacheKey, fallback);
      return fallback;
    }

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
      this.setCachedEnrichment(cacheKey, fallback, PLANNING_CONSTANTS.CACHE.TTL_MS - 3 * 60 * 1000);
      return fallback;
    }
  }

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

export const geminiService = new GeminiService();
