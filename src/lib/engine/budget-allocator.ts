import { RawCategoryRule } from './budget-rules';
import { EventPlanningInput, BudgetCategoryAllocation } from './types';
import { roundToLargestRemainder } from '../utils/deterministic';

function adjustGuestCountWeights(weights: Record<string, number>, input: EventPlanningInput): void {
  const guestCount = Math.max(1, input.guestCount);
  if (input.eventType === 'wedding') {
    if (guestCount > 250) {
      weights['catering'] += 4;
      weights['venue'] += 1;
      weights['decor'] -= 2;
      weights['photography'] -= 1;
      weights['gifts'] -= 2;
    } else if (guestCount < 80) {
      weights['catering'] -= 3;
      weights['decor'] += 2;
      weights['photography'] += 1;
    }
  } else if (input.eventType === 'birthday') {
    if (guestCount > 60) {
      weights['food'] += 4;
      weights['decor'] -= 2;
      weights['return_gifts'] -= 2;
    } else if (guestCount < 20) {
      weights['food'] -= 3;
      weights['cake'] += 1;
      weights['decor'] += 2;
    }
  } else if (input.eventType === 'community_event' && guestCount > 400) {
    weights['catering'] += 3;
    weights['volunteers_logistics'] += 2;
    weights['decor'] -= 2;
    weights['publicity'] -= 3;
  }
}

function adjustCityAndVenueWeights(
  weights: Record<string, number>,
  cityTier: 1 | 2 | 3,
  venueType?: string
): void {
  if (cityTier === 1) {
    if (weights['venue']) weights['venue'] += 2;
    if (weights['catering']) weights['catering'] += 2;
    if (weights['food']) weights['food'] += 2;
    if (weights['decor']) weights['decor'] -= 2;
    if (weights['gifts']) weights['gifts'] -= 1;
    if (weights['publicity']) weights['publicity'] -= 1;
  } else if (cityTier === 3) {
    if (weights['venue']) weights['venue'] -= 2;
    if (weights['catering']) weights['catering'] -= 2;
    if (weights['food']) weights['food'] -= 2;
    if (weights['transport']) weights['transport'] += 2;
    if (weights['decor']) weights['decor'] += 2;
  }

  if (venueType === 'outdoor') {
    weights['contingency'] = Math.max(weights['contingency'], 12);
    if (weights['decor']) weights['decor'] += 2;
    if (weights['venue']) weights['venue'] -= 2;
  } else if (venueType === 'indoor') {
    if (weights['venue']) weights['venue'] += 1;
    if (weights['decor']) weights['decor'] -= 1;
  }
}

function adjustStyleAndDietaryWeights(
  weights: Record<string, number>,
  style?: string,
  dietaryNeeds: string[] = []
): void {
  if (style === 'budget') {
    if (weights['photography']) weights['photography'] -= 2;
    if (weights['decor']) weights['decor'] -= 2;
    if (weights['entertainment']) weights['entertainment'] -= 2;
    if (weights['attire']) weights['attire'] -= 2;
    if (weights['gifts']) weights['gifts'] -= 1;
    if (weights['catering']) weights['catering'] += 4;
    if (weights['food']) weights['food'] += 4;
  } else if (style === 'premium') {
    if (weights['decor']) weights['decor'] += 3;
    if (weights['photography']) weights['photography'] += 2;
    if (weights['attire']) weights['attire'] += 2;
    if (weights['entertainment']) weights['entertainment'] += 1;
    if (weights['venue']) weights['venue'] -= 2;
    if (weights['catering']) weights['catering'] -= 3;
    if (weights['food']) weights['food'] -= 3;
  }

  if (dietaryNeeds.length > 0) {
    const foodKey = weights['catering'] ? 'catering' : 'food';
    if (weights[foodKey]) {
      weights[foodKey] += 2;
      if (weights['decor']) weights['decor'] -= 1;
      if (weights['invitations']) weights['invitations'] -= 1;
    }
  }
}

export function computeCategoryWeights(
  baselineRules: RawCategoryRule[],
  input: EventPlanningInput,
  cityTier: 1 | 2 | 3
): Record<string, number> {
  const weights: Record<string, number> = {};
  for (const rule of baselineRules) {
    weights[rule.category] = rule.basePercentage;
  }
  adjustGuestCountWeights(weights, input);
  adjustCityAndVenueWeights(weights, cityTier, input.venueType);
  adjustStyleAndDietaryWeights(weights, input.style, input.dietaryRequirements);
  weights['contingency'] = Math.max(10, weights['contingency'] || 10);
  return weights;
}

function computeScaledPercentages(
  baselineRules: RawCategoryRule[],
  weights: Record<string, number>
): number[] {
  const nonContingency = baselineRules.filter((r) => !r.isContingency);
  const contingencyWeight = weights['contingency'];
  const targetNonContingencySum = 100 - contingencyWeight;
  const currentNonContingencySum = nonContingency.reduce(
    (acc, r) => acc + Math.max(1, weights[r.category] || 1),
    0
  );

  return baselineRules.map((rule) => {
    if (rule.isContingency) return contingencyWeight;
    return (
      (Math.max(1, weights[rule.category] || 1) / currentNonContingencySum) *
      targetNonContingencySum
    );
  });
}

function ensurePositiveIntegerAmounts(amounts: number[], totalBudget: number): number[] {
  let adjusted = amounts.map((amt) => Math.max(1, amt));
  let excess = adjusted.reduce((a, b) => a + b, 0) - totalBudget;
  while (excess > 0) {
    let maxIdx = 0;
    for (let i = 1; i < adjusted.length; i++) {
      if (adjusted[i] > adjusted[maxIdx]) maxIdx = i;
    }
    if (adjusted[maxIdx] > 1) {
      adjusted[maxIdx] -= 1;
      excess -= 1;
    } else {
      break;
    }
  }
  return adjusted;
}

export function allocateBudgetAmounts(
  baselineRules: RawCategoryRule[],
  weights: Record<string, number>,
  totalBudget: number
): BudgetCategoryAllocation[] {
  const finalPercentages = computeScaledPercentages(baselineRules, weights);
  let amounts = roundToLargestRemainder(finalPercentages, totalBudget);

  const zeroCount = amounts.filter((amt) => amt <= 0).length;
  if (zeroCount > 0 && totalBudget >= amounts.length) {
    amounts = ensurePositiveIntegerAmounts(amounts, totalBudget);
  }

  return baselineRules.map((rule, idx) => ({
    category: rule.category,
    displayName: rule.displayName,
    percentage: Math.round((amounts[idx] / totalBudget) * 1000) / 10,
    amount: amounts[idx],
    notes: rule.notes,
    isContingency: Boolean(rule.isContingency),
  }));
}
