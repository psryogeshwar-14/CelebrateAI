import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateGroundedAssistantReply, checkRateLimit } from '@/lib/ai/gemini-client';
import { ComputedPlan } from '@/lib/engine/types';

const chatMessageZodSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(2000),
});

const assistantRequestZodSchema = z.object({
  plan: z.custom<ComputedPlan>((val) => val && typeof val === 'object' && 'input' in val && 'budget' in val),
  message: z.string().min(1, 'Message cannot be empty').max(1000),
  history: z.array(chatMessageZodSchema).optional().default([]),
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
          error: 'Rate limit exceeded: Maximum 10 assistant interactions per minute.',
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
    const validation = assistantRequestZodSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed for assistant request',
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { plan, message, history } = validation.data;

    const reply = await generateGroundedAssistantReply(plan, message, history);

    return NextResponse.json(
      {
        success: true,
        reply,
        rateLimit: {
          remaining: rateLimit.remaining,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Unhandled error in /api/assistant:', error);
    return NextResponse.json(
      {
        error: 'Internal server error while processing assistant query',
        message: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
