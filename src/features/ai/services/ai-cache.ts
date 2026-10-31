import { ComputedPlan } from '@/lib/engine/types';
import { ValidatedEnrichmentOutput, RateLimitStatus } from '../types';
import { PLANNING_CONSTANTS } from '@/shared/config/constants';

export interface CacheEntry {
  timestamp: number;
  data: ValidatedEnrichmentOutput;
}

export class AICacheService {
  private enrichmentCache = new Map<string, CacheEntry>();
  private rateLimitMap = new Map<string, number[]>();

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

  public getCachedEnrichment(cacheKey: string): ValidatedEnrichmentOutput | null {
    const cached = this.enrichmentCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < PLANNING_CONSTANTS.CACHE.TTL_MS) {
      return cached.data;
    }
    return null;
  }

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

  public clearCache(): void {
    this.enrichmentCache.clear();
  }
}

export const aiCacheService = new AICacheService();
