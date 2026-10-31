import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computePlan } from '@/lib/engine/planner';
import { EventPlanningInput, EventType, StylePreference, VenueTypePreference } from '@/lib/engine/types';
import { generatePlanEnrichment, checkRateLimit } from '@/lib/ai/gemini-client';

const planRequestZodSchema = z.object({
  eventType: z.enum(['wedding', 'birthday', 'community_event']),
  title: z.string().min(3).max(120),
  city: z.string().min(2).max(100).default('Bengaluru'),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  guestCount: z.number().int().positive(),
  totalBudget: z.number().positive(),
  currency: z.string().default('INR'),
  style: z.enum(['budget', 'balanced', 'premium']).default('balanced'),
  venueType: z.enum(['indoor', 'outdoor', 'hybrid']).default('indoor'),
  dietaryRequirements: z.array(z.string()).default([]),
  accessibilityRequirements: z.array(z.string()).default([]),
  specialRequests: z.string().max(1000).optional().nullable(),
  currentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check (10 requests per minute per IP/user)
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous-client';

    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded: Maximum 10 AI planning requests per minute.',
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

    // 2. Validate Request Body with Zod
    const body = await req.json();
    const validation = planRequestZodSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
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
    console.error('Unhandled error in /api/plan:', error);
    return NextResponse.json(
      {
        error: 'Internal server error while computing event plan',
        message: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
