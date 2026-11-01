import type {
  EventPlanningInput,
  ComputedBudgetResult,
  VendorRecommendation,
} from './types';
import { addDaysFormatted, daysBetween, formatDateISO } from '../utils/deterministic';
import { getVendorBlueprints } from './vendor-rules';

export {
  WEDDING_VENDORS,
  BIRTHDAY_VENDORS,
  COMMUNITY_VENDORS,
} from './vendor-rules';
export type { VendorBlueprint } from './vendor-rules';

function computeBookingLeadDays(normalLeadDays: number, daysUntil: number): number {
  if (daysUntil < 30) {
    return Math.min(daysUntil, Math.max(1, Math.round((normalLeadDays / 150) * daysUntil)));
  }
  return Math.min(daysUntil, normalLeadDays);
}

function calculateVendorBudget(
  categoryKey: string,
  budgetResult: ComputedBudgetResult
): { min: number; target: number; max: number } {
  const matchedAlloc = budgetResult.allocations.find(
    (a) => a.category === categoryKey || a.category.includes(categoryKey)
  );

  const target = matchedAlloc ? matchedAlloc.amount : Math.round(budgetResult.totalBudget * 0.1);
  const min = Math.max(1, Math.floor(target * 0.85));
  const max = Math.max(min, Math.ceil(target * 1.15));

  return { min, target, max };
}

function buildGoogleMapsUrl(vendorType: string, city: string): string {
  const query = `${vendorType} in ${city}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Generates an event-specific vendor checklist with budget ranges and Google Maps search links.
 */
export function generateVendors(
  input: EventPlanningInput,
  budgetResult: ComputedBudgetResult
): VendorRecommendation[] {
  const city = input.city || 'Bengaluru';
  const eventDate = input.eventDate;
  const todayStr = input.currentDate || formatDateISO(new Date());
  const daysUntil = daysBetween(todayStr, eventDate);

  const blueprints = getVendorBlueprints(input.eventType);

  return blueprints.map((bp) => {
    const daysBeforeEvent = computeBookingLeadDays(bp.normalLeadDays, daysUntil);
    const bookingDeadline = addDaysFormatted(eventDate, -daysBeforeEvent);
    const estimatedBudgetRange = calculateVendorBudget(bp.categoryKey, budgetResult);
    const googleMapsSearchUrl = buildGoogleMapsUrl(bp.vendorType, city);

    return {
      id: bp.id,
      vendorType: bp.vendorType,
      whyNeeded: bp.whyNeeded,
      bookingDeadline,
      daysBeforeEvent,
      keyQuestions: [...bp.keyQuestions],
      estimatedBudgetRange,
      googleMapsSearchUrl,
      isCritical: bp.isCritical,
    };
  });
}
