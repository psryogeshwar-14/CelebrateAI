import { describe, it, expect } from 'vitest';
import {
  formatINR,
  addDays,
  addDaysFormatted,
  daysBetween,
  clamp,
  roundToLargestRemainder,
  calculateBudgetHealth,
  calculateProgress,
} from './deterministic';

describe('Deterministic Utils: formatINR', () => {
  it('correctly formats Indian Rupee amounts in the Indian numbering system', () => {
    // ₹1,50,000 (1.5 Lakhs)
    const formatted150k = formatINR(150000);
    expect(formatted150k).toContain('1,50,000');
    expect(formatted150k).toContain('₹');

    // ₹25,00,000 (25 Lakhs)
    const formatted25L = formatINR(2500000);
    expect(formatted25L).toContain('25,00,000');

    // Zero
    expect(formatINR(0)).toBe('₹0');
  });

  it('handles negative amounts correctly', () => {
    const formattedNegative = formatINR(-5000);
    expect(formattedNegative).toContain('5,000');
  });

  it('handles decimal amounts when flag is set', () => {
    const formatted = formatINR(12500.5, true);
    expect(formatted).toContain('12,500.50');
  });

  it('gracefully handles NaN and invalid inputs', () => {
    expect(formatINR(NaN)).toBe('₹0');
    expect(formatINR(null as unknown as number)).toBe('₹0');
    expect(formatINR(undefined as unknown as number)).toBe('₹0');
  });
});

