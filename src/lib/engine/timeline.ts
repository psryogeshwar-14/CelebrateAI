import {
  EventPlanningInput,
  TimelineMilestone,
  TaskOwner,
  TaskPriority,
} from './types';
import { addDaysFormatted, daysBetween, formatDateISO } from '../utils/deterministic';

interface BaseMilestoneDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  normalDaysBeforeEvent: number;
  owner: TaskOwner;
  dependencies: string[];
  priority: TaskPriority;
}

const BASE_MILESTONES: BaseMilestoneDefinition[] = [
  {
    id: 'm_date_guests',
    title: 'Confirm Event Date & Preliminary Guest List',
    description: 'Lock in guest headcount estimates and align on VIP attendees.',
    category: 'planning',
    normalDaysBeforeEvent: 180,
    owner: 'host',
    dependencies: [],
    priority: 'high',
  },
  {
    id: 'm_budget',
    title: 'Finalize Total Budget & Category Allocations',
    description: 'Set spending limits for venue, catering, decor, and reserve 10%+ contingency.',
    category: 'budget',
    normalDaysBeforeEvent: 165,
    owner: 'host',
    dependencies: ['m_date_guests'],
    priority: 'critical',
  },
  {
    id: 'm_venue',
    title: 'Shortlist and Book Venue',
    description: 'Inspect capacity, acoustics, power backup, and lock in the rental agreement.',
    category: 'venue',
    normalDaysBeforeEvent: 150,
    owner: 'host',
    dependencies: ['m_budget'],
    priority: 'critical',
  },
  {
    id: 'm_caterer',
    title: 'Book Primary Caterer & Food Service',
    description: 'Schedule tastings, verify dietary capability, and lock service staff ratio.',
    category: 'catering',
    normalDaysBeforeEvent: 120,
    owner: 'host',
    dependencies: ['m_venue'],
    priority: 'high',
  },
  {
    id: 'm_photo',
    title: 'Book Photographer & Videographer',
    description: 'Secure cinematic video leads, candid photographers, and drone permissions.',
    category: 'photography',
    normalDaysBeforeEvent: 105,
    owner: 'host',
    dependencies: ['m_venue'],
    priority: 'high',
  },
  {
    id: 'm_decor',
    title: 'Book Decorator & Approve Theme Concept',
    description: 'Review 3D mockups of stage, entrance, lighting palette, and floral arrangements.',
    category: 'decor',
    normalDaysBeforeEvent: 90,
    owner: 'planner',
    dependencies: ['m_venue'],
    priority: 'medium',
  },
  {
    id: 'm_entertainment',
    title: 'Plan Entertainment, DJ & Emcee',
    description: 'Hire sound systems, curate custom playlists, and brief the master of ceremonies.',
    category: 'entertainment',
    normalDaysBeforeEvent: 75,
    owner: 'host',
    dependencies: [],
    priority: 'medium',
  },
  {
    id: 'm_invites_design',
    title: 'Design and Finalize Invitations',
    description: 'Draft digital motion invites and print formal invitation cards.',
    category: 'invitations',
    normalDaysBeforeEvent: 65,
    owner: 'host',
    dependencies: ['m_venue'],
    priority: 'medium',
  },
  {
    id: 'm_invites_send',
    title: 'Send Invitations & Launch RSVP Tracking',
    description: 'Distribute WhatsApp/print invites and record guest dietary preferences.',
    category: 'invitations',
    normalDaysBeforeEvent: 55,
    owner: 'host',
    dependencies: ['m_invites_design', 'm_caterer'],
    priority: 'high',
  },
  {
    id: 'm_menu_dietary',
    title: 'Confirm Menu & Dietary Requirements',
    description: 'Finalize course items, Jain/vegan segregations, and signature welcome drinks.',
    category: 'catering',
    normalDaysBeforeEvent: 40,
    owner: 'vendor',
    dependencies: ['m_caterer', 'm_invites_send'],
    priority: 'high',
  },
  {
    id: 'm_transport',
    title: 'Arrange Guest Transport & Valet Parking',
    description: 'Organize airport pick-up minibuses, valet tickets, and traffic marshals.',
    category: 'logistics',
    normalDaysBeforeEvent: 30,
    owner: 'family',
    dependencies: ['m_venue'],
    priority: 'medium',
  },
  {
    id: 'm_attire_favors',
    title: 'Finalize Attire Trials & Procure Return Gifts',
    description: 'Complete outfit fittings and assemble customized guest favor boxes.',
    category: 'attire_gifts',
    normalDaysBeforeEvent: 21,
    owner: 'family',
    dependencies: [],
    priority: 'medium',
  },
  {
    id: 'm_rsvps_final',
    title: 'Lock Final RSVP Headcounts with Venue & Caterer',
    description: 'Provide final table seating plan and exact dining quantities.',
    category: 'planning',
    normalDaysBeforeEvent: 14,
    owner: 'host',
    dependencies: ['m_invites_send'],
    priority: 'high',
  },
  {
    id: 'm_walkthrough',
    title: 'Venue & Vendor Alignment Walkthrough',
    description: 'On-site coordination to test power loads, entrance flow, and stage placement.',
    category: 'venue',
    normalDaysBeforeEvent: 10,
    owner: 'planner',
    dependencies: ['m_venue', 'm_decor'],
    priority: 'high',
  },
  {
    id: 'm_runsheet',
    title: 'Finalize Day-of Run Sheet & Contact Sheet',
    description: 'Distribute minute-by-minute itinerary with vendor phone numbers to all leads.',
    category: 'planning',
    normalDaysBeforeEvent: 7,
    owner: 'planner',
    dependencies: ['m_walkthrough'],
    priority: 'high',
  },
  {
    id: 'm_reconfirm_vendors',
    title: 'Reconfirm Vendor Arrival & Load-in Times',
    description: 'Call every vendor to verify equipment arrival, parking, and helper passes.',
    category: 'vendors',
    normalDaysBeforeEvent: 4,
    owner: 'planner',
    dependencies: [],
    priority: 'high',
  },
  {
    id: 'm_rehearsal',
    title: 'Rehearsal, Microphones & Soundcheck',
    description: 'Walk through opening ceremony rituals, test wireless microphones and slide AV.',
    category: 'entertainment',
    normalDaysBeforeEvent: 2,
    owner: 'family',
    dependencies: ['m_entertainment'],
    priority: 'medium',
  },
  {
    id: 'm_final_advance_pay',
    title: 'Final Vendor Advance Payments & Cash Envelopes',
    description: 'Prepare balance checks, tip envelopes for staff, and emergency cash reserve.',
    category: 'budget',
    normalDaysBeforeEvent: 2,
    owner: 'host',
    dependencies: ['m_budget'],
    priority: 'high',
  },
  {
    id: 'm_day_setup',
    title: 'Event-Day Setup, Stage Staging & Emergency Kit',
    description: 'Supervise floral delivery, verify AC/generator running, and place emergency kit.',
    category: 'setup',
    normalDaysBeforeEvent: 1,
    owner: 'vendor',
    dependencies: ['m_walkthrough'],
    priority: 'critical',
  },
  {
    id: 'm_event_day',
    title: 'Event Day Execution & Celebration',
    description: 'Coordinate guest arrivals, stage cues, dining service, and celebrate!',
    category: 'execution',
    normalDaysBeforeEvent: 0,
    owner: 'host',
    dependencies: ['m_day_setup'],
    priority: 'critical',
  },
  {
    id: 'm_post_settlement',
    title: 'Post-Event Settlement & Vendor Sign-off',
    description: 'Review venue handover, settle pending vendor tabs, and send thank-you notes.',
    category: 'settlement',
    normalDaysBeforeEvent: 0, // due on event day evening, never after event day
    owner: 'host',
    dependencies: ['m_event_day'],
    priority: 'medium',
  },
];

