import { EventPlanningInput, ComputedBudgetResult } from './types';
import { getCityCostTier } from './city-tiers';
import { getBaselineRules } from './budget-rules';
import { computeCategoryWeights, allocateBudgetAmounts } from './budget-allocator';
import { evaluateCateringFeasibility, evaluateBudgetHealth } from './budget-health';

export {
  WEDDING_BASELINE,
  BIRTHDAY_BASELINE,
  COMMUNITY_BASELINE,
} from './budget-rules';

/**
 * Calculates deterministic budget allocations tailored to event parameters.
 */
export function calculateBudget(input: EventPlanningInput): ComputedBudgetResult {
  const totalBudget = Math.max(1, Math.round(input.totalBudget));
  const guestCount = Math.max(1, input.guestCount);
  const cityTier = getCityCostTier(input.city);

  const baselineRules = getBaselineRules(input.eventType);
  const weights = computeCategoryWeights(baselineRules, input, cityTier);
  const allocations = allocateBudgetAmounts(baselineRules, weights, totalBudget);

  const contingencyCategory =
    allocations.find((a) => a.isContingency) || allocations[allocations.length - 1];
  const contingencyAmount = contingencyCategory.amount;
  const contingencyPercentage = Math.round((contingencyAmount / totalBudget) * 100);

  const { cateringPerGuest, cateringFeasibility } = evaluateCateringFeasibility(
    allocations,
    input,
    cityTier
  );

  const health = evaluateBudgetHealth(
    totalBudget,
    guestCount,
    input.eventType,
    cateringPerGuest,
    cateringFeasibility.minRecommendedPerGuest,
    cateringFeasibility.isFeasible,
    contingencyPercentage,
    contingencyAmount
  );

  return {
    totalBudget,
    allocations,
    contingencyPercentage,
    contingencyAmount,
    cateringPerGuest,
    cateringFeasibility,
    health,
  };
}
