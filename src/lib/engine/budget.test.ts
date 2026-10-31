import { describe, it, expect } from 'vitest';
import { calculateBudget } from './budget';
import { EventPlanningInput } from './types';

describe('Engine: budget.ts', () => {
  const baseWeddingInput: EventPlanningInput = {
    eventType: 'wedding',
    title: "Ananya & Vikram's Wedding",
    city: 'Bengaluru',
    eventDate: '2026-11-20',
    guestCount: 350,
    totalBudget: 2500000,
    currency: 'INR',
    style: 'balanced',
    venueType: 'indoor',
    dietaryRequirements: ['Vegetarian', 'Jain'],
  };

  const baseBirthdayInput: EventPlanningInput = {
    eventType: 'birthday',
    title: "Rohan's 30th Birthday",
    city: 'Bengaluru',
    eventDate: '2026-11-14',
    guestCount: 50,
    totalBudget: 150000,
    currency: 'INR',
    style: 'balanced',
    venueType: 'indoor',
  };

  const baseCommunityInput: EventPlanningInput = {
    eventType: 'community_event',
    title: 'Green Habitat Fair',
    city: 'Bengaluru',
    eventDate: '2026-12-05',
    guestCount: 600,
    totalBudget: 350000,
    currency: 'INR',
    style: 'balanced',
    venueType: 'outdoor',
  };

  it('guarantees that budget allocations always sum EXACTLY to total budget', () => {
    const testBudgets = [50000, 150000, 350000, 2500000, 99997, 1000001, 1234567];

    for (const budget of testBudgets) {
      for (const input of [baseWeddingInput, baseBirthdayInput, baseCommunityInput]) {
        const result = calculateBudget({ ...input, totalBudget: budget });
        const sum = result.allocations.reduce((acc, a) => acc + a.amount, 0);
        expect(sum).toBe(budget);
      }
    }
  });

  it('guarantees that every category allocation is a POSITIVE INTEGER (> 0)', () => {
    for (const input of [baseWeddingInput, baseBirthdayInput, baseCommunityInput]) {
      const result = calculateBudget(input);
      for (const alloc of result.allocations) {
        expect(alloc.amount).toBeGreaterThan(0);
        expect(Number.isInteger(alloc.amount)).toBe(true);
      }
    }
  });

  it('enforces that contingency is ALWAYS at least 10%', () => {
    for (const input of [baseWeddingInput, baseBirthdayInput, baseCommunityInput]) {
      const result = calculateBudget(input);
      expect(result.contingencyPercentage).toBeGreaterThanOrEqual(10);
      expect(result.contingencyAmount).toBeGreaterThanOrEqual(result.totalBudget * 0.1);
    }
  });

  it('boosts contingency for outdoor events to at least 12%', () => {
    const outdoorWedding = calculateBudget({
      ...baseWeddingInput,
      venueType: 'outdoor',
    });
    expect(outdoorWedding.contingencyPercentage).toBeGreaterThanOrEqual(12);
  });

  it('adjusts allocations for city cost tier (Tier 1 vs Tier 3)', () => {
    const tier1Result = calculateBudget({ ...baseWeddingInput, city: 'Bengaluru' });
    const tier3Result = calculateBudget({ ...baseWeddingInput, city: 'Shimoga' });

    const t1Venue = tier1Result.allocations.find((a) => a.category === 'venue')!;
    const t3Venue = tier3Result.allocations.find((a) => a.category === 'venue')!;

    // Tier 1 metro city allocates higher percentage to venue
    expect(t1Venue.percentage).toBeGreaterThan(t3Venue.percentage);
  });

  it('adjusts allocations based on style (budget vs premium)', () => {
    const budgetStyle = calculateBudget({ ...baseWeddingInput, style: 'budget' });
    const premiumStyle = calculateBudget({ ...baseWeddingInput, style: 'premium' });

    const budgetDecor = budgetStyle.allocations.find((a) => a.category === 'decor')!;
    const premiumDecor = premiumStyle.allocations.find((a) => a.category === 'decor')!;

    expect(premiumDecor.percentage).toBeGreaterThan(budgetDecor.percentage);
  });

  it('detects catering feasibility warning if catering allocation is too low', () => {
    // ₹1,00,000 total budget for 400 wedding guests = ₹250/guest total, well below min catering of ₹750/guest
    const strainedWedding = calculateBudget({
      ...baseWeddingInput,
      guestCount: 400,
      totalBudget: 100000,
    });

    expect(strainedWedding.cateringFeasibility.isFeasible).toBe(false);
    expect(strainedWedding.cateringFeasibility.warning).toBeDefined();
    expect(strainedWedding.health.score).toBe('over_budget');
  });

  it('reports healthy budget score when allocations and catering per guest are ample', () => {
    const healthyWedding = calculateBudget({
      ...baseWeddingInput,
      guestCount: 200,
      totalBudget: 3000000, // ₹15,000/guest
    });

    expect(healthyWedding.cateringFeasibility.isFeasible).toBe(true);
    expect(healthyWedding.health.score).toBe('healthy');
  });
});
