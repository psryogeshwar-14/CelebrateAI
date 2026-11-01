import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateGroundedAssistantReply, checkRateLimit } from '@/lib/ai/gemini-client';
import type { ComputedPlan } from '@/lib/engine/types';
import { logAuditEvent } from '@/lib/logging/audit';
import { sanitizeText } from '@/lib/ai/validate';
import { getErrorMessage } from '@/shared/lib/errors';
import { logger } from '@/shared/lib/logger';

const chatMessageZodSchema = z
  .object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(2000),
  })
  .strict();

const assistantRequestZodSchema = z
  .object({
    plan: z.custom<ComputedPlan>((val) => val && typeof val === 'object' && 'input' in val && 'budget' in val),
    message: z.string().min(1, 'Message cannot be empty').max(1000),
    history: z.array(chatMessageZodSchema).optional().default([]),
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
        reason: 'Exceeded 10 requests per minute limit on /api/assistant',
      });

      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Rate limit exceeded: Maximum 10 assistant queries per minute. Please try again later.',
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

    const validation = assistantRequestZodSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Validation failed for assistant request payload.',
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { plan, message, history } = validation.data;
    const sanitizedMessage = sanitizeText(message);
    const sanitizedHistory = history.map((h) => ({
      role: h.role,
      content: sanitizeText(h.content),
    }));

    const reply = await generateGroundedAssistantReply(plan, sanitizedMessage, sanitizedHistory);

    const durationMs = Date.now() - startTime;
    logAuditEvent({
      action: 'assistant_chat',
      ip: clientIp,
      status: 'success',
      durationMs,
      eventType: plan.input.eventType,
    });

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
  } catch (error: unknown) {
    const durationMs = Date.now() - startTime;
    const errorMessage = getErrorMessage(error);
    logAuditEvent({
      action: 'assistant_chat',
      ip: clientIp,
      status: 'failed',
      durationMs,
      reason: errorMessage,
    });

    logger.error('[API /api/assistant] Internal exception', error, { clientIp, durationMs }, 'api-assistant');

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while consulting the assistant. Please try again.',
      },
      { status: 500 }
    );
  }
}
