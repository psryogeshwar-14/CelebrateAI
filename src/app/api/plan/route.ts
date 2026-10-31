import { NextRequest, NextResponse } from 'next/server';
import { computePlan } from '@/lib/engine/planner';
import { EventPlanningInput, EventType, StylePreference, VenueTypePreference } from '@/lib/engine/types';
import { generatePlanEnrichment, checkRateLimit } from '@/lib/ai/gemini-client';
import { logAuditEvent } from '@/lib/logging/audit';
import { getErrorMessage } from '@/shared/lib/errors';
import { logger } from '@/shared/lib/logger';
import { extractClientIp, buildRateLimitResponse } from '@/shared/lib/api-utils';
import { planRequestZodSchema, PlanRequestInput } from '@/features/events/schemas/plan-request.schema';

function parsePlanningInput(data: PlanRequestInput): EventPlanningInput {
  return {
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
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const clientIp = extractClientIp(req);

  try {
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      logAuditEvent({
        action: 'rate_limit_exceeded',
        ip: clientIp,
        status: 'rate_limited',
        reason: 'Exceeded 10 requests per minute limit on /api/plan',
      });
      return buildRateLimitResponse(rateLimit);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Bad Request', message: 'Malformed JSON payload.' }, { status: 400 });
    }

    const validation = planRequestZodSchema.safeParse(body);
    if (!validation.success) {
      logAuditEvent({ action: 'plan_generate', ip: clientIp, status: 'rejected', reason: 'Zod validation failed' });
      return NextResponse.json(
        { error: 'Validation failed', message: 'Request payload contains invalid fields or values.', issues: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const planningInput = parsePlanningInput(validation.data);
    const computedPlan = computePlan(planningInput);
    const aiEnrichment = await generatePlanEnrichment(computedPlan, { userIdentifier: clientIp });

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
      { success: true, plan: computedPlan, ai: aiEnrichment, rateLimit: { remaining: rateLimit.remaining } },
      { status: 200 }
    );
  } catch (error: unknown) {
    const durationMs = Date.now() - startTime;
    const errorMessage = getErrorMessage(error);
    logAuditEvent({ action: 'plan_generate', ip: clientIp, status: 'failed', durationMs, reason: errorMessage });
    logger.error('[API /api/plan] Internal exception', error, { clientIp, durationMs }, 'api-plan');

    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred while generating the celebration plan. Please try again.' },
      { status: 500 }
    );
  }
}
