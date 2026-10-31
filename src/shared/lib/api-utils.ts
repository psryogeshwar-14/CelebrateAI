import { NextRequest, NextResponse } from 'next/server';
import { RateLimitStatus } from '@/features/ai/types';

export function extractClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous-client'
  );
}

export function buildRateLimitResponse(rateLimit: RateLimitStatus): NextResponse {
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
