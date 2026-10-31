import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computePlan } from '@/lib/engine/planner';
import { EventPlanningInput, EventType, StylePreference, VenueTypePreference } from '@/lib/engine/types';
import { generatePlanEnrichment, checkRateLimit } from '@/lib/ai/gemini-client';

const replanRequestZodSchema = z.object({
  eventType: z.enum(['wedding', 'birthday', 'community_event']),
  title: z.string().min(3).max(120),
  city: z.string().min(2).max(100),
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
  forceRefreshAI: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json();
    const validation = replanRequestZodSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed for replanning request',
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
  } catch (error: any) {
    console.error('Unhandled error in /api/replan:', error);
    return NextResponse.json(
      {
        error: 'Internal server error while replanning event',
        message: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
