import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computePlan } from '@/lib/engine/planner';
import { EventPlanningInput, EventType, StylePreference, VenueTypePreference } from '@/lib/engine/types';
import { generatePlanEnrichment, checkRateLimit } from '@/lib/ai/gemini-client';
import { logAuditEvent } from '@/lib/logging/audit';
import { sanitizeText } from '@/lib/ai/validate';
import { getErrorMessage } from '@/shared/lib/errors';
import { logger } from '@/shared/lib/logger';

// Strict schema rejecting unexpected injected fields
const replanRequestZodSchema = z
  .object({
    eventType: z.enum(['wedding', 'birthday', 'community_event']),
    title: z.string().min(3).max(120),
    city: z.string().min(2).max(100),
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
    forceRefreshAI: z.boolean().default(false),
  })
  .strict();

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous-client';

  try {
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      logAuditEvent({
        action: 'rate_limit_exceeded',
        ip: clientIp,
        status: 'rate_limited',
        reason: 'Exceeded 10 requests per minute limit on /api/replan',
      });

      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Rate limit exceeded: Maximum 10 replanning requests per minute. Please try again later.',
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

    let body: unknown;
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

    const validation = replanRequestZodSchema.safeParse(body);

    if (!validation.success) {
      logAuditEvent({
        action: 'plan_replan',
        ip: clientIp,
        status: 'rejected',
        reason: 'Zod validation failed for replan',
      });

      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Request payload contains invalid fields or values for replanning.',
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const planningInput: EventPlanningInput = {
      eventType: data.eventType as EventType,
      title: data.title,
      city: data.city,
      eventDate: data.eventDate,
      guestCount: data.guestCount,
      totalBudget: data.totalBudget,
      currency: data.currency,
      style: data.style as StylePreference,
      venueType: data.venueType as VenueTypePreference,
      dietaryRequirements: data.dietaryRequirements,
      accessibilityRequirements: data.accessibilityRequirements,
      specialRequests: data.specialRequests || undefined,
      currentDate: data.currentDate,
    };

    // Recompute deterministic plan
    const updatedPlan = computePlan(planningInput);

    // AI Enrichment (respects forceRefreshAI flag)
    const aiEnrichment = await generatePlanEnrichment(updatedPlan, {
      bypassCache: data.forceRefreshAI,
      userIdentifier: clientIp,
    });

    const durationMs = Date.now() - startTime;
    logAuditEvent({
      action: 'plan_replan',
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
        plan: updatedPlan,
        ai: aiEnrichment,
        rateLimit: {
          remaining: rateLimit.remaining,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const durationMs = Date.now() - startTime;
    const errorMessage = getErrorMessage(error);
    logAuditEvent({
      action: 'plan_replan',
      ip: clientIp,
      status: 'failed',
      durationMs,
      reason: errorMessage,
    });

    logger.error('[API /api/replan] Internal exception', error, { clientIp, durationMs }, 'api-replan');

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while recalculating the plan. Please try again.',
      },
      { status: 500 }
    );
  }
}
