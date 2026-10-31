import {
  EventPlanningInput,
  BudgetCategoryAllocation,
  ComputedBudgetResult,
  CateringFeasibility,
  BudgetHealthResult,
} from './types';
import { getCityCostTier, MIN_CATERING_PER_GUEST } from './city-tiers';
import { formatINR, roundToLargestRemainder } from '../utils/deterministic';

interface RawCategoryRule {
  category: string;
  displayName: string;
  basePercentage: number;
  notes: string;
  isContingency?: boolean;
}

// ----------------------------------------------------------------------------
// Baseline Allocations
// ----------------------------------------------------------------------------

const WEDDING_BASELINE: RawCategoryRule[] = [
  { category: 'venue', displayName: 'Venue & Kalyana Mantapa', basePercentage: 24, notes: 'Hall rental, guest accommodation & power backup' },
  { category: 'catering', displayName: 'Catering & Beverages', basePercentage: 24, notes: 'Multi-course feasts, live counters & welcome drinks' },
  { category: 'decor', displayName: 'Decor & Florals', basePercentage: 12, notes: 'Mandap, stage backdrop, entrance arch & floral styling' },
  { category: 'photography', displayName: 'Photography & Cinema', basePercentage: 9, notes: 'Candid photo, cinematic film & drone coverage' },
  { category: 'attire', displayName: 'Attire & Styling', basePercentage: 7, notes: 'Bridal silk sarees, sherwanis, jewelry & makeup' },
  { category: 'entertainment', displayName: 'Entertainment & Music', basePercentage: 5, notes: 'Live Nadaswaram, DJ, Sangeet sound & emcee' },
  { category: 'invitations', displayName: 'Invitations & Stationery', basePercentage: 3, notes: 'Digital invites, print cards & packaging' },
  { category: 'transport', displayName: 'Transport & Valet', basePercentage: 3, notes: 'VIP transit, airport pickups & valet coordination' },
  { category: 'gifts', displayName: 'Favors & Gifting', basePercentage: 3, notes: 'Mysore Pak sweets, traditional return gifts & hampers' },
  { category: 'contingency', displayName: 'Contingency Reserve', basePercentage: 10, notes: 'Emergency buffer for guest spillover & last-minute needs', isContingency: true },
];

const BIRTHDAY_BASELINE: RawCategoryRule[] = [
  { category: 'venue', displayName: 'Venue & Space Rental', basePercentage: 20, notes: 'Rooftop terrace, cafe, party hall or lounge' },
  { category: 'food', displayName: 'Food & Refreshments', basePercentage: 25, notes: 'Party buffet, live snack counters & drinks' },
  { category: 'cake', displayName: 'Celebration Cake', basePercentage: 5, notes: 'Custom themed fondant/artisanal cake & dessert platter' },
  { category: 'decor', displayName: 'Decor & Lighting', basePercentage: 14, notes: 'Thematic balloons, neon signs & photo booth' },
  { category: 'photography', displayName: 'Photography & Prints', basePercentage: 6, notes: 'Party highlights & instant photo booth prints' },
  { category: 'entertainment', displayName: 'DJ & Activities', basePercentage: 13, notes: 'DJ, sound, party games & entertainer/host' },
  { category: 'return_gifts', displayName: 'Return Gifts & Favors', basePercentage: 7, notes: 'Personalized favors & goodie bags' },
  { category: 'contingency', displayName: 'Contingency Reserve', basePercentage: 10, notes: 'Buffer for overtime or extra guest headcount', isContingency: true },
];

const COMMUNITY_BASELINE: RawCategoryRule[] = [
  { category: 'venue', displayName: 'Venue & Ground Booking', basePercentage: 15, notes: 'Community park, amphitheater or public grounds' },
  { category: 'catering', displayName: 'Community Food & Drinks', basePercentage: 18, notes: 'Wholesome snacks, tea/coffee & hydration stations' },
  { category: 'stage_av', displayName: 'Stage, Sound & AV', basePercentage: 18, notes: 'PA audio system, stage podium, microphones & lights' },
  { category: 'decor', displayName: 'Eco Decor & Canopies', basePercentage: 8, notes: 'Bamboo canopies, directional signage & banners' },
  { category: 'publicity', displayName: 'Publicity & Outreach', basePercentage: 11, notes: 'Flyers, posters, digital campaigns & banners' },
  { category: 'volunteers_logistics', displayName: 'Volunteers & Logistics', basePercentage: 12, notes: 'Badges, first-aid, waste segregation & cleanup' },
  { category: 'permissions', displayName: 'Permits & Security', basePercentage: 8, notes: 'Police, municipal clearances & security wardens' },
  { category: 'contingency', displayName: 'Contingency Reserve', basePercentage: 10, notes: 'Weather protection & emergency reserves', isContingency: true },
];

