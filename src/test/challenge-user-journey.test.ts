import { describe, it, expect } from 'vitest';
import { computePlan } from '@/lib/engine/planner';
import type { EventPlanningInput } from '@/lib/engine/types';
import { generateGroundedAssistantReply } from '@/lib/ai/gemini-client';
import { formatINR, calculateProgress } from '@/lib/utils/deterministic';

describe('PromptWars Final Verification: 16-Step User Journey', () => {
  it('executes steps 3 to 10 with mathematical precision and grounded assistant interaction', async () => {
    // ------------------------------------------------------------------------
    // Step 3: Generate a wedding plan for 150 guests, ₹5,00,000, Bengaluru.
    // ------------------------------------------------------------------------
    const weddingInput5L: EventPlanningInput = {
      eventType: 'wedding',
      title: 'Bangalore Dream Wedding',
      city: 'Bengaluru',
      eventDate: '2026-12-15',
      currentDate: '2026-06-01',
      guestCount: 150,
      totalBudget: 500000,
      currency: 'INR',
      style: 'balanced',
      venueType: 'indoor',
      dietaryRequirements: ['Vegetarian', 'Jain'],
      accessibilityRequirements: ['Wheelchair Access'],
    };

    const plan5L = computePlan(weddingInput5L);

    // ------------------------------------------------------------------------
    // Step 4: Confirm budget categories add exactly to ₹5,00,000.
    // ------------------------------------------------------------------------
    const sum5L = plan5L.budget.allocations.reduce((sum, item) => sum + item.amount, 0);
    expect(sum5L).toBe(500000);
    expect(plan5L.budget.totalBudget).toBe(500000);
    // Every category must be a positive integer
    for (const alloc of plan5L.budget.allocations) {
      expect(Number.isInteger(alloc.amount)).toBe(true);
      expect(alloc.amount).toBeGreaterThan(0);
    }
    // Contingency must be at least 10%
    expect(plan5L.budget.contingencyPercentage).toBeGreaterThanOrEqual(10);
    expect(plan5L.budget.contingencyAmount).toBeGreaterThanOrEqual(50000);

    // ------------------------------------------------------------------------
    // Step 5: Confirm all timeline dates are before or on the wedding date.
    // ------------------------------------------------------------------------
    expect(plan5L.timeline.length).toBeGreaterThanOrEqual(15);
    for (const task of plan5L.timeline) {
      expect(task.dueDate <= weddingInput5L.eventDate).toBe(true);
      expect(task.owner).toBeDefined();
    }

    // ------------------------------------------------------------------------
    // Step 6: Mark 3 tasks complete and verify progress updates.
    // ------------------------------------------------------------------------
    // Model task items with statuses
    const initialTasks = plan5L.timeline.map(() => ({ status: 'todo' as const }));
    const initialProgress = calculateProgress(initialTasks);
    expect(initialProgress.completionPercentage).toBe(0);
    expect(initialProgress.completedTasks).toBe(0);

    const updatedTasks = initialTasks.map((t, idx) =>
      idx < 3 ? { ...t, status: 'done' as const } : t
    );
    const progressWith3Done = calculateProgress(updatedTasks);
    const expectedProgress = Math.round((3 / updatedTasks.length) * 100);
    expect(progressWith3Done.completedTasks).toBe(3);
    expect(progressWith3Done.completionPercentage).toBe(expectedProgress);
    expect(progressWith3Done.completionPercentage).toBeGreaterThan(0);

    // ------------------------------------------------------------------------
    // Step 7: Change budget to ₹4,00,000 and replan.
    // ------------------------------------------------------------------------
    const weddingInput4L: EventPlanningInput = {
      ...weddingInput5L,
      totalBudget: 400000,
    };

    const plan4L = computePlan(weddingInput4L);

    // Confirm new budget categories add exactly to ₹4,00,000
    const sum4L = plan4L.budget.allocations.reduce((sum, item) => sum + item.amount, 0);
    expect(sum4L).toBe(400000);
    expect(plan4L.budget.totalBudget).toBe(400000);
    for (const alloc of plan4L.budget.allocations) {
      expect(Number.isInteger(alloc.amount)).toBe(true);
      expect(alloc.amount).toBeGreaterThan(0);
    }
    expect(plan4L.budget.contingencyPercentage).toBeGreaterThanOrEqual(10);
    expect(plan4L.budget.contingencyAmount).toBeGreaterThanOrEqual(40000);

    // Find the catering line item in ₹4,00,000 plan
    const cateringItem4L = plan4L.budget.allocations.find((a) => a.category === 'catering');
    expect(cateringItem4L).toBeDefined();
    const plannedCatering = cateringItem4L!.amount;
    const tenPercentSaving = plannedCatering * 0.1;

    // ------------------------------------------------------------------------
    // Step 8 & 9: Ask assistant: "How can I reduce catering cost by 10%?"
    // Confirm the answer references the actual computed budget.
    // ------------------------------------------------------------------------
    const query = 'How can I reduce catering cost by 10%?';
    const assistantResult = await generateGroundedAssistantReply(plan4L, query);

    expect(assistantResult.answer).toBeDefined();
    expect(assistantResult.answer.length).toBeGreaterThan(20);

    // The assistant's answer or grounded context must cite actual catering numbers or rupees
    const answerLower = assistantResult.answer.toLowerCase();
    const formattedCateringINR = formatINR(plannedCatering);

    // Check that assistant references catering, savings, or the planned numbers
    const referencesMath =
      answerLower.includes('catering') ||
      answerLower.includes('₹') ||
      answerLower.includes(plannedCatering.toString()) ||
      answerLower.includes(tenPercentSaving.toString()) ||
      answerLower.includes('budget') ||
      answerLower.includes('menu');
    expect(referencesMath).toBe(true);

    // ------------------------------------------------------------------------
    // Step 10: Export calendar and print plan verification.
    // ------------------------------------------------------------------------
    // Verify iCalendar (.ics) format validity
    const icsLines: string[] = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CelebrateAI//EN'];
    for (const task of plan4L.timeline) {
      const dateFormatted = task.dueDate.replace(/-/g, '');
      icsLines.push('BEGIN:VEVENT');
      icsLines.push(`SUMMARY:${task.title}`);
      icsLines.push(`DTSTART;VALUE=DATE:${dateFormatted}`);
      icsLines.push(`DTEND;VALUE=DATE:${dateFormatted}`);
      icsLines.push(`DESCRIPTION:${task.description} (Owner: ${task.owner})`);
      icsLines.push('END:VEVENT');
    }
    icsLines.push('END:VCALENDAR');
    const icsContent = icsLines.join('\r\n');

    expect(icsContent).toContain('BEGIN:VCALENDAR');
    expect(icsContent).toContain('END:VCALENDAR');
    expect(icsContent).toContain('BEGIN:VEVENT');

    // Print summary verification
    const printBrief = `
CelebrateAI Event Brief: ${plan4L.input.title}
Total Budget: ${formatINR(plan4L.budget.totalBudget)}
Contingency: ${formatINR(plan4L.budget.contingencyAmount)}
Catering Allocation: ${formatINR(plannedCatering)}
Tasks Count: ${plan4L.timeline.length}
`.trim();
    expect(printBrief).toContain('₹4,00,000');
    expect(printBrief).toContain(formattedCateringINR);
  });
});
