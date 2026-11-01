import { z } from 'zod';
import type { ComputedPlan, BudgetCategoryAllocation } from '../engine/types';
import { logger } from '@/shared/lib/logger';
import { addDaysFormatted, clamp } from '../utils/deterministic';
import { sanitizeText } from './sanitize';
import { getOfflineFallbackEnrichment } from './offline-fallbacks';

export { sanitizeText } from './sanitize';
export { getOfflineFallbackEnrichment } from './offline-fallbacks';
// ----------------------------------------------------------------------------
// Raw Gemini Response Zod Schemas (with length caps)
// ----------------------------------------------------------------------------

const rawThemeSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(800),
  palette: z.array(z.string().min(1).max(50)).min(3).max(6),
  decor_ideas: z.array(z.string().min(1).max(300)).min(2).max(8),
  signature_moment: z.string().min(1).max(500),
});

const rawMenuSectionSchema = z.object({
  name: z.string().min(1).max(80),
  items: z.array(z.string().min(1).max(200)).min(1).max(15),
});

const rawMenuSchema = z.object({
  summary: z.string().min(1).max(600),
  sections: z.array(rawMenuSectionSchema).min(1).max(8),
  dietary_notes: z.array(z.string().min(1).max(300)).max(10).default([]),
});

const rawRiskSchema = z.object({
  risk: z.string().min(1).max(300),
  impact: z.string().min(1).max(50),
  mitigation: z.string().min(1).max(500),
});

const rawSavingsTipSchema = z.object({
  category: z.string().min(1).max(80),
  percentage: z.number(),
  advice: z.string().min(1).max(500),
});

const rawPersonalTaskSchema = z.object({
  title: z.string().min(1).max(150),
  reason: z.string().min(1).max(400),
  suggested_offset_days: z.number().int(),
});

const rawRunSheetSchema = z.object({
  time: z.string().min(1).max(50),
  activity: z.string().min(1).max(250),
  owner: z.string().min(1).max(80),
});

export const rawPlanEnrichmentZodSchema = z.object({
  themes: z.array(rawThemeSchema).min(1).max(5),
  menu: rawMenuSchema,
  risks: z.array(rawRiskSchema).min(1).max(8),
  savings_tips: z.array(rawSavingsTipSchema).min(1).max(10),
  personal_tasks: z.array(rawPersonalTaskSchema).min(1).max(6),
  run_sheet: z.array(rawRunSheetSchema).min(3).max(20),
});

export type RawPlanEnrichment = z.infer<typeof rawPlanEnrichmentZodSchema>;

// ----------------------------------------------------------------------------
// Validated & Enriched Output Types
// ----------------------------------------------------------------------------

export interface ValidatedSavingsTip {
  category: string;
  categoryDisplayName: string;
  percentage: number; // Clamped to 0-30%
  calculatedSavingsAmount: number; // Calculated on server
  advice: string;
}

export interface ValidatedPersonalTask {
  id: string;
  title: string;
  reason: string;
  suggestedOffsetDays: number;
  calculatedDueDate: string; // YYYY-MM-DD
  isOverdue: boolean;
}

export interface ValidatedEnrichmentOutput {
  isAIOffline: boolean;
  aiStatus: string;
  generatedAt: string;
  themes: Array<{
    name: string;
    description: string;
    palette: string[];
    decorIdeas: string[];
    signatureMoment: string;
  }>;
  menu: {
    summary: string;
    sections: Array<{ name: string; items: string[] }>;
    dietaryNotes: string[];
  };
  risks: Array<{
    risk: string;
    impact: string;
    mitigation: string;
  }>;
  savingsTips: ValidatedSavingsTip[];
  personalTasks: ValidatedPersonalTask[];
  runSheet: Array<{
    time: string;
    activity: string;
    owner: string;
  }>;
}

/**
 * Validates, sanitizes, and deterministically transforms raw Gemini output.
 * - Rejects unknown categories
 * - Clamps percentage to 0–30%
 * - Server calculates savings amounts based on actual budget lines
 * - Converts suggested_offset_days into calendar dates
 */
