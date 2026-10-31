import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Maximum payload size permitted for API requests (512 KB)
const MAX_REQUEST_SIZE_BYTES = 512 * 1024;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Enforce payload size limit on incoming POST / PUT / PATCH API requests
  if (pathname.startsWith('/api/')) {
    const method = request.method.toUpperCase();

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentLengthHeader = request.headers.get('content-length');
      if (contentLengthHeader) {
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
      }

      // 2. CSRF / Origin validation for mutating API routes
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');
      const secFetchSite = request.headers.get('sec-fetch-site');

      // Block cross-origin state-changing mutations if sec-fetch-site indicates cross-site
      if (secFetchSite === 'cross-site') {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: 'Cross-origin state-changing requests are prohibited.',
          },
          { status: 403 }
        );
      }

      // If origin is present, ensure it matches host (permitting localhost during dev/tests)
      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          // In production, reject mismatched host/origin
          if (
            process.env.NODE_ENV === 'production' &&
            originHost !== host &&
            !originHost.endsWith('.run.app')
          ) {
            return NextResponse.json(
              {
                error: 'Forbidden',
                message: 'Invalid origin header for mutating API request.',
              },
              { status: 403 }
            );
          }
        } catch {
          // Malformed origin
          return NextResponse.json(
            {
              error: 'Bad Request',
              message: 'Malformed origin header.',
            },
            { status: 400 }
          );
        }
      }
    }
  }

  const response = NextResponse.next();

  // 3. Security headers on response
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
