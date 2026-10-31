import { ComputedPlan, EventPlanningInput, EventType } from '../engine/types';
import { computePlan } from '../engine/planner';
import { ValidatedEnrichmentOutput, getOfflineFallbackEnrichment } from '../ai/validate';
import { BENGALURU_DEMO_EVENTS } from '../data/seeds';
import { VendorOverride } from './celebrate-context.types';

export interface DemoEventState {
  computed: ComputedPlan;
  fallbackAi: ValidatedEnrichmentOutput;
  initialSpends: Record<string, number>;
  completedIds: string[];
  initialVendors: Record<string, VendorOverride>;
}

export function buildDemoEventState(demoType: EventType): DemoEventState {
  const demoBundle =
    BENGALURU_DEMO_EVENTS.find((d) => d.event.event_type === demoType) ||
    BENGALURU_DEMO_EVENTS[0];

  const input: EventPlanningInput = {
    eventType: demoBundle.event.event_type,
    title: demoBundle.event.title,
    city: demoBundle.event.city,
    eventDate: demoBundle.event.event_date,
    guestCount: demoBundle.event.guest_count,
    totalBudget: demoBundle.event.total_budget,
    currency: demoBundle.event.currency,
    style: 'balanced',
    venueType: demoBundle.event.event_type === 'community_event' ? 'outdoor' : 'indoor',
    dietaryRequirements: demoBundle.event.dietary_needs,
    accessibilityRequirements: demoBundle.event.accessibility_needs,
    specialRequests: demoBundle.event.special_requests,
    currentDate: '2026-05-01',
  };

  const computed = computePlan(input);
  const fallbackAi = getOfflineFallbackEnrichment(computed);

  const initialSpends: Record<string, number> = {};
  for (const item of demoBundle.budgetItems) {
    initialSpends[item.category] = item.actual_amount;
  }

  const completedIds = computed.timeline
    .filter((_, idx) => idx < 3)
    .map((t) => t.id);

  const initialVendors: Record<string, VendorOverride> = {};
  for (const v of demoBundle.vendors) {
    const matched = computed.vendors.find((cv) =>
      cv.vendorType.toLowerCase().includes(v.vendor_type.toLowerCase())
    );
    if (matched) {
      initialVendors[matched.id] = {
        status: v.status,
        quoteAmount: v.quote_amount,
        notes: v.notes,
      };
    }
  }

  return {
    computed,
    fallbackAi,
    initialSpends,
    completedIds,
    initialVendors,
  };
}
