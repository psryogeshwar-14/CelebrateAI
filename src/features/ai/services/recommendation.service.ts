import { getOfflineFallback } from './offline-fallbacks';
import { ComputedPlan } from '@/lib/engine/types';
import {
  ValidatedEnrichmentOutput,
  ValidatedSavingsTip,
  ValidatedPersonalTask,
  ThemeRecommendation,
  MenuRecommendation,
  RiskMitigation,
  RunSheetItem,
  RiskImpactLevel,
} from '../types';
import { rawPlanEnrichmentZodSchema } from '../schemas/recommendation.schema';
import { addDaysFormatted, clamp } from '@/lib/utils/deterministic';
import { logger } from '@/shared/lib/logger';

/**
 * Text sanitization helper preventing XSS and neutralizing injection characters.
 */
export function sanitizeText(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * RecommendationService
 * Validates raw Gemini completions with Zod, rejects semantically invalid values,
 * clamps percentages, verifies budget categories, transforms relative day offsets
 * into exact calendar dates, and enforces immutability of computed budget facts.
 */
export class RecommendationService {
  /**
   * Validates and deterministically merges raw JSON output with the fixed plan.
   */
  public validateAndMerge(rawJson: unknown, plan: ComputedPlan): ValidatedEnrichmentOutput {
    const validation = rawPlanEnrichmentZodSchema.safeParse(rawJson);
    if (!validation.success) {
      logger.warn(
        'Malformed Gemini response rejected by Zod schema. Falling back to offline templates.',
        { issues: validation.error.flatten().fieldErrors },
        'recommendation-service'
      );
      return this.getOfflineFallback(plan);
    }

    const parsed = validation.data;
    const eventDate = plan.input.eventDate;
    const todayStr = plan.input.currentDate || new Date().toISOString().split('T')[0];

    // Map of valid category keys to their allocations
    const validCategoriesMap = new Map(
      plan.budget.allocations.map((a) => [a.category.toLowerCase(), a])
    );

    // 1. Process Themes
    const themes: ThemeRecommendation[] = parsed.themes.map((t) => ({
      name: sanitizeText(t.name).slice(0, 120),
      description: sanitizeText(t.description).slice(0, 800),
      palette: t.palette.slice(0, 4).map((c) => sanitizeText(c).slice(0, 30)),
      decorIdeas: t.decor_ideas.map((d) => sanitizeText(d).slice(0, 300)),
      signatureMoment: sanitizeText(t.signature_moment).slice(0, 500),
    }));

    // 2. Process Menu
    const menu: MenuRecommendation = {
      summary: sanitizeText(parsed.menu.summary).slice(0, 600),
      sections: parsed.menu.sections.map((s) => ({
        name: sanitizeText(s.name).slice(0, 80),
        items: s.items.map((i) => sanitizeText(i).slice(0, 200)),
      })),
      dietaryNotes: parsed.menu.dietary_notes.map((n) => sanitizeText(n).slice(0, 300)),
    };

    // 3. Process Risks
    const risks: RiskMitigation[] = parsed.risks.map((r) => {
      let impact: RiskImpactLevel = 'medium';
      const cleanImpact = r.impact.toLowerCase().trim();
      if (cleanImpact === 'low' || cleanImpact === 'high') {
        impact = cleanImpact;
      }

      return {
        risk: sanitizeText(r.risk).slice(0, 300),
        impact,
        mitigation: sanitizeText(r.mitigation).slice(0, 500),
      };
    });

    // 4. Process Savings Tips with Strict Semantic Validation:
    // - REJECT phantom categories that do not exist in the computed budget
    // - CLAMP percentage to 0–30%
    // - Server computes exact monetary amount from the baseline allocation
    const savingsTips: ValidatedSavingsTip[] = [];
    for (const tip of parsed.savings_tips) {
      const catKey = tip.category.toLowerCase().trim();
      const matchingAlloc = validCategoriesMap.get(catKey);

      // Reject semantically invalid categories
      if (!matchingAlloc || matchingAlloc.isContingency) {
        continue;
      }

      // Clamp percentage to realistic 0-30% bound
      const rawPct = typeof tip.percentage === 'number' && !isNaN(tip.percentage) ? tip.percentage : 10;
      const clampedPct = clamp(Math.round(rawPct), 0, 30);

      // Server calculates exact savings amount based on actual computed allocation
      const calculatedSavingsAmount = Math.round(matchingAlloc.amount * (clampedPct / 100));

      savingsTips.push({
        category: matchingAlloc.category,
        categoryDisplayName: matchingAlloc.displayName,
        percentage: clampedPct,
        calculatedSavingsAmount,
        advice: sanitizeText(tip.advice).slice(0, 500),
      });
    }

    // Fallback if model suggested 0 valid categories
    if (savingsTips.length === 0) {
      const fallbackTips = this.getOfflineFallback(plan).savingsTips;
      savingsTips.push(...fallbackTips.slice(0, 3));
    }

    // 5. Process Personal Tasks:
    // - Rejects invalid offsets
    // - Calculates deterministic calendar due dates from eventDate
    const personalTasks: ValidatedPersonalTask[] = parsed.personal_tasks.map((task, idx) => {
      let offsetDays = task.suggested_offset_days;
      if (isNaN(offsetDays) || offsetDays <= 0 || offsetDays > 365) {
        offsetDays = 14;
      }

      const calculatedDueDate = addDaysFormatted(eventDate, -offsetDays);
      const isOverdue = calculatedDueDate < todayStr;

      return {
        id: `ai_task_${idx + 1}`,
        title: sanitizeText(task.title).slice(0, 150),
        reason: sanitizeText(task.reason).slice(0, 400),
        suggestedOffsetDays: offsetDays,
        calculatedDueDate,
        isOverdue,
      };
    });

    // 6. Process Run Sheet
    const runSheet: RunSheetItem[] = parsed.run_sheet.map((item) => ({
      time: sanitizeText(item.time).slice(0, 50),
      activity: sanitizeText(item.activity).slice(0, 250),
      owner: sanitizeText(item.owner).slice(0, 80),
    }));

    return {
      isAIOffline: false,
      aiStatus: 'AI enrichment generated and mathematically validated',
      generatedAt: new Date().toISOString(),
      themes,
      menu,
      risks,
      savingsTips,
      personalTasks,
      runSheet,
    };
  }

  /**
  /**
   * Deterministic offline templates providing rich recommendations when Gemini is unavailable.
   */
  public getOfflineFallback(plan: ComputedPlan): ValidatedEnrichmentOutput {
    return getOfflineFallback(plan);
  }
}

export const recommendationService = new RecommendationService();
