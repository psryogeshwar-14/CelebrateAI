import { BudgetHealthResult, ProgressResult } from '../types/models';

/**
 * Deterministically formats an amount into Indian Rupees (INR)
 * following the Indian Numbering System (e.g. ₹1,50,000).
 */
export function formatINR(amount: number, includeDecimals = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Normalizes a Date or YYYY-MM-DD string into a clean UTC midnight Date.
 */
function normalizeDate(date: Date | string): Date {
  if (typeof date === 'string') {
    const parts = date.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(Date.UTC(year, month, day));
    }
    return new Date(date);
  }
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

/**
 * Converts a Date to an ISO YYYY-MM-DD string safely.
 */
export function formatDateISO(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Deterministically adds (or subtracts) days to a given date.
 */
export function addDays(date: Date | string, days: number): Date {
  const base = normalizeDate(date);
  base.setUTCDate(base.getUTCDate() + days);
  return base;
}

/**
 * Formats a back-scheduled or forward-scheduled date directly to YYYY-MM-DD.
 */
export function addDaysFormatted(date: Date | string, days: number): string {
  return formatDateISO(addDays(date, days));
}

/**
 * Calculates calendar days between two dates (end - start).
 * Positive if end is in the future relative to start.
 */
export function daysBetween(start: Date | string, end: Date | string): number {
  const startDate = normalizeDate(start);
  const endDate = normalizeDate(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Clamps a number between min and max bounds.
 */
export function clamp(value: number, min: number, max: number): number {
  if (isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Largest Remainder Method (Hamilton-Hare method)
 * Allocates exact integer or rounded decimal amounts according to target percentages,
 * ensuring the resulting sum is guaranteed to equal totalBudget exactly without rounding drift.
 *
 * @param percentages Array of percentage numbers (e.g. [30, 25, 20, 15, 10])
 * @param totalBudget Total amount to allocate
 * @returns Array of amounts that sum exactly to totalBudget
 */
export function roundToLargestRemainder(percentages: number[], totalBudget: number): number[] {
  if (!percentages.length || totalBudget <= 0) {
    return percentages.map(() => 0);
  }

  const sumPercentages = percentages.reduce((acc, p) => acc + p, 0);
  if (sumPercentages === 0) {
    return percentages.map(() => 0);
  }

  // Normalize percentages in case they don't sum to exactly 100
  const normalized = percentages.map((p) => p / sumPercentages);

  // Exact quotas
  const quotas = normalized.map((p) => p * totalBudget);

  // Integer portions (floored)
  const integerParts = quotas.map((q) => Math.floor(q));
  const currentSum = integerParts.reduce((acc, val) => acc + val, 0);
  const remainderToDistribute = Math.round(totalBudget - currentSum);

  // Calculate fractional remainders
  const fractionalParts = quotas.map((q, index) => ({
    index,
    remainder: q - Math.floor(q),
  }));

  // Sort descending by fractional remainder
  fractionalParts.sort((a, b) => b.remainder - a.remainder);

  // Distribute the remaining units to items with largest remainders
  const result = [...integerParts];
  for (let i = 0; i < remainderToDistribute; i++) {
    const targetIndex = fractionalParts[i % fractionalParts.length].index;
    result[targetIndex] += 1;
  }

  return result;
}

/**
 * Evaluates budget health metrics deterministically.
 */
export function calculateBudgetHealth(
  planned: number,
  actual: number,
  totalBudget: number
): BudgetHealthResult {
  const safeBudget = Math.max(0, totalBudget);
  const safePlanned = Math.max(0, planned);
  const safeActual = Math.max(0, actual);

  const remainingPlannedBuffer = safeBudget - safePlanned;
  const remainingActualBuffer = safeBudget - safeActual;
  const variance = safePlanned - safeActual;

  const spentPercentage = safeBudget > 0 ? Math.round((safeActual / safeBudget) * 100) : 0;
  const allocatedPercentage = safeBudget > 0 ? Math.round((safePlanned / safeBudget) * 100) : 0;

  let status: 'healthy' | 'caution' | 'critical' = 'healthy';
  let warningMessage: string | null = null;

  if (safeActual > safeBudget) {
    status = 'critical';
    warningMessage = `Actual spend has exceeded total budget by ${formatINR(safeActual - safeBudget)}. Immediate cuts required.`;
  } else if (safePlanned > safeBudget) {
    status = 'caution';
    warningMessage = `Planned allocations exceed total budget by ${formatINR(safePlanned - safeBudget)}. Trim secondary categories.`;
  } else if (safeActual > safePlanned && safePlanned > 0) {
    status = 'caution';
    warningMessage = `Actual expenditures (${formatINR(safeActual)}) exceed planned baseline (${formatINR(safePlanned)}). Watch contingency.`;
  } else if (spentPercentage >= 90) {
    status = 'caution';
    warningMessage = `${spentPercentage}% of total budget is already spent. Reserve remaining for final vendor payments.`;
  }

  return {
    totalBudget: safeBudget,
    totalPlanned: safePlanned,
    totalActual: safeActual,
    remainingPlannedBuffer,
    remainingActualBuffer,
    variance,
    status,
    warningMessage,
    spentPercentage,
    allocatedPercentage,
  };
}

/**
 * Calculates task completion progress deterministically.
 */
export function calculateProgress(tasks: { status: string }[]): ProgressResult {
  const totalTasks = tasks.length;
  if (totalTasks === 0) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      completionPercentage: 0,
      isHealthy: true,
    };
  }

  let completedTasks = 0;
  let inProgressTasks = 0;
  let overdueTasks = 0;

  for (const t of tasks) {
    if (t.status === 'done') {
      completedTasks++;
    } else if (t.status === 'in_progress') {
      inProgressTasks++;
    } else if (t.status === 'overdue') {
      overdueTasks++;
    }
  }

  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);
  const isHealthy = overdueTasks === 0 || overdueTasks / totalTasks <= 0.2;

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks,
    completionPercentage,
    isHealthy,
  };
}
