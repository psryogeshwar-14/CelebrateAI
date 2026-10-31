import {
  BudgetCategoryAllocation,
  BudgetHealthResult,
  CateringFeasibility,
  EventPlanningInput,
} from './types';
import { MIN_CATERING_PER_GUEST } from './city-tiers';
import { formatINR } from '../utils/deterministic';

export function evaluateCateringFeasibility(
  allocations: BudgetCategoryAllocation[],
  input: EventPlanningInput,
  cityTier: 1 | 2 | 3
): { cateringPerGuest: number; cateringFeasibility: CateringFeasibility } {
  const guestCount = Math.max(1, input.guestCount);
  const foodAlloc = allocations.find((a) => a.category === 'catering' || a.category === 'food');
  const foodAmount = foodAlloc ? foodAlloc.amount : 0;
  const cateringPerGuest = Math.floor(foodAmount / guestCount);

  const minRecommendedPerGuest =
    MIN_CATERING_PER_GUEST[input.eventType]?.[cityTier] || 400;
  const isCateringFeasible = cateringPerGuest >= minRecommendedPerGuest;

  const warning = !isCateringFeasible
    ? `Catering allocation is ${formatINR(cateringPerGuest)}/guest, which is below the recommended minimum of ${formatINR(minRecommendedPerGuest)}/guest for a ${input.eventType.replace('_', ' ')} in a Tier ${cityTier} city.`
    : undefined;

  return {
    cateringPerGuest,
    cateringFeasibility: {
      isFeasible: isCateringFeasible,
      minRecommendedPerGuest,
      actualPerGuest: cateringPerGuest,
      warning,
    },
  };
}

export function evaluateBudgetHealth(
  totalBudget: number,
  guestCount: number,
  eventType: string,
  cateringPerGuest: number,
  minRecommendedPerGuest: number,
  isCateringFeasible: boolean,
  contingencyPercentage: number,
  contingencyAmount: number
): BudgetHealthResult {
  const costPerGuestTotal = totalBudget / guestCount;
  const minTotalPerGuest =
    eventType === 'wedding' ? 1200 : eventType === 'birthday' ? 600 : 250;

  let score: BudgetHealthResult['score'] = 'healthy';
  let description = 'Budget allocations are well-balanced and include a healthy contingency reserve.';

  if (costPerGuestTotal < minTotalPerGuest || cateringPerGuest < minRecommendedPerGuest * 0.75) {
    score = 'over_budget';
    description = `Total budget (${formatINR(totalBudget)}) is significantly strained for ${guestCount} guests (${formatINR(Math.round(costPerGuestTotal))}/guest). Essential catering or venue will face major shortages.`;
  } else if (!isCateringFeasible || costPerGuestTotal < minTotalPerGuest * 1.3) {
    score = 'tight';
    description = `Budget is achievable but tight (${formatINR(Math.round(costPerGuestTotal))}/guest). Minimal room for decor or entertainment upgrades.`;
  }

  return {
    score,
    description,
    variance: 0,
    contingencyPercentage,
    contingencyAmount,
  };
}
