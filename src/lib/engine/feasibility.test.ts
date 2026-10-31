import { describe, it, expect } from 'vitest';
import { checkFeasibility } from './feasibility';
import { calculateBudget } from './budget';
import { generateTimeline } from './timeline';
import { generateVendors } from './vendors';
import { EventPlanningInput, TimelineMilestone } from './types';

describe('Engine: feasibility.ts', () => {
  const healthyWeddingInput: EventPlanningInput = {
    eventType: 'wedding',
    title: 'Grand Palace Wedding',
    city: 'Bengaluru',
    eventDate: '2026-11-20',
    currentDate: '2026-05-01', // Ample 6+ months lead time
    guestCount: 200,
    totalBudget: 2500000,
    venueType: 'indoor',
    accessibilityRequirements: ['Wheelchair access'],
    specialRequests: 'Include wheelchair ramps for elderly relatives.',
  };

  it('reports high feasibility score and no conflicts for a well-funded, timely event', () => {
    const budget = calculateBudget(healthyWeddingInput);
    const timeline = generateTimeline(healthyWeddingInput);
    const vendors = generateVendors(healthyWeddingInput, budget);

    const report = checkFeasibility(healthyWeddingInput, budget, timeline, vendors);
    expect(report.isFeasible).toBe(true);
    expect(report.overallScore).toBeGreaterThanOrEqual(90);
    expect(report.conflicts.length).toBe(0);
  });

  it('detects Conflict 1: Budget too low for guest count', () => {
    const strainedInput: EventPlanningInput = {
      ...healthyWeddingInput,
      guestCount: 500,
      totalBudget: 150000, // ₹300/guest total for a wedding
    };

    const budget = calculateBudget(strainedInput);
    const timeline = generateTimeline(strainedInput);
    const vendors = generateVendors(strainedInput, budget);

    const report = checkFeasibility(strainedInput, budget, timeline, vendors);
    const conflict = report.conflicts.find((c) => c.type === 'budget_too_low');

    expect(conflict).toBeDefined();
    expect(report.isFeasible).toBe(false);
  });

  it('detects Conflict 2: Venue not booked early enough (overdue deadline)', () => {
    const lateVenueInput: EventPlanningInput = {
      ...healthyWeddingInput,
      eventDate: '2026-11-20',
      currentDate: '2026-09-01', // Venue was due at T-150d (June), now it is September!
    };

    const budget = calculateBudget(lateVenueInput);
    const timeline = generateTimeline(lateVenueInput);
    const vendors = generateVendors(lateVenueInput, budget);

    const report = checkFeasibility(lateVenueInput, budget, timeline, vendors);
    const conflict = report.conflicts.find((c) => c.type === 'venue_deadline');

    expect(conflict).toBeDefined();
    expect(conflict?.severity).toBe('critical');
  });

  it('detects Conflict 3: Caterer deadline after invitation deadline', () => {
    const budget = calculateBudget(healthyWeddingInput);
    const timeline = generateTimeline(healthyWeddingInput);
    const vendors = generateVendors(healthyWeddingInput, budget);

    // Intentionally invert caterer and invite dates to simulate faulty schedule
    const invertedTimeline: TimelineMilestone[] = timeline.map((m) => {
      if (m.id === 'm_caterer') {
        return { ...m, dueDate: '2026-10-15' }; // Later date
      }
      if (m.id === 'm_invites_send') {
        return { ...m, dueDate: '2026-09-01' }; // Earlier date
      }
      return m;
    });

    const report = checkFeasibility(healthyWeddingInput, budget, invertedTimeline, vendors);
    const conflict = report.conflicts.find((c) => c.type === 'caterer_invitation_order');

    expect(conflict).toBeDefined();
    expect(conflict?.severity).toBe('warning');
  });

  it('detects Conflict 4: Too many tasks due on the exact same day', () => {
    const budget = calculateBudget(healthyWeddingInput);
    const timeline = generateTimeline(healthyWeddingInput);
    const vendors = generateVendors(healthyWeddingInput, budget);

    // Force 5 milestones to fall on the same date
    const congestedTimeline: TimelineMilestone[] = timeline.map((m, idx) => {
      if (idx < 5) {
        return { ...m, dueDate: '2026-10-01', daysBeforeEvent: 50 };
      }
      return m;
    });

    const report = checkFeasibility(healthyWeddingInput, budget, congestedTimeline, vendors);
    const conflict = report.conflicts.find((c) => c.type === 'due_date_congestion');

    expect(conflict).toBeDefined();
    expect(conflict?.description).toContain('milestones are scheduled on the exact same date');
  });

  it('detects Conflict 5: Missing accessibility arrangements for elderly/disabled guests', () => {
    const accessibilityInput: EventPlanningInput = {
      ...healthyWeddingInput,
      accessibilityRequirements: ['Wheelchair ramp required for elderly grandmothers'],
      specialRequests: '', // No mention of ramp or wheelchair in text
    };

    const budget = calculateBudget(accessibilityInput);
    const timeline = generateTimeline(accessibilityInput);
    const vendors = generateVendors(accessibilityInput, budget);

    const report = checkFeasibility(accessibilityInput, budget, timeline, vendors);
    const conflict = report.conflicts.find((c) => c.type === 'missing_accessibility');

    expect(conflict).toBeDefined();
  });

  it('detects Conflict 6: Outdoor event without weather contingency', () => {
    const outdoorInput: EventPlanningInput = {
      ...healthyWeddingInput,
      venueType: 'outdoor',
      specialRequests: 'All open sky terrace',
    };

    const budget = calculateBudget(outdoorInput);
    // Artificially reduce contingency to 10% to simulate vulnerability
    const lowContingencyBudget = {
      ...budget,
      contingencyPercentage: 10,
    };

    const timeline = generateTimeline(outdoorInput);
    const vendors = generateVendors(outdoorInput, budget);

    const report = checkFeasibility(outdoorInput, lowContingencyBudget, timeline, vendors);
    const conflict = report.conflicts.find((c) => c.type === 'outdoor_weather_risk');

    expect(conflict).toBeDefined();
  });
});
