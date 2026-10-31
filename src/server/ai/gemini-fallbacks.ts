import { ComputedPlan } from '@/lib/engine/types';
import { getOfflineFallbackEnrichment, ValidatedEnrichmentOutput } from '@/lib/ai/validate';

/**
 * Returns deterministic offline cultural templates when Gemini API is unconfigured or unreachable.
 */
export function getOfflineFallback(plan: ComputedPlan): ValidatedEnrichmentOutput {
  return getOfflineFallbackEnrichment(plan);
}
