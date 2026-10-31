import { describe, it, expect } from 'vitest';
import { computePlan } from './planner';
import { EventPlanningInput } from './types';

describe('Engine: planner.ts (Deterministic Planning Orchestrator)', () => {
  const weddingInput: EventPlanningInput = {
    eventType: 'wedding',
    title: "Ananya & Vikram's Heritage Wedding",
    city: 'Bengaluru',
    eventDate: '2026-11-20',
    currentDate: '2026-05-01',
    guestCount: 350,
    totalBudget: 2500000,
    currency: 'INR',
    style: 'premium',
    venueType: 'indoor',
    dietaryRequirements: ['Pure Vegetarian', 'Jain'],
    accessibilityRequirements: ['Wheelchair accessible'],
    specialRequests: 'Include ramps and golf cart for elderly guests.',
  };

  const birthdayInput: EventPlanningInput = {
    eventType: 'birthday',
    title: "Rohan's 30th Rooftop Bash",
    city: 'Bengaluru',
    eventDate: '2026-11-14',
    currentDate: '2026-09-01',
    guestCount: 50,
    totalBudget: 150000,
    currency: 'INR',
    style: 'balanced',
    venueType: 'indoor',
  };

  const communityInput: EventPlanningInput = {
    eventType: 'community_event',
    title: 'HSR Layout Sustainability Fair',
    city: 'Bengaluru',
    eventDate: '2026-12-05',
    currentDate: '2026-08-01',
    guestCount: 600,
    totalBudget: 350000,
    currency: 'INR',
    style: 'budget',
    venueType: 'outdoor',
  };

  it('orchestrates complete plan for wedding with zero side effects', () => {
    const plan = computePlan(weddingInput);

    expect(plan.input.title).toBe(weddingInput.title);
    expect(plan.budget.totalBudget).toBe(weddingInput.totalBudget);
    expect(plan.budget.allocations.reduce((a, b) => a + b.amount, 0)).toBe(weddingInput.totalBudget);
    expect(plan.timeline.length).toBeGreaterThanOrEqual(15);
    expect(plan.vendors.length).toBeGreaterThanOrEqual(5);
    expect(plan.feasibility.isFeasible).toBe(true);
    expect(plan.summary.costPerGuest).toBe(Math.round(2500000 / 350));
  });

  it('orchestrates complete plan for birthday', () => {
    const plan = computePlan(birthdayInput);

    expect(plan.budget.totalBudget).toBe(birthdayInput.totalBudget);
    expect(plan.budget.allocations.reduce((a, b) => a + b.amount, 0)).toBe(birthdayInput.totalBudget);
    expect(plan.timeline.length).toBeGreaterThanOrEqual(15);
    expect(plan.vendors.some((v) => v.vendorType.includes('Cake'))).toBe(true);
  });

  it('orchestrates complete plan for community event', () => {
    const plan = computePlan(communityInput);

    expect(plan.budget.totalBudget).toBe(communityInput.totalBudget);
    expect(plan.budget.allocations.reduce((a, b) => a + b.amount, 0)).toBe(communityInput.totalBudget);
    expect(plan.vendors.some((v) => v.vendorType.includes('Sound') || v.vendorType.includes('Canopies'))).toBe(true);
  });

  it('is completely pure and deterministic: same input always produces identical plan', () => {
    const plan1 = computePlan(weddingInput);
    const plan2 = computePlan(weddingInput);

    expect(JSON.stringify(plan1)).toBe(JSON.stringify(plan2));
  });

  it('runs synchronously with zero network or database dependencies', () => {
    const start = performance.now();
    for (let i = 0; i < 20; i++) {
      computePlan(weddingInput);
    }
    const elapsed = performance.now() - start;
    // 20 full plan computations should execute in well under 100ms
    expect(elapsed).toBeLessThan(100);
  });
});
