import { describe, it, expect } from 'vitest';
import { computePlan } from '@/lib/engine/planner';
import { EventPlanningInput } from '@/lib/engine/types';
import { generatePlanEnrichment, generateGroundedAssistantReply } from '@/lib/ai/gemini-client';
import { formatINR } from '@/lib/utils/deterministic';

describe('Full Plan-Generation and Re-planning Integration Flow', () => {
  it('executes the full end-to-end lifecycle: plan -> enrich -> replan -> interact -> export', async () => {
    // Step 1: Initial event creation
    const initialInput: EventPlanningInput = {
      eventType: 'wedding',
      title: 'Kavya & Arjun Grand Wedding',
      city: 'Bengaluru',
      eventDate: '2026-11-28',
      currentDate: '2026-05-01',
      guestCount: 300,
      totalBudget: 2500000,
      currency: 'INR',
      style: 'balanced',
      venueType: 'indoor',
      dietaryRequirements: ['South Indian Vegetarian', 'Jain'],
      accessibilityRequirements: ['Wheelchair Ramp', 'Elderly Seating'],
    };

    const initialPlan = computePlan(initialInput);

    // Assert Deterministic Guarantees
    expect(initialPlan.budget.totalBudget).toBe(2500000);
    expect(initialPlan.budget.contingencyPercentage).toBeGreaterThanOrEqual(10);
    const sumAllocations = initialPlan.budget.allocations.reduce((acc, a) => acc + a.amount, 0);
    expect(sumAllocations).toBe(2500000);

    // Milestones check
    expect(initialPlan.timeline.length).toBeGreaterThanOrEqual(15);
    for (const milestone of initialPlan.timeline) {
      expect(milestone.dueDate <= initialPlan.input.eventDate).toBe(true);
      expect(milestone.owner).toBeDefined();
    }

    // Step 2: AI Enrichment (Grounded & Validated)
    const aiEnrichment = await generatePlanEnrichment(initialPlan, { bypassCache: true });
    expect(aiEnrichment.themes.length).toBe(3);
    for (const theme of aiEnrichment.themes) {
      expect(theme.palette.length).toBeGreaterThanOrEqual(3);
      expect(theme.decorIdeas.length).toBeGreaterThan(0);
      expect(theme.signatureMoment).toBeDefined();
    }

    // Step 3: Re-plan execution with modified parameters (Guest count increases, budget adjusted)
    const replanInput: EventPlanningInput = {
      ...initialInput,
      guestCount: 450,
      totalBudget: 3500000,
      venueType: 'outdoor', // Outdoor requires >= 12% contingency
    };

    const replannedPlan = computePlan(replanInput);

    expect(replannedPlan.budget.totalBudget).toBe(3500000);
    expect(replannedPlan.budget.contingencyPercentage).toBeGreaterThanOrEqual(12); // Outdoor buffer
    const replannedSum = replannedPlan.budget.allocations.reduce((acc, a) => acc + a.amount, 0);
    expect(replannedSum).toBe(3500000);
    expect(replannedPlan.summary.guestCount).toBe(450);

    // Step 4: Assistant grounded consultation
    const assistantReply = await generateGroundedAssistantReply(
      replannedPlan,
      'What is our total budget and how much is set aside for unexpected costs?'
    );

    expect(assistantReply.answer).toBeDefined();
    expect(assistantReply.suggestedQuestions.length).toBe(3);

    // Step 5: Export Data Integrity Simulation (ICS & Text)
    let icsEventsCount = 0;
    for (const task of replannedPlan.timeline) {
      const dateClean = task.dueDate.replace(/-/g, '');
      expect(dateClean).toMatch(/^\d{8}$/);
      icsEventsCount++;
    }
    expect(icsEventsCount).toBe(replannedPlan.timeline.length);

    // WhatsApp summary generation verification
    const formattedSummary = `
*${replannedPlan.input.title}*
City: ${replannedPlan.input.city}
Date: ${replannedPlan.input.eventDate}
Guests: ${replannedPlan.summary.guestCount}
Total Budget: ${formatINR(replannedPlan.budget.totalBudget)}
Contingency: ${formatINR(replannedPlan.budget.contingencyAmount)} (${replannedPlan.budget.contingencyPercentage}%)
`.trim();

    expect(formattedSummary).toContain('Kavya & Arjun Grand Wedding');
    expect(formattedSummary).toContain('450');
    expect(formattedSummary).toContain('₹35,00,000');
  });
});
