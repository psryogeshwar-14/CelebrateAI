import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as planHandler } from './route';
import { POST as replanHandler } from '../replan/route';
import { POST as assistantHandler } from '../assistant/route';
import { computePlan } from '@/lib/engine/planner';

describe('API Routes: /api/plan, /api/replan, /api/assistant', () => {
  const validPlanBody = {
    eventType: 'birthday',
    title: "Aarav's 10th Superhero Birthday",
    city: 'Bengaluru',
    eventDate: '2026-11-20',
    currentDate: '2026-05-01',
    guestCount: 40,
    totalBudget: 80000,
    currency: 'INR',
    style: 'balanced',
    venueType: 'indoor',
  };

  it('POST /api/plan rejects invalid inputs with 400 status', async () => {
    const invalidBody = {
      ...validPlanBody,
      guestCount: -5, // Invalid negative guests
      totalBudget: 0, // Invalid zero budget
    };

    const req = new NextRequest('http://localhost:3000/api/plan', {
      method: 'POST',
      body: JSON.stringify(invalidBody),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '192.168.1.1',
      },
    });

    const res = await planHandler(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe('Validation failed');
  });

  it('POST /api/plan processes valid input, runs deterministic engine, and returns 200 with plan & AI enrichment', async () => {
    const req = new NextRequest('http://localhost:3000/api/plan', {
      method: 'POST',
      body: JSON.stringify(validPlanBody),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '192.168.1.2',
      },
    });

    const res = await planHandler(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.plan.input.title).toBe(validPlanBody.title);
    expect(json.plan.budget.totalBudget).toBe(validPlanBody.totalBudget);
    expect(json.ai).toBeDefined();
    expect(json.ai.themes.length).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/replan recalculates plan with updated parameters', async () => {
    const updatedBody = {
      ...validPlanBody,
      guestCount: 60, // Changed from 40 to 60
      totalBudget: 120000, // Changed from 80k to 120k
      forceRefreshAI: true,
    };

    const req = new NextRequest('http://localhost:3000/api/replan', {
      method: 'POST',
      body: JSON.stringify(updatedBody),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '192.168.1.3',
      },
    });

    const res = await replanHandler(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.plan.summary.guestCount).toBe(60);
    expect(json.plan.budget.totalBudget).toBe(120000);
  });

  it('POST /api/assistant provides grounded responses with 3 suggested follow-up questions', async () => {
    const plan = computePlan(validPlanBody as any);
    const assistantBody = {
      plan,
      message: 'What should we lock in first according to our timeline?',
    };

    const req = new NextRequest('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify(assistantBody),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '192.168.1.4',
      },
    });

    const res = await assistantHandler(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.reply.answer).toBeTruthy();
    expect(json.reply.suggestedQuestions.length).toBe(3);
  });
});
