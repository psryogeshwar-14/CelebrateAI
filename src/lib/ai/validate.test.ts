import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  validateAndMergeEnrichment,
  getOfflineFallbackEnrichment,
} from './validate';
import { computePlan } from '../engine/planner';
import { EventPlanningInput } from '../engine/types';

describe('AI Validation: validate.ts', () => {
  const sampleInput: EventPlanningInput = {
    eventType: 'wedding',
    title: "Ananya & Vikram's Heritage Wedding",
    city: 'Bengaluru',
    eventDate: '2026-11-20',
    currentDate: '2026-05-01',
    guestCount: 350,
    totalBudget: 2500000,
  };

  const plan = computePlan(sampleInput);

  const mockRawGeminiJson = {
    themes: [
      {
        name: 'Royal Heritage & Temple Jasmine',
        description: 'Traditional Hoysala stone architecture with antique brass urlis.',
        palette: ['#8B1E3F', '#D4AF37', '#2C5E43', '#FFFDD0'],
        decor_ideas: ['Stone finish mandap pillars', 'Antique brass bells'],
        signature_moment: 'Grand entry under woven jasmine canopy',
      },
    ],
    menu: {
      summary: 'Grand 24-dish traditional feast',
      sections: [
        {
          name: 'Welcome Drinks',
          items: ['Spiced Kokum Fizz', 'Iced Panakam'],
        },
        {
          name: 'Mains',
          items: ['Authentic Bisi Bele Bath', 'Melkote Puliyogare'],
        },
      ],
      dietary_notes: ['Strict Jain kitchen segregation counter'],
    },
    risks: [
      {
        risk: 'Rain over courtyard',
        impact: 'high',
        mitigation: 'German waterproof clear-span hangars pre-installed',
      },
    ],
    savings_tips: [
      {
        category: 'decor', // Valid category
        percentage: 15,
        advice: 'Reuse morning floral mandap as evening backdrop.',
      },
      {
        category: 'catering', // Valid category with excessive percentage
        percentage: 55, // Should be clamped to 30%
        advice: 'Limit live counters to 4 crowd favorites.',
      },
      {
        category: 'gambling_and_crypto', // Unknown category -> MUST BE REJECTED
        percentage: 20,
        advice: 'Do not spend money on speculative tokens.',
      },
    ],
    personal_tasks: [
      {
        title: 'Schedule Bridal Saree Draping Trial',
        reason: 'Essential for early morning Muhurtham timing.',
        suggested_offset_days: 21,
      },
    ],
    run_sheet: [
      {
        time: '07:30 AM',
        activity: 'Muhurtham rituals',
        owner: 'Priest & Family',
      },
      {
        time: '09:00 AM',
        activity: 'Traditional breakfast banquet',
        owner: 'Catering Lead',
      },
      {
        time: '11:30 AM',
        activity: 'Blessing photos & favor distribution',
        owner: 'Coordinator',
      },
    ],
  };

  it('sanitizes text to prevent HTML injection and XSS', () => {
    const malicious = '<script>alert("hack")</script> & "quotes" \'single\'';
    const sanitized = sanitizeText(malicious);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('&lt;script&gt;');
    expect(sanitized).toContain('&amp;');
    expect(sanitized).toContain('&quot;');
  });

  it('validates raw Gemini output and clamps savings percentages strictly between 0 and 30%', () => {
    const validated = validateAndMergeEnrichment(mockRawGeminiJson, plan);

    expect(validated.isAIOffline).toBe(false);
    expect(validated.themes.length).toBe(1);

    // Decor tip had 15% -> clamped to 15%
    const decorTip = validated.savingsTips.find((t) => t.category === 'decor');
    expect(decorTip).toBeDefined();
    expect(decorTip!.percentage).toBe(15);

    // Catering tip had 55% -> clamped to 30%
    const cateringTip = validated.savingsTips.find((t) => t.category === 'catering');
    expect(cateringTip).toBeDefined();
    expect(cateringTip!.percentage).toBe(30);
  });

  it('strictly rejects unknown budget categories in savings tips', () => {
    const validated = validateAndMergeEnrichment(mockRawGeminiJson, plan);
    const unknownTip = validated.savingsTips.find(
      (t) => t.category === 'gambling_and_crypto'
    );
    expect(unknownTip).toBeUndefined();
  });

  it('server calculates savings amount from actual deterministic budget lines', () => {
    const validated = validateAndMergeEnrichment(mockRawGeminiJson, plan);
    const decorAlloc = plan.budget.allocations.find((a) => a.category === 'decor')!;
    const decorTip = validated.savingsTips.find((t) => t.category === 'decor')!;

    const expectedSavings = Math.round(decorAlloc.amount * 0.15);
    expect(decorTip.calculatedSavingsAmount).toBe(expectedSavings);
  });

  it('converts suggested_offset_days into real deterministic calendar due dates', () => {
    const validated = validateAndMergeEnrichment(mockRawGeminiJson, plan);
    const task = validated.personalTasks[0];

    expect(task.suggestedOffsetDays).toBe(21);
    // Event is 2026-11-20, offset 21 days is 2026-10-30
    expect(task.calculatedDueDate).toBe('2026-10-30');
    expect(task.isOverdue).toBe(false); // Reference date is May 2026
  });

  it('generates rich offline fallback templates clearly labelled "AI offline"', () => {
    const fallback = getOfflineFallbackEnrichment(plan);

    expect(fallback.isAIOffline).toBe(true);
    expect(fallback.aiStatus).toContain('AI offline');
    expect(fallback.themes.length).toBe(3);
    expect(fallback.menu.sections.length).toBeGreaterThanOrEqual(3);
    expect(fallback.savingsTips.length).toBeGreaterThanOrEqual(3);
    expect(fallback.runSheet.length).toBeGreaterThanOrEqual(4);

    // Ensure all savings tips are valid categories from the plan
    const validCats = new Set(plan.budget.allocations.map((a) => a.category));
    for (const tip of fallback.savingsTips) {
      expect(validCats.has(tip.category)).toBe(true);
      expect(tip.percentage).toBeLessThanOrEqual(30);
      expect(tip.calculatedSavingsAmount).toBeGreaterThan(0);
    }
  });
});
