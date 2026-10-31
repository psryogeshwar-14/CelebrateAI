import {
  EventPlanningInput,
  ComputedBudgetResult,
  TimelineMilestone,
  VendorRecommendation,
  FeasibilityConflict,
  FeasibilityReport,
} from './types';
import { daysBetween, formatDateISO, formatINR } from '../utils/deterministic';

/**
 * Pure feasibility engine that evaluates the computed budget, timeline,
 * and vendors to detect scheduling, financial, and logistical conflicts.
 */
export function checkFeasibility(
  input: EventPlanningInput,
  budget: ComputedBudgetResult,
  timeline: TimelineMilestone[],
  vendors: VendorRecommendation[]
): FeasibilityReport {
  const conflicts: FeasibilityConflict[] = [];
  const todayStr = input.currentDate || formatDateISO(new Date());
  const guestCount = Math.max(1, input.guestCount);
  const totalBudget = budget.totalBudget;
  const costPerGuest = totalBudget / guestCount;

  // --------------------------------------------------------------------------
  // 1. Conflict: Budget too low for guest count
  // --------------------------------------------------------------------------
  const minRequiredPerGuest =
    input.eventType === 'wedding' ? 1200 : input.eventType === 'birthday' ? 500 : 200;

  if (costPerGuest < minRequiredPerGuest || !budget.cateringFeasibility.isFeasible) {
    conflicts.push({
      id: 'conflict_budget_too_low',
      type: 'budget_too_low',
      severity: costPerGuest < minRequiredPerGuest * 0.75 ? 'critical' : 'warning',
      title: 'Budget Too Low for Guest Count',
      description: `Total budget provides ${formatINR(Math.round(costPerGuest))}/guest, which is below the safe threshold of ${formatINR(minRequiredPerGuest)}/guest. ${budget.cateringFeasibility.warning || ''}`,
      remediation:
        'Increase total budget, trim the guest list, or shift from a premium style to a streamlined balanced package.',
    });
  }

  // --------------------------------------------------------------------------
  // 2. Conflict: Venue not booked early enough
  // --------------------------------------------------------------------------
  const venueMilestone = timeline.find((m) => m.id === 'm_venue');
  const venueVendor = vendors.find((v) => v.id === 'v_venue');
  const venueDeadline = venueMilestone?.dueDate || venueVendor?.bookingDeadline;
  const daysUntilEvent = daysBetween(todayStr, input.eventDate);

  if (venueDeadline && venueDeadline < todayStr) {
    conflicts.push({
      id: 'conflict_venue_deadline',
      type: 'venue_deadline',
      severity: 'critical',
      title: 'Venue Booking Milestone Overdue',
      description: `The recommended booking deadline for the venue (${venueDeadline}) has already passed with only ${daysUntilEvent} days remaining until the event.`,
      remediation:
        'Prioritize booking the venue immediately. All catering, decor, and invitation timings depend on securing the venue.',
    });
  } else if (daysUntilEvent <= 14) {
    conflicts.push({
      id: 'conflict_venue_deadline',
      type: 'venue_deadline',
      severity: 'critical',
      title: 'Extremely Short Lead Time for Venue',
      description: `With only ${daysUntilEvent} days until the event date, securing a quality venue is in the critical risk zone.`,
      remediation:
        'Contact 3+ pre-vetted venues directly today with flexible layout requests.',
    });
  }

  // --------------------------------------------------------------------------
  // 3. Conflict: Caterer deadline after invitation deadline
  // --------------------------------------------------------------------------
  const catererMilestone = timeline.find((m) => m.id === 'm_caterer');
  const inviteMilestone = timeline.find((m) => m.id === 'm_invites_send');

  if (catererMilestone && inviteMilestone && catererMilestone.dueDate > inviteMilestone.dueDate) {
    conflicts.push({
      id: 'conflict_caterer_invitation_order',
      type: 'caterer_invitation_order',
      severity: 'warning',
      title: 'Caterer Deadline Scheduled After Invitations',
      description: `Caterer booking is scheduled for ${catererMilestone.dueDate}, which is after invitations are sent on ${inviteMilestone.dueDate}. Menus and dietary options cannot be verified.`,
      remediation:
        'Advance the caterer booking deadline to precede or coincide with invitation dispatch.',
    });
  }

  // --------------------------------------------------------------------------
  // 4. Conflict: Too many tasks due on the same day (> 3 tasks)
  // --------------------------------------------------------------------------
  const tasksByDate = new Map<string, number>();
  for (const m of timeline) {
    // Exclude event day (T-0) which naturally aggregates day-of executions
    if (m.daysBeforeEvent > 0) {
      tasksByDate.set(m.dueDate, (tasksByDate.get(m.dueDate) || 0) + 1);
    }
  }

  let congestedDate: string | null = null;
  let maxCountOnDate = 0;
  for (const [date, count] of tasksByDate.entries()) {
    if (count > 3 && count > maxCountOnDate) {
      maxCountOnDate = count;
      congestedDate = date;
    }
  }

  if (congestedDate) {
    conflicts.push({
      id: 'conflict_due_date_congestion',
      type: 'due_date_congestion',
      severity: 'warning',
      title: 'Milestone Congestion Bottleneck',
      description: `${maxCountOnDate} critical milestones are scheduled on the exact same date (${congestedDate}). This risks coordination bottlenecks.`,
      remediation:
        'Stagger these milestones by 1–2 days to distribute host and planner workload evenly.',
    });
  }

  // --------------------------------------------------------------------------
  // 5. Conflict: Missing accessibility arrangements
  // --------------------------------------------------------------------------
  const userNeedsAccessibility =
    (input.accessibilityRequirements && input.accessibilityRequirements.length > 0) ||
    guestCount >= 200;

  const specialText = (input.specialRequests || '').toLowerCase();
  const mentionsAccessibility =
    specialText.includes('wheelchair') ||
    specialText.includes('ramp') ||
    specialText.includes('elderly') ||
    specialText.includes('accessible');

  if (userNeedsAccessibility && !mentionsAccessibility) {
    conflicts.push({
      id: 'conflict_missing_accessibility',
      type: 'missing_accessibility',
      severity: 'warning',
      title: 'Missing Accessibility Provisions',
      description:
        'Event has elderly attendees, accessibility needs, or a large headcount (200+ guests), but venue walkthrough does not explicitly mandate wheelchair ramps and step-free access.',
      remediation:
        'Add wheelchair ramps, golf cart transport, and ground-floor reserved seating to the venue walkthrough checklist.',
    });
  }

  // --------------------------------------------------------------------------
  // 6. Conflict: Outdoor event without weather contingency
  // --------------------------------------------------------------------------
  if (input.venueType === 'outdoor') {
    const hasAdequateContingency = budget.contingencyPercentage >= 12;
    const mentionsWeatherPlan =
      specialText.includes('rain') ||
      specialText.includes('weather') ||
      specialText.includes('canopy') ||
      specialText.includes('hangar');

    if (!hasAdequateContingency && !mentionsWeatherPlan) {
      conflicts.push({
        id: 'conflict_outdoor_weather_risk',
        type: 'outdoor_weather_risk',
        severity: 'warning',
        title: 'Outdoor Event Lacks Weather Contingency',
        description: `This event is designated as outdoor, but the contingency buffer is only ${budget.contingencyPercentage}% (recommended 12%+) with no explicit rain protection plan noted.`,
        remediation:
          'Increase contingency reserve to at least 12% and inspect waterproof clear-span canopy availability with the decorator.',
      });
    }
  }

  // --------------------------------------------------------------------------
  // Overall Score Calculation (0 to 100)
  // --------------------------------------------------------------------------
  let score = 100;
  for (const c of conflicts) {
    if (c.severity === 'critical') {
      score -= 25;
    } else {
      score -= 10;
    }
  }
  score = Math.max(0, Math.min(100, score));

  const hasCriticalConflict = conflicts.some((c) => c.severity === 'critical');
  const isFeasible = score >= 55 && !hasCriticalConflict;

  let summary = 'Plan is structurally sound, timeline is back-scheduled, and budget is mathematically balanced.';
  if (hasCriticalConflict) {
    summary = 'Critical feasibility risks detected: Immediate adjustments to budget or booking deadlines required.';
  } else if (conflicts.length > 0) {
    summary = 'Plan is viable with minor warnings: Review recommendations to optimize schedule and vendor alignment.';
  }

  return {
    isFeasible,
    overallScore: score,
    conflicts,
    summary,
  };
}
