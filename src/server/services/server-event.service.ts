import { assembleFullEventAggregate } from './aggregate-assembler';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database.types';
import {
  EventRepository,
  BudgetRepository,
  TimelineRepository,
  VendorRepository,
  IdeaRepository,
} from '@/server/repositories';
import type { CreateEventInput } from '@/lib/validations/schemas';
import { createEventSchema } from '@/lib/validations/schemas';
import {
  roundToLargestRemainder,
  addDaysFormatted,
} from '@/lib/utils/deterministic';
import type { FullEventAggregate } from '@/lib/types/models';

import type {
  CategoryAllocationRule,
  TimelineRule,
  VendorRule} from './server-rules';
import {
  BUDGET_ALLOCATION_RULES,
  TIMELINE_RULES,
  VENDOR_RULES,
} from './server-rules';

export {
  BUDGET_ALLOCATION_RULES,
  TIMELINE_RULES,
  VENDOR_RULES,
};
export type {
  CategoryAllocationRule,
  TimelineRule,
  VendorRule,
};

export class ServerEventService {
  private eventRepo: EventRepository;
  private budgetRepo: BudgetRepository;
  private timelineRepo: TimelineRepository;
  private vendorRepo: VendorRepository;
  private ideaRepo: IdeaRepository;

  constructor(private supabase: SupabaseClient<Database>) {
    this.eventRepo = new EventRepository(supabase);
    this.budgetRepo = new BudgetRepository(supabase);
    this.timelineRepo = new TimelineRepository(supabase);
    this.vendorRepo = new VendorRepository(supabase);
    this.ideaRepo = new IdeaRepository(supabase);
  }

  /**
   * Creates a complete event with deterministic planning allocations:
   * - Budget items with Hamilton-Hare exact allocation
   * - Back-scheduled timeline tasks
   * - Category-specific vendor checklist
   */
  async createEventWithDeterministicPlan(
    input: CreateEventInput,
    userId: string | null = null
  ): Promise<FullEventAggregate> {
    const validated = createEventSchema.parse(input);

    // 1. Create root event
    const eventRow = await this.eventRepo.create({
      user_id: userId,
      event_type: validated.eventType,
      title: validated.title,
      city: validated.city,
      event_date: validated.eventDate,
      guest_count: validated.guestCount,
      total_budget: validated.totalBudget,
      currency: validated.currency,
      style: validated.style,
      dietary_needs: validated.dietaryNeeds,
      accessibility_needs: validated.accessibilityNeeds,
      special_requests: validated.specialRequests || null,
      status: validated.status,
      is_demo: validated.isDemo,
    });

    const eventId = eventRow.id;

    // 2. Compute Deterministic Budget Allocations
    const allocationRules = BUDGET_ALLOCATION_RULES[validated.eventType];
    const percentages = allocationRules.map((r) => r.percentage);
    const allocatedAmounts = roundToLargestRemainder(percentages, validated.totalBudget);

    const budgetInserts = allocationRules.map((rule, idx) => ({
      event_id: eventId,
      category: rule.category,
      planned_amount: allocatedAmounts[idx],
      actual_amount: 0,
      notes: rule.defaultNote,
    }));

    const budgetRows = await this.budgetRepo.createBatch(budgetInserts);

    // 3. Compute Deterministic Back-Scheduled Timeline Tasks
    const timelineRules = TIMELINE_RULES[validated.eventType];
    const taskInserts = timelineRules.map((rule) => ({
      event_id: eventId,
      title: rule.title,
      description: rule.description,
      owner: rule.owner,
      due_date: addDaysFormatted(validated.eventDate, -rule.daysBeforeEvent),
      priority: rule.priority,
      status: 'todo' as const,
      is_ai_generated: false,
    }));

    const taskRows = await this.timelineRepo.createBatch(taskInserts);

    // 4. Compute Deterministic Vendor Checklist
    const vendorRules = VENDOR_RULES[validated.eventType];
    const vendorInserts = vendorRules.map((rule) => ({
      event_id: eventId,
      vendor_type: rule.vendorType,
      name: null,
      contact: null,
      quote_amount: null,
      status: 'shortlisted' as const,
      booking_deadline: addDaysFormatted(validated.eventDate, -rule.leadDaysBeforeEvent),
      questions: rule.standardQuestions,
      notes: null,
    }));

    const vendorRows = await this.vendorRepo.createBatch(vendorInserts);

    return this.assembleFullEventAggregate(eventRow, budgetRows, taskRows, vendorRows, []);
  }

  /**
   * Retrieves full event aggregate by ID
   */
  async getFullEventAggregate(eventId: string): Promise<FullEventAggregate | null> {
    const eventRow = await this.eventRepo.findById(eventId);
    if (!eventRow) return null;

    const [budgetRows, taskRows, vendorRows, ideaRows] = await Promise.all([
      this.budgetRepo.listByEventId(eventId),
      this.timelineRepo.listByEventId(eventId),
      this.vendorRepo.listByEventId(eventId),
      this.ideaRepo.listByEventId(eventId),
    ]);

    return this.assembleFullEventAggregate(eventRow, budgetRows, taskRows, vendorRows, ideaRows);
  }

  private assembleFullEventAggregate(
    eventRow: Database['public']['Tables']['events']['Row'],
    budgetRows: Database['public']['Tables']['budget_items']['Row'][],
    taskRows: Database['public']['Tables']['timeline_tasks']['Row'][],
    vendorRows: Database['public']['Tables']['vendors']['Row'][],
    ideaRows: Database['public']['Tables']['ideas']['Row'][]
  ): FullEventAggregate {
    return assembleFullEventAggregate(eventRow, budgetRows, taskRows, vendorRows, ideaRows);
  }
}

// Re-export with alias for compatibility
export { ServerEventService as EventService };