function findMatchingCategory(
  rawCat: string,
  validCategoriesMap: Map<string, BudgetCategoryAllocation>
): BudgetCategoryAllocation | undefined {
  const directMatch = validCategoriesMap.get(rawCat);
  if (directMatch) return directMatch;
  for (const [key, alloc] of Array.from(validCategoriesMap.entries())) {
    if (rawCat.includes(key) || key.includes(rawCat)) {
      return alloc;
    }
  }
  return undefined;
}

export function validateAndMergeEnrichment(
  rawJson: unknown,
  plan: ComputedPlan
): ValidatedEnrichmentOutput {
  const validation = rawPlanEnrichmentZodSchema.safeParse(rawJson);
  if (!validation.success) {
    logger.warn('Malformed Gemini response rejected. Falling back to offline templates.', undefined, 'ai-validate');
    return getOfflineFallbackEnrichment(plan);
  }
  const parsed = validation.data;
  const eventDate = plan.input.eventDate;
  const todayStr = plan.input.currentDate || new Date().toISOString().split('T')[0];

  // Map of valid category keys to their allocations
  const validCategoriesMap = new Map(
    plan.budget.allocations.map((a) => [a.category.toLowerCase(), a])
  );

  // 1. Process Themes
  const themes = parsed.themes.map((t) => ({
    name: sanitizeText(t.name),
    description: sanitizeText(t.description),
    palette: t.palette.map((p) => sanitizeText(p)),
    decorIdeas: t.decor_ideas.map((d) => sanitizeText(d)),
    signatureMoment: sanitizeText(t.signature_moment),
  }));

  // 2. Process Menu
  const menu = {
    summary: sanitizeText(parsed.menu.summary),
    sections: parsed.menu.sections.map((s) => ({
      name: sanitizeText(s.name),
      items: s.items.map((i) => sanitizeText(i)),
    })),
    dietaryNotes: parsed.menu.dietary_notes.map((n) => sanitizeText(n)),
  };

  // 3. Process Risks
  const risks = parsed.risks.map((r) => ({
    risk: sanitizeText(r.risk),
    impact: sanitizeText(r.impact),
    mitigation: sanitizeText(r.mitigation),
  }));

  // 4. Process Savings Tips (Reject unknown categories, clamp 0-30%, compute amount)
  const savingsTips: ValidatedSavingsTip[] = [];
  for (const tip of parsed.savings_tips) {
    const rawCat = tip.category.trim().toLowerCase();
    const matchedAlloc = findMatchingCategory(rawCat, validCategoriesMap);

    // Reject unknown category
    if (!matchedAlloc) continue;

    // Clamp percentage strictly between 0 and 30%
    const clampedPercentage = Math.round(clamp(tip.percentage, 0, 30));

    // Server calculates savings amount from deterministic budget line
    const calculatedSavingsAmount = Math.round(
      matchedAlloc.amount * (clampedPercentage / 100)
    );

    savingsTips.push({
      category: matchedAlloc.category,
      categoryDisplayName: matchedAlloc.displayName,
      percentage: clampedPercentage,
      calculatedSavingsAmount,
      advice: sanitizeText(tip.advice),
    });
  }

  // 5. Process Personal Tasks (Calculate real due dates)
  const personalTasks: ValidatedPersonalTask[] = parsed.personal_tasks.map((pt, idx) => {
    const offset = Math.max(0, pt.suggested_offset_days);
    const calculatedDueDate = addDaysFormatted(eventDate, -offset);
    const isOverdue = calculatedDueDate < todayStr;

    return {
      id: `ai_task_${idx + 1}`,
      title: sanitizeText(pt.title),
      reason: sanitizeText(pt.reason),
      suggestedOffsetDays: offset,
      calculatedDueDate,
      isOverdue,
    };
  });

  // 6. Process Run Sheet
  const runSheet = parsed.run_sheet.map((rs) => ({
    time: sanitizeText(rs.time),
    activity: sanitizeText(rs.activity),
    owner: sanitizeText(rs.owner),
  }));

  return {
    isAIOffline: false,
    aiStatus: 'AI online (Generated by Gemini 3.8 Flash)',
    generatedAt: new Date().toISOString(),
    themes,
    menu,
    risks,
    savingsTips,
    personalTasks,
    runSheet,
  };
}

// ----------------------------------------------------------------------------
