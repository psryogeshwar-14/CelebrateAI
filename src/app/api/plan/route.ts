import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computePlan } from '@/lib/engine/planner';
import { EventPlanningInput, EventType, StylePreference, VenueTypePreference } from '@/lib/engine/types';
import { generatePlanEnrichment, checkRateLimit } from '@/lib/ai/gemini-client';
import { logAuditEvent } from '@/lib/logging/audit';
import { sanitizeText } from '@/lib/ai/validate';

// Strict schema rejecting unexpected injected fields
const planRequestZodSchema = z
  .object({
    eventType: z.enum(['wedding', 'birthday', 'community_event']),
    title: z.string().min(3).max(120),
    city: z.string().min(2).max(100).default('Bengaluru'),
    eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be formatted as YYYY-MM-DD'),
    guestCount: z.number().int().positive().max(10000),
    totalBudget: z.number().positive().max(1000000000),
    currency: z.string().default('INR'),
    style: z.enum(['budget', 'balanced', 'premium']).default('balanced'),
    venueType: z.enum(['indoor', 'outdoor', 'hybrid']).default('indoor'),
    dietaryRequirements: z.array(z.string().max(80)).default([]),
    accessibilityRequirements: z.array(z.string().max(80)).default([]),
    specialRequests: z.string().max(1000).optional().nullable(),
    currentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  })
  .strict();

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous-client';

  try {
    // 1. Rate Limiting Check (10 requests per minute per IP/user)
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      logAuditEvent({
        action: 'rate_limit_exceeded',
        ip: clientIp,
        status: 'rate_limited',
        reason: 'Exceeded 10 requests per minute limit on /api/plan',
      });

      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Rate limit exceeded: Maximum 10 planning requests per minute. Please try again later.',
          retryAfterSec: rateLimit.retryAfterSec,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSec || 60),
          },
        }
      );
    }

    // 2. Validate Request Body with Strict Zod
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Malformed JSON payload.',
        },
        { status: 400 }
      );
    }

    const validation = planRequestZodSchema.safeParse(body);

    if (!validation.success) {
      logAuditEvent({
        action: 'plan_generate',
        ip: clientIp,
        status: 'rejected',
        reason: 'Zod validation failed',
      });

      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Request payload contains invalid fields or values.',
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const inputData = validation.data;
    const planningInput: EventPlanningInput = {
      eventType: inputData.eventType as EventType,
      title: inputData.title,
      city: inputData.city,
      eventDate: inputData.eventDate,
      guestCount: inputData.guestCount,
      totalBudget: inputData.totalBudget,
      currency: inputData.currency,
      style: inputData.style as StylePreference,
      venueType: inputData.venueType as VenueTypePreference,
      dietaryRequirements: inputData.dietaryRequirements,
      accessibilityRequirements: inputData.accessibilityRequirements,
      specialRequests: inputData.specialRequests || undefined,
      currentDate: inputData.currentDate,
    };

    // 3. Execute Pure Deterministic Planning Engine
    const computedPlan = computePlan(planningInput);

    // 4. Execute Grounded AI Enrichment (Cached for 10 minutes, graceful offline fallback)
    const aiEnrichment = await generatePlanEnrichment(computedPlan, {
      userIdentifier: clientIp,
    });

    const durationMs = Date.now() - startTime;
    logAuditEvent({
      action: 'plan_generate',
      ip: clientIp,
      eventType: planningInput.eventType,
      totalBudget: planningInput.totalBudget,
      city: planningInput.city,
      guestCount: planningInput.guestCount,
      status: 'success',
      durationMs,
      isAIOffline: aiEnrichment.isAIOffline,
    });

    return NextResponse.json(
      {
        success: true,
        plan: computedPlan,
        ai: aiEnrichment,
        rateLimit: {
          remaining: rateLimit.remaining,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Log internal error safely without exposing stack trace to client
    const durationMs = Date.now() - startTime;
    logAuditEvent({
      action: 'plan_generate',
      ip: clientIp,
      status: 'failed',
      durationMs,
      reason: error?.message || 'Internal failure',
    });

    console.error('[API /api/plan] Internal exception:', error);

    // Generic error response protecting internal architecture
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while generating the celebration plan. Please try again.',
      },
      { status: 500 }
    );
  }
}
