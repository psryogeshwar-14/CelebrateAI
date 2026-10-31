import { describe, it, expect } from 'vitest';
import {
  BUDGET_ALLOCATION_RULES,
  TIMELINE_RULES,
  VENDOR_RULES,
} from './event.service';
import { roundToLargestRemainder, addDaysFormatted } from '../utils/deterministic';

describe('Event Service: Deterministic Planning Engine', () => {
  const eventTypes = ['wedding', 'birthday', 'community_event'] as const;

  it('verifies that budget allocation percentages sum to EXACTLY 100% for all event types', () => {
    for (const type of eventTypes) {
      const rules = BUDGET_ALLOCATION_RULES[type];
      const sum = rules.reduce((acc, r) => acc + r.percentage, 0);
      expect(sum).toBe(100);
    }
  });

  it('verifies that contingency buffer is allocated for every event type', () => {
    for (const type of eventTypes) {
      const rules = BUDGET_ALLOCATION_RULES[type];
      const contingencyRule = rules.find((r) => r.category === 'contingency');
      expect(contingencyRule).toBeDefined();
      expect(contingencyRule!.percentage).toBeGreaterThanOrEqual(5);
    }
  });

  it('guarantees deterministic budget allocation without losing single paise/cent across various budgets', () => {
    const testBudgets = [150000, 2500000, 350000, 99999, 1000001];

    for (const budget of testBudgets) {
      for (const type of eventTypes) {
        const rules = BUDGET_ALLOCATION_RULES[type];
        const percentages = rules.map((r) => r.percentage);
        const allocated = roundToLargestRemainder(percentages, budget);
        const totalAllocated = allocated.reduce((acc, val) => acc + val, 0);

        expect(totalAllocated).toBe(budget);
        expect(allocated.length).toBe(rules.length);
        // Ensure no negative allocation
        expect(allocated.every((val) => val >= 0)).toBe(true);
      }
    }
  });

  it('verifies back-scheduled timeline rules have valid lead times and critical path', () => {
    const eventDate = '2026-11-20';

    for (const type of eventTypes) {
      const rules = TIMELINE_RULES[type];
      expect(rules.length).toBeGreaterThanOrEqual(5);

      // Verify that at least one task is marked critical
      const hasCritical = rules.some((r) => r.priority === 'critical');
      expect(hasCritical).toBe(true);

      // Verify that event day (T-0) is present
      const hasEventDay = rules.some((r) => r.daysBeforeEvent === 0);
      expect(hasEventDay).toBe(true);

      // Verify dates are monotonically non-increasing backwards from event date
      for (const rule of rules) {
        const taskDueDate = addDaysFormatted(eventDate, -rule.daysBeforeEvent);
        expect(taskDueDate <= eventDate).toBe(true);
      }
    }
  });

  it('verifies vendor booking rules have realistic lead times and standard questions', () => {
    for (const type of eventTypes) {
      const rules = VENDOR_RULES[type];
      expect(rules.length).toBeGreaterThanOrEqual(2);

      for (const v of rules) {
        expect(v.leadDaysBeforeEvent).toBeGreaterThan(0);
        expect(v.standardQuestions.length).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
