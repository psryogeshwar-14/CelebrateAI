import type { ComputedPlan } from '@/lib/engine/types';
import { recommendationService } from '@/features/ai';

export function getOfflineFallback(plan: ComputedPlan) {
  return recommendationService.getOfflineFallback(plan);
}
