import { PLANNING_CONSTANTS } from '@/shared/config/constants';
import type { ComputedPlan } from '@/lib/engine/types';
import type { ValidatedEnrichmentOutput } from '@/lib/ai/validate';

interface CacheEntry {
  timestamp: number;
  data: ValidatedEnrichmentOutput;
}

const enrichmentCache = new Map<string, CacheEntry>();
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const windowMs = PLANNING_CONSTANTS.RATE_LIMIT.WINDOW_MS;
  const maxRequests = PLANNING_CONSTANTS.RATE_LIMIT.MAX_REQUESTS;

  const timestamps = (rateLimitMap.get(identifier) || []).filter(
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
  rateLimitMap.set(identifier, timestamps);

  return {
    allowed: true,
    remaining: maxRequests - timestamps.length,
  };
}

export function clearEnrichmentCache(): void {
  enrichmentCache.clear();
}

/**
 * Creates deterministic hash key from plan parameters for caching.
 */
export function createPlanCacheKey(plan: ComputedPlan): string {
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

export function getCachedEnrichment(cacheKey: string): ValidatedEnrichmentOutput | null {
  const cached = enrichmentCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < PLANNING_CONSTANTS.CACHE.TTL_MS) {
    return cached.data;
  }
  return null;
}

export function setCachedEnrichment(
  cacheKey: string,
  data: ValidatedEnrichmentOutput,
  ttlOffsetMs = 0
): void {
  enrichmentCache.set(cacheKey, {
    timestamp: Date.now() - ttlOffsetMs,
    data,
  });
}