describe('Deterministic Utils: addDays & addDaysFormatted', () => {
  it('adds days forward without timezone drift', () => {
    const base = '2026-11-20';
    const nextDay = addDaysFormatted(base, 1);
    expect(nextDay).toBe('2026-11-21');

    const nextWeek = addDaysFormatted(base, 7);
    expect(nextWeek).toBe('2026-11-27');
  });

  it('back-schedules days (negative offsets)', () => {
    const eventDate = '2026-11-20';
    // T-30 days
    expect(addDaysFormatted(eventDate, -30)).toBe('2026-10-21');
    // T-180 days (May 24, 2026)
    expect(addDaysFormatted(eventDate, -180)).toBe('2026-05-24');
  });

  it('handles month and year rollover correctly', () => {
    expect(addDaysFormatted('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDaysFormatted('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('handles leap year accurately', () => {
    // 2024 is a leap year
    expect(addDaysFormatted('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDaysFormatted('2024-02-28', 2)).toBe('2024-03-01');

    // 2025 is not a leap year
    expect(addDaysFormatted('2025-02-28', 1)).toBe('2025-03-01');
  });

  it('returns a Date object from addDays', () => {
    const resultDate = addDays('2026-11-20', 5);
    expect(resultDate).toBeInstanceOf(Date);
    expect(resultDate.getUTCDate()).toBe(25);
    expect(resultDate.getUTCMonth()).toBe(10); // November (0-indexed: 10)
  });
});

describe('Deterministic Utils: daysBetween', () => {
  it('returns 0 for identical dates', () => {
    expect(daysBetween('2026-11-20', '2026-11-20')).toBe(0);
  });

  it('returns exact positive days for future dates', () => {
    expect(daysBetween('2026-10-21', '2026-11-20')).toBe(30);
    expect(daysBetween('2026-05-24', '2026-11-20')).toBe(180);
  });

  it('returns negative days for past dates', () => {
    expect(daysBetween('2026-11-20', '2026-10-21')).toBe(-30);
  });
});

describe('Deterministic Utils: clamp', () => {
  it('clamps values below minimum to minimum', () => {
    expect(clamp(-10, 0, 100)).toBe(0);
    expect(clamp(5, 10, 20)).toBe(10);
  });

  it('clamps values above maximum to maximum', () => {
    expect(clamp(150, 0, 100)).toBe(100);
    expect(clamp(25, 10, 20)).toBe(20);
  });

  it('leaves values within bounds unchanged', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it('returns min when given NaN', () => {
    expect(clamp(NaN, 0, 100)).toBe(0);
  });
});

describe('Deterministic Utils: roundToLargestRemainder (Hamilton-Hare Method)', () => {
  it('guarantees that allocated amounts sum EXACTLY to totalBudget', () => {
    const percentages = [30, 25, 12, 10, 8, 6, 2, 2, 5]; // Sums to 100
    const totalBudget = 2500000;

    const allocated = roundToLargestRemainder(percentages, totalBudget);
    const sum = allocated.reduce((a, b) => a + b, 0);

    expect(sum).toBe(totalBudget);
    expect(allocated[0]).toBe(750000); // 30% of 25L
    expect(allocated[1]).toBe(625000); // 25% of 25L
    expect(allocated[8]).toBe(125000); // 5% contingency
  });

  it('distributes remainder perfectly on uneven odd numbers with zero lost cents/rupees', () => {
    const percentages = [33.333, 33.333, 33.334];
    const oddBudget = 100001; // Uneven odd amount

    const allocated = roundToLargestRemainder(percentages, oddBudget);
    const sum = allocated.reduce((a, b) => a + b, 0);

    expect(sum).toBe(oddBudget);
    // Integer allocations should each be roughly 33333 or 33334
    expect(allocated.every((val) => val >= 33333 && val <= 33335)).toBe(true);
  });

  it('handles small budgets and odd prime numbers', () => {
    const percentages = [20, 20, 20, 15, 10, 5, 10]; // Sums to 100
    const budget = 350007;

    const allocated = roundToLargestRemainder(percentages, budget);
    const sum = allocated.reduce((a, b) => a + b, 0);

    expect(sum).toBe(budget);
  });

  it('returns zeros for empty percentages or 0 budget', () => {
    expect(roundToLargestRemainder([], 50000)).toEqual([]);
    expect(roundToLargestRemainder([50, 50], 0)).toEqual([0, 0]);
  });
});

describe('Deterministic Utils: calculateBudgetHealth', () => {
  it('identifies healthy budgets when actual spend is within boundaries', () => {
    const health = calculateBudgetHealth(2500000, 1800000, 2500000);
    expect(health.status).toBe('healthy');
    expect(health.spentPercentage).toBe(72);
    expect(health.remainingActualBuffer).toBe(700000);
    expect(health.warningMessage).toBeNull();
  });

  it('flags caution when spend reaches or exceeds 90% of total budget', () => {
    const health = calculateBudgetHealth(2500000, 2300000, 2500000);
    expect(health.status).toBe('caution');
    expect(health.spentPercentage).toBe(92);
    expect(health.warningMessage).toContain('92% of total budget is already spent');
  });

  it('flags critical alert when actual expenditures exceed the total budget', () => {
    const health = calculateBudgetHealth(2500000, 2600000, 2500000);
    expect(health.status).toBe('critical');
    expect(health.warningMessage).toContain('Actual spend has exceeded total budget');
  });

  it('flags caution if planned allocations exceed total budget', () => {
    const health = calculateBudgetHealth(2600000, 500000, 2500000);
    expect(health.status).toBe('caution');
    expect(health.warningMessage).toContain('Planned allocations exceed total budget');
  });
});

describe('Deterministic Utils: calculateProgress', () => {
  it('handles empty task lists gracefully', () => {
    const progress = calculateProgress([]);
    expect(progress.totalTasks).toBe(0);
    expect(progress.completionPercentage).toBe(0);
    expect(progress.isHealthy).toBe(true);
  });

  it('computes completion percentage accurately', () => {
    const tasks = [
      { status: 'done' },
      { status: 'done' },
      { status: 'in_progress' },
      { status: 'todo' },
    ];
    const progress = calculateProgress(tasks);
    expect(progress.totalTasks).toBe(4);
    expect(progress.completedTasks).toBe(2);
    expect(progress.completionPercentage).toBe(50);
    expect(progress.isHealthy).toBe(true);
  });

  it('flags unhealthy progress if overdue tasks exceed 20% threshold', () => {
    const tasks = [
      { status: 'done' },
      { status: 'overdue' },
      { status: 'overdue' },
      { status: 'todo' },
    ];
    const progress = calculateProgress(tasks);
    expect(progress.overdueTasks).toBe(2); // 50% overdue
    expect(progress.isHealthy).toBe(false);
  });
});
