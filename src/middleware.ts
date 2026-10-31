import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MAX_REQUEST_SIZE_BYTES = 512 * 1024;

function validateContentLength(request: NextRequest): NextResponse | null {
  const contentLengthHeader = request.headers.get('content-length');
  if (!contentLengthHeader) return null;

  const contentLength = parseInt(contentLengthHeader, 10);
  if (!isNaN(contentLength) && contentLength > MAX_REQUEST_SIZE_BYTES) {
    return NextResponse.json(
      {
        error: 'Payload Too Large',
        message: 'Request payload exceeds the maximum allowed limit of 512 KB.',
      },
      { status: 413 }
    );
  }
  return null;
}

function isOriginAllowed(originHost: string, host: string): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  if (originHost === host) return true;
  return originHost.endsWith('.run.app');
}

function validateOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return null;

  try {
    const originHost = new URL(origin).host;
    if (!isOriginAllowed(originHost, host)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Invalid origin header for mutating API request.',
        },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Forbidden', message: 'Malformed origin header.' },
      { status: 403 }
    );
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    const method = request.method.toUpperCase();

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const lengthError = validateContentLength(request);
      if (lengthError) return lengthError;

      const secFetchSite = request.headers.get('sec-fetch-site');
      if (secFetchSite === 'cross-site') {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: 'Cross-origin state-changing requests are prohibited.',
          },
          { status: 403 }
        );
      }

      const originError = validateOrigin(request);
      if (originError) return originError;
    }
  }

  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  );
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json).*)'],
};
