import { EventPlanningInput, ComputedPlan } from './types';
import { calculateBudget } from './budget';
import { generateTimeline } from './timeline';
import { generateVendors } from './vendors';
import { checkFeasibility } from './feasibility';
import { daysBetween, formatDateISO } from '../utils/deterministic';

/**
 * Pure, deterministic planning orchestrator.
 * Combines budget allocation, timeline back-scheduling, vendor generation,
 * and conflict detection into a unified, mathematically locked Plan object.
 *
 * Guarantees zero network and zero database side effects.
 */
export function computePlan(input: EventPlanningInput): ComputedPlan {
  const todayStr = input.currentDate || formatDateISO(new Date());
  const daysUntilEvent = daysBetween(todayStr, input.eventDate);
  const guestCount = Math.max(1, input.guestCount);

  // 1. Deterministic Budget Allocations
  const budget = calculateBudget(input);

  // 2. Deterministic Back-Scheduled Timeline Milestones
  const timeline = generateTimeline(input);

  // 3. Deterministic Vendor Checklist with Budget Ranges & Maps Links
  const vendors = generateVendors(input, budget);

  // 4. Comprehensive Feasibility Conflict Detection
  const feasibility = checkFeasibility(input, budget, timeline, vendors);

  const costPerGuest = Math.round(budget.totalBudget / guestCount);

  return {
    input,
    budget,
    timeline,
    vendors,
    feasibility,
    summary: {
      guestCount,
      costPerGuest,
      daysUntilEvent,
      milestoneCount: timeline.length,
      vendorCount: vendors.length,
    },
  };
}