/**
 * Generates 15–20 back-scheduled milestones from eventDate.
 * If event is less than 30 days away, compresses the timeline proportionally.
 * Overdue tasks are tagged as "Do now".
 */
export function generateTimeline(input: EventPlanningInput): TimelineMilestone[] {
  const eventDate = input.eventDate;
  const todayStr = input.currentDate || formatDateISO(new Date());
  const daysUntil = daysBetween(todayStr, eventDate);

  // Compression factor for short-notice events (< 30 days)
  const isCompressed = daysUntil < 30;
  const availableSpan = Math.max(1, daysUntil);

  return BASE_MILESTONES.map((base) => {
    let daysBefore: number;

    if (base.normalDaysBeforeEvent === 0) {
      daysBefore = 0;
    } else if (isCompressed) {
      // Proportional compression: scale normal 180-day span into available window [0 .. availableSpan]
      const proportional = Math.round((base.normalDaysBeforeEvent / 180) * availableSpan);
      // Guarantee it is clamped between 0 and availableSpan
      daysBefore = Math.min(availableSpan, Math.max(0, proportional));
    } else {
      daysBefore = base.normalDaysBeforeEvent;
    }

    // Realistic due date: back-scheduled from eventDate
    // Never allow a date after eventDate
    const safeDaysBefore = Math.max(0, daysBefore);
    const dueDate = addDaysFormatted(eventDate, -safeDaysBefore);

    // Overdue check
    const isPastDue = dueDate < todayStr;
    const isDueToday = dueDate === todayStr;
    const isDoNow = isPastDue || isDueToday;

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
