import { EventPlanningInput, TimelineMilestone } from './types';
import { addDaysFormatted, daysBetween, formatDateISO } from '../utils/deterministic';
import { BASE_MILESTONES, BaseMilestoneDefinition } from './timeline-rules';

export { BASE_MILESTONES } from './timeline-rules';
export type { BaseMilestoneDefinition } from './timeline-rules';

function computeMilestoneDaysBefore(
  normalDays: number,
  isCompressed: boolean,
  availableSpan: number
): number {
  if (normalDays === 0) return 0;
  if (!isCompressed) return normalDays;
  const proportional = Math.round((normalDays / 180) * availableSpan);
  return Math.min(availableSpan, Math.max(0, proportional));
}

/**
 * Generates 15–20 back-scheduled milestones from eventDate.
 * If event is less than 30 days away, compresses the timeline proportionally.
 * Overdue tasks are tagged as "Do now".
 */
export function generateTimeline(input: EventPlanningInput): TimelineMilestone[] {
  const eventDate = input.eventDate;
  const todayStr = input.currentDate || formatDateISO(new Date());
  const daysUntil = daysBetween(todayStr, eventDate);

  const isCompressed = daysUntil < 30;
  const availableSpan = Math.max(1, daysUntil);

  return BASE_MILESTONES.map((base) => {
    const safeDaysBefore = computeMilestoneDaysBefore(
      base.normalDaysBeforeEvent,
      isCompressed,
      availableSpan
    );
    const dueDate = addDaysFormatted(eventDate, -safeDaysBefore);
    const isPastDue = dueDate < todayStr;
    const isDoNow = isPastDue || dueDate === todayStr;

    return {
      id: base.id,
      title: base.title,
      description: base.description,
      category: base.category,
      dueDate,
      daysBeforeEvent: safeDaysBefore,
      owner: base.owner,
      isOverdue: isPastDue,
      isDoNow,
      dependencies: [...base.dependencies],
      priority: base.priority,
    };
  });
}
