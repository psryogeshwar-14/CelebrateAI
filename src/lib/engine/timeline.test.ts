import { describe, it, expect } from 'vitest';
import { generateTimeline } from './timeline';
import { EventPlanningInput } from './types';

describe('Engine: timeline.ts', () => {
  const normalEventInput: EventPlanningInput = {
    eventType: 'wedding',
    title: 'Summer Wedding',
    city: 'Bengaluru',
    eventDate: '2026-11-20',
    currentDate: '2026-05-01', // ~200 days away
    guestCount: 200,
    totalBudget: 1500000,
  };

  it('generates between 15 and 22 milestones scheduled backwards from event_date', () => {
    const timeline = generateTimeline(normalEventInput);
    expect(timeline.length).toBeGreaterThanOrEqual(15);
    expect(timeline.length).toBeLessThanOrEqual(22);
  });

  it('guarantees that all due dates are on or before the event date (never after event day)', () => {
    const timeline = generateTimeline(normalEventInput);
    for (const milestone of timeline) {
      expect(milestone.dueDate <= normalEventInput.eventDate).toBe(true);
      expect(milestone.daysBeforeEvent).toBeGreaterThanOrEqual(0);
    }
  });

  it('includes proper milestone dependencies and owners', () => {
    const timeline = generateTimeline(normalEventInput);
    const validOwners = new Set(['host', 'family', 'vendor', 'planner']);

    for (const milestone of timeline) {
      expect(validOwners.has(milestone.owner)).toBe(true);
    }

    // Verify critical dependencies exist
    const venue = timeline.find((m) => m.id === 'm_venue')!;
    const caterer = timeline.find((m) => m.id === 'm_caterer')!;
    expect(caterer.dependencies).toContain(venue.id);
  });

  it('correctly compresses timeline proportionally when event is less than 30 days away', () => {
    const shortNoticeInput: EventPlanningInput = {
      ...normalEventInput,
      eventDate: '2026-11-20',
      currentDate: '2026-11-10', // Only 10 days away!
    };

    const timeline = generateTimeline(shortNoticeInput);

    // All milestones must have daysBeforeEvent between 0 and 10
    for (const milestone of timeline) {
      expect(milestone.daysBeforeEvent).toBeLessThanOrEqual(10);
      expect(milestone.daysBeforeEvent).toBeGreaterThanOrEqual(0);
      expect(milestone.dueDate <= shortNoticeInput.eventDate).toBe(true);
      expect(milestone.dueDate >= shortNoticeInput.currentDate!).toBe(true);
    }
  });

  it('marks overdue tasks as "Do now" when due date has passed', () => {
    const partiallyOverdueInput: EventPlanningInput = {
      ...normalEventInput,
      eventDate: '2026-11-20',
      currentDate: '2026-08-01', // Mid-way through planning
    };

    const timeline = generateTimeline(partiallyOverdueInput);
    const overdueTasks = timeline.filter((m) => m.isOverdue);

    expect(overdueTasks.length).toBeGreaterThan(0);
    for (const task of overdueTasks) {
      expect(task.dueDate < partiallyOverdueInput.currentDate!).toBe(true);
      expect(task.isDoNow).toBe(true);
    }
  });
});
