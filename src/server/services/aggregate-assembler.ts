import type { Database } from '@/lib/types/database.types';
import type {
  ThemeIdeaContent,
  MenuIdeaContent,
  RiskIdeaContent,
  RunSheetIdeaContent,
  SavingTipIdeaContent,
} from '@/lib/validations/schemas';
import { calculateBudgetHealth, calculateProgress } from '@/lib/utils/deterministic';
import type { FullEventAggregate, EventModel, BudgetItemModel, TimelineTaskModel, VendorModel } from '@/lib/types/models';

export function assembleFullEventAggregate(
    eventRow: Database['public']['Tables']['events']['Row'],
    budgetRows: Database['public']['Tables']['budget_items']['Row'][],
    taskRows: Database['public']['Tables']['timeline_tasks']['Row'][],
    vendorRows: Database['public']['Tables']['vendors']['Row'][],
    ideaRows: Database['public']['Tables']['ideas']['Row'][]
  ): FullEventAggregate {
    const totalPlanned = budgetRows.reduce((acc, b) => acc + Number(b.planned_amount), 0);
    const totalActual = budgetRows.reduce((acc, b) => acc + Number(b.actual_amount), 0);
    const budgetHealth = calculateBudgetHealth(totalPlanned, totalActual, Number(eventRow.total_budget));

    const progress = calculateProgress(taskRows);

    // Group ideas by kind
    const ideasMap: FullEventAggregate['ideas'] = {};
    for (const idea of ideaRows) {
      if (idea.kind === 'theme') ideasMap.themes = idea.content as unknown as ThemeIdeaContent;
      if (idea.kind === 'menu') ideasMap.menu = idea.content as unknown as MenuIdeaContent;
      if (idea.kind === 'risk') ideasMap.risks = idea.content as unknown as RiskIdeaContent;
      if (idea.kind === 'run_sheet') ideasMap.runSheet = idea.content as unknown as RunSheetIdeaContent;
      if (idea.kind === 'saving_tip') ideasMap.savingTips = idea.content as unknown as SavingTipIdeaContent;
    }

    const eventModel: EventModel = {
      id: eventRow.id,
      userId: eventRow.user_id,
      eventType: eventRow.event_type,
      title: eventRow.title,
      city: eventRow.city,
      eventDate: eventRow.event_date,
      guestCount: eventRow.guest_count,
      totalBudget: Number(eventRow.total_budget),
      currency: eventRow.currency,
      style: eventRow.style,
      dietaryNeeds: eventRow.dietary_needs,
      accessibilityNeeds: eventRow.accessibility_needs,
      specialRequests: eventRow.special_requests,
      status: eventRow.status,
      isDemo: eventRow.is_demo,
      createdAt: eventRow.created_at,
      updatedAt: eventRow.updated_at,
    };

    const budgetModels: BudgetItemModel[] = budgetRows.map((b) => ({
      id: b.id,
      eventId: b.event_id,
      category: b.category,
      plannedAmount: Number(b.planned_amount),
      actualAmount: Number(b.actual_amount),
      notes: b.notes,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
    }));

    const taskModels: TimelineTaskModel[] = taskRows.map((t) => ({
      id: t.id,
      eventId: t.event_id,
      title: t.title,
      description: t.description,
      owner: t.owner,
      dueDate: t.due_date,
      status: t.status,
      priority: t.priority,
      dependencyTaskId: t.dependency_task_id,
      isAiGenerated: t.is_ai_generated,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));

    const vendorModels: VendorModel[] = vendorRows.map((v) => ({
      id: v.id,
      eventId: v.event_id,
      vendorType: v.vendor_type,
      name: v.name,
      contact: v.contact,
      quoteAmount: v.quote_amount ? Number(v.quote_amount) : null,
      status: v.status,
      bookingDeadline: v.booking_deadline,
      questions: v.questions,
      notes: v.notes,
      createdAt: v.created_at,
      updatedAt: v.updated_at,
    }));

    return {
      event: eventModel,
      budgetItems: budgetModels,
      timelineTasks: taskModels,
      vendors: vendorModels,
      ideas: ideasMap,
      budgetHealth,
      progress,
    };
}