/**
 * Calculates deterministic budget allocations tailored to event parameters.
 */
export function calculateBudget(input: EventPlanningInput): ComputedBudgetResult {
  const totalBudget = Math.max(1, Math.round(input.totalBudget));
  const guestCount = Math.max(1, input.guestCount);
  const cityTier = getCityCostTier(input.city);
  const isOutdoor = input.venueType === 'outdoor';
  const style = input.style || 'balanced';
  const dietaryNeeds = input.dietaryRequirements || [];

  // 1. Select Baseline
  let baselineRules: RawCategoryRule[];
  if (input.eventType === 'wedding') {
    baselineRules = WEDDING_BASELINE.map((r) => ({ ...r }));
  } else if (input.eventType === 'birthday') {
    baselineRules = BIRTHDAY_BASELINE.map((r) => ({ ...r }));
  } else {
    baselineRules = COMMUNITY_BASELINE.map((r) => ({ ...r }));
  }

  // 2. Adjust Percentages based on inputs
  const weights: Record<string, number> = {};
  for (const rule of baselineRules) {
    weights[rule.category] = rule.basePercentage;
  }

  // Guest Count Adjustment
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
  } else if (input.eventType === 'community_event') {
    if (guestCount > 400) {
      weights['catering'] += 3;
      weights['volunteers_logistics'] += 2;
      weights['decor'] -= 2;
      weights['publicity'] -= 3;
    }
  }

  // City Tier Adjustment
  if (cityTier === 1) {
    // Metro cities have higher venue & food prices
    if (weights['venue']) weights['venue'] += 2;
    if (weights['catering']) weights['catering'] += 2;
    if (weights['food']) weights['food'] += 2;
    if (weights['decor']) weights['decor'] -= 2;
    if (weights['gifts']) weights['gifts'] -= 1;
    if (weights['publicity']) weights['publicity'] -= 1;
  } else if (cityTier === 3) {
    // Regional towns have lower venue/catering cost
    if (weights['venue']) weights['venue'] -= 2;
    if (weights['catering']) weights['catering'] -= 2;
    if (weights['food']) weights['food'] -= 2;
    if (weights['transport']) weights['transport'] += 2;
    if (weights['decor']) weights['decor'] += 2;
  }

  // Indoor vs Outdoor Adjustment
  if (isOutdoor) {
    // Outdoor requires extra weather contingency, generators, and weatherized canopies
    weights['contingency'] = Math.max(weights['contingency'], 12);
    if (weights['decor']) weights['decor'] += 2;
    if (weights['venue']) weights['venue'] -= 2;
  } else if (input.venueType === 'indoor') {
    // Indoor premium hall rent
    if (weights['venue']) weights['venue'] += 1;
    if (weights['decor']) weights['decor'] -= 1;
  }

  // Style Adjustment (budget, balanced, premium)
  if (style === 'budget') {
    // Protect core necessities (food, venue, contingency), trim luxury categories
    if (weights['photography']) weights['photography'] -= 2;
    if (weights['decor']) weights['decor'] -= 2;
    if (weights['entertainment']) weights['entertainment'] -= 2;
    if (weights['attire']) weights['attire'] -= 2;
    if (weights['gifts']) weights['gifts'] -= 1;
    if (weights['catering']) weights['catering'] += 4;
    if (weights['food']) weights['food'] += 4;
  } else if (style === 'premium') {
    // Elevated visual and guest experience
    if (weights['decor']) weights['decor'] += 3;
    if (weights['photography']) weights['photography'] += 2;
    if (weights['attire']) weights['attire'] += 2;
    if (weights['entertainment']) weights['entertainment'] += 1;
    if (weights['venue']) weights['venue'] -= 2;
    if (weights['catering']) weights['catering'] -= 3;
    if (weights['food']) weights['food'] -= 3;
  }

  // Dietary Requirements Adjustment
  if (dietaryNeeds.length > 0) {
    // Extra preparation, segregation, or specialty ingredients
    const foodKey = weights['catering'] ? 'catering' : 'food';
    if (weights[foodKey]) {
      weights[foodKey] += 2;
      if (weights['decor']) weights['decor'] -= 1;
      if (weights['invitations']) weights['invitations'] -= 1;
    }
  }

  // Enforce Contingency Constraint: AT LEAST 10%
  weights['contingency'] = Math.max(10, weights['contingency'] || 10);

  // Normalize weights so non-contingency categories scale appropriately
  const nonContingencyCategories = baselineRules.filter((r) => !r.isContingency);
  const contingencyWeight = weights['contingency'];
  const targetNonContingencySum = 100 - contingencyWeight;

  const currentNonContingencySum = nonContingencyCategories.reduce(
    (acc, r) => acc + Math.max(1, weights[r.category] || 1),
    0
  );

  const finalPercentages: number[] = [];
  for (const rule of baselineRules) {
    if (rule.isContingency) {
      finalPercentages.push(contingencyWeight);
    } else {
      const scaledPct =
        (Math.max(1, weights[rule.category] || 1) / currentNonContingencySum) *
        targetNonContingencySum;
      finalPercentages.push(scaledPct);
    }
  }

  // 3. Allocate exact integer amounts using Largest Remainder (Hamilton-Hare) Method
  let integerAmounts = roundToLargestRemainder(finalPercentages, totalBudget);

  // Guarantee every category is a POSITIVE INTEGER (at least 1)
  const zeroCount = integerAmounts.filter((amt) => amt <= 0).length;
  if (zeroCount > 0 && totalBudget >= integerAmounts.length) {
    // Borrow from highest allocations to guarantee at least 1 unit in every category
    integerAmounts = integerAmounts.map((amt) => Math.max(1, amt));
    let excess = integerAmounts.reduce((a, b) => a + b, 0) - totalBudget;
    while (excess > 0) {
      let maxIdx = 0;
      for (let i = 1; i < integerAmounts.length; i++) {
        if (integerAmounts[i] > integerAmounts[maxIdx]) {
          maxIdx = i;
        }
      }
      if (integerAmounts[maxIdx] > 1) {
        integerAmounts[maxIdx] -= 1;
        excess -= 1;
      } else {
        break;
      }
    }
  }

  // Build Output Allocations
  const allocations: BudgetCategoryAllocation[] = baselineRules.map((rule, idx) => ({
    category: rule.category,
    displayName: rule.displayName,
    percentage: Math.round((integerAmounts[idx] / totalBudget) * 1000) / 10,
    amount: integerAmounts[idx],
    notes: rule.notes,
    isContingency: Boolean(rule.isContingency),
  }));

  // Contingency Check
  const contingencyCategory = allocations.find((a) => a.isContingency) || allocations[allocations.length - 1];
  const contingencyAmount = contingencyCategory.amount;
  const contingencyPercentage = Math.round((contingencyAmount / totalBudget) * 100);

  // Catering Per Guest
  const foodAlloc = allocations.find((a) => a.category === 'catering' || a.category === 'food');
  const foodAmount = foodAlloc ? foodAlloc.amount : 0;
  const cateringPerGuest = Math.floor(foodAmount / guestCount);

  // Catering Feasibility Evaluation
  const minRecommendedPerGuest =
    MIN_CATERING_PER_GUEST[input.eventType]?.[cityTier] || 400;
  const isCateringFeasible = cateringPerGuest >= minRecommendedPerGuest;

  let cateringWarning: string | undefined;
  if (!isCateringFeasible) {
    cateringWarning = `Catering allocation is ${formatINR(cateringPerGuest)}/guest, which is below the recommended minimum of ${formatINR(minRecommendedPerGuest)}/guest for a ${input.eventType.replace('_', ' ')} in a Tier ${cityTier} city.`;
  }

  // Overall Budget Health Score
  const costPerGuestTotal = totalBudget / guestCount;
  let score: BudgetHealthResult['score'] = 'healthy';
  let description = 'Budget allocations are well-balanced and include a healthy contingency reserve.';

  // Absolute minimum total budget per guest guidelines
  const minTotalPerGuest =
    input.eventType === 'wedding' ? 1200 : input.eventType === 'birthday' ? 600 : 250;

  if (costPerGuestTotal < minTotalPerGuest || cateringPerGuest < minRecommendedPerGuest * 0.75) {
    score = 'over_budget';
    description = `Total budget (${formatINR(totalBudget)}) is significantly strained for ${guestCount} guests (${formatINR(Math.round(costPerGuestTotal))}/guest). Essential catering or venue will face major shortages.`;
  } else if (!isCateringFeasible || costPerGuestTotal < minTotalPerGuest * 1.3) {
    score = 'tight';
    description = `Budget is achievable but tight (${formatINR(Math.round(costPerGuestTotal))}/guest). Minimal room for decor or entertainment upgrades.`;
  }

  const health: BudgetHealthResult = {
    score,
    description,
    variance: 0,
    contingencyPercentage,
    contingencyAmount,
  };

  const cateringFeasibility: CateringFeasibility = {
    isFeasible: isCateringFeasible,
    minRecommendedPerGuest,
    actualPerGuest: cateringPerGuest,
    warning: cateringWarning,
  };

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
