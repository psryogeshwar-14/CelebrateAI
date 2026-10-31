import { describe, it, expect } from 'vitest';
import { generateVendors } from './vendors';
import { calculateBudget } from './budget';
import { EventPlanningInput } from './types';

describe('Engine: vendors.ts', () => {
  const weddingInput: EventPlanningInput = {
    eventType: 'wedding',
    title: "Ananya & Vikram's Wedding",
    city: 'Bengaluru',
    eventDate: '2026-11-20',
    currentDate: '2026-05-01',
    guestCount: 350,
    totalBudget: 2500000,
  };

  it('generates vendor checklist tailored by event type and city', () => {
    const budget = calculateBudget(weddingInput);
    const vendors = generateVendors(weddingInput, budget);

    expect(vendors.length).toBeGreaterThanOrEqual(4);
    for (const v of vendors) {
      expect(v.vendorType).toBeTruthy();
      expect(v.whyNeeded).toBeTruthy();
      expect(v.keyQuestions.length).toBeGreaterThanOrEqual(2);
      expect(v.googleMapsSearchUrl).toContain('google.com/maps/search');
      expect(v.googleMapsSearchUrl).toContain(encodeURIComponent('Bengaluru'));
    }
  });

  it('guarantees that all vendor booking deadlines precede or equal the event date', () => {
    const budget = calculateBudget(weddingInput);
    const vendors = generateVendors(weddingInput, budget);

    for (const v of vendors) {
      expect(v.bookingDeadline <= weddingInput.eventDate).toBe(true);
      expect(v.daysBeforeEvent).toBeGreaterThanOrEqual(0);
    }
  });

  it('calculates realistic estimated budget ranges based on computed allocations', () => {
    const budget = calculateBudget(weddingInput);
    const vendors = generateVendors(weddingInput, budget);

    for (const v of vendors) {
      expect(v.estimatedBudgetRange.min).toBeGreaterThan(0);
      expect(v.estimatedBudgetRange.target).toBeGreaterThanOrEqual(v.estimatedBudgetRange.min);
      expect(v.estimatedBudgetRange.max).toBeGreaterThanOrEqual(v.estimatedBudgetRange.target);
    }
  });

  it('compresses vendor deadlines appropriately for short-notice events (< 30 days)', () => {
    const shortNoticeInput: EventPlanningInput = {
      ...weddingInput,
      eventDate: '2026-11-20',
      currentDate: '2026-11-05', // 15 days away
    };

    const budget = calculateBudget(shortNoticeInput);
    const vendors = generateVendors(shortNoticeInput, budget);

    for (const v of vendors) {
      expect(v.daysBeforeEvent).toBeLessThanOrEqual(15);
      expect(v.daysBeforeEvent).toBeGreaterThanOrEqual(0);
      expect(v.bookingDeadline <= shortNoticeInput.eventDate).toBe(true);
    }
  });
});
