import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkRateLimit,
  clearEnrichmentCache,
  generatePlanEnrichment,
  generateGroundedAssistantReply,
} from './gemini-client';
import { buildEnrichmentPrompt, buildAssistantSystemInstruction } from './prompts';
import { computePlan } from '../engine/planner';
import type { EventPlanningInput } from '../engine/types';

describe('AI Client: gemini-client.ts', () => {
  beforeEach(() => {
    clearEnrichmentCache();
  });

  const sampleInput: EventPlanningInput = {
    eventType: 'birthday',
    title: "Rohan's 30th Birthday",
    city: 'Bengaluru',
    eventDate: '2026-11-14',
    guestCount: 50,
    totalBudget: 150000,
  };

  const plan = computePlan(sampleInput);

  it('enforces rate limiting of exactly 10 requests per minute', () => {
    const testId = 'test-user-rate-limit';

    // First 10 requests should be allowed
    for (let i = 0; i < 10; i++) {
      const result = checkRateLimit(testId);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9 - i);
    }

    // 11th request must be rejected
    const blockedResult = checkRateLimit(testId);
    expect(blockedResult.allowed).toBe(false);
    expect(blockedResult.remaining).toBe(0);
    expect(blockedResult.retryAfterSec).toBeGreaterThan(0);
  });

  it('builds enrichment prompt with <computed_plan> and strict directive', () => {
    const prompt = buildEnrichmentPrompt(plan);

    expect(prompt).toContain('<computed_plan>');
    expect(prompt).toContain('</computed_plan>');
    expect(prompt).toContain('These computed facts are fixed.');
    expect(prompt).toContain('Do not change amounts, dates, deadlines, or calculations.');
    expect(prompt).toContain('Rohan\'s 30th Birthday');
    expect(prompt).toContain('Bengaluru');
  });

  it('builds assistant system instruction with prompt injection defense and locked facts', () => {
    const systemPrompt = buildAssistantSystemInstruction(plan);

    expect(systemPrompt).toContain('LOCKED EVENT FACTS:');
    expect(systemPrompt).toContain('PROMPT INJECTION DEFENSE:');
    expect(systemPrompt).toContain('ONLY answer questions directly related to planning this specific event');
    expect(systemPrompt).toContain('All dates, guest counts, and budget figures in LOCKED EVENT FACTS are immutable.');
  });

  it('returns high-quality offline fallback ideas when Gemini API key is missing or offline', async () => {
    // When GEMINI_API_KEY is not set or set to placeholder
    const enrichment = await generatePlanEnrichment(plan);

    expect(enrichment).toBeDefined();
    expect(enrichment.isAIOffline).toBe(true);
    expect(enrichment.themes.length).toBeGreaterThanOrEqual(1);
    expect(enrichment.menu.sections.length).toBeGreaterThanOrEqual(1);
    expect(enrichment.savingsTips.length).toBeGreaterThanOrEqual(1);
    expect(enrichment.runSheet.length).toBeGreaterThanOrEqual(1);
  });

  it('caches identical plan enrichment requests for 10 minutes', async () => {
    const firstCall = await generatePlanEnrichment(plan);
    const secondCall = await generatePlanEnrichment(plan);

    // Second call should come from in-memory cache with identical generatedAt timestamp
    expect(secondCall.generatedAt).toBe(firstCall.generatedAt);
  });

  it('provides grounded assistant reply with offline fallback if API is unreachable', async () => {
    const reply = await generateGroundedAssistantReply(
      plan,
      'What should I prioritize booking first?'
    );

    expect(reply.answer).toBeTruthy();
    expect(reply.suggestedQuestions.length).toBe(3);
    expect(reply.citations.length).toBeGreaterThanOrEqual(1);
  });
});
