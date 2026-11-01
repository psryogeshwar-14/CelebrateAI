import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as planHandler } from '@/app/api/plan/route';
import { middleware } from '@/middleware';
import { logAuditEvent } from '@/lib/logging/audit';

describe('Security Hardening & Production Safeguards', () => {
  const validBasePayload = {
    eventType: 'birthday',
    title: "Maya's 5th Birthday",
    city: 'Bengaluru',
    eventDate: '2026-10-10',
    guestCount: 30,
    totalBudget: 50000,
    currency: 'INR',
    style: 'balanced',
    venueType: 'indoor',
  };

  it('rejects unexpected injected fields with Zod strict validation', async () => {
    const maliciousPayload = {
      ...validBasePayload,
      role: 'admin', // Injected privilege escalation field
      __proto__: { isAdmin: true },
      bypassSecurity: true,
    };

    const req = new NextRequest('http://localhost:3000/api/plan', {
      method: 'POST',
      body: JSON.stringify(maliciousPayload),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '172.16.0.1',
      },
    });

    const res = await planHandler(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe('Validation failed');
  });

  it('middleware rejects oversized request payloads (>512KB) with 413 Payload Too Large', () => {
    // Simulate oversized content-length header
    const req = new NextRequest('http://localhost:3000/api/plan', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'content-length': String(1024 * 1024), // 1 MB (limit is 512 KB)
      },
    });

    const res = middleware(req);
    expect(res.status).toBe(413);
  });

  it('middleware sets security headers (X-Content-Type-Options, X-Frame-Options)', () => {
    const req = new NextRequest('http://localhost:3000/dashboard');
    const res = middleware(req);

    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('X-Frame-Options')).toBe('DENY');
    expect(res.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  });

  it('audit logging anonymizes IP addresses for privacy compliance', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logAuditEvent({
      action: 'plan_generate',
      ip: '203.0.113.195',
      status: 'success',
      totalBudget: 100000,
      eventType: 'wedding',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const logCall = consoleSpy.mock.calls[0][0];
    expect(logCall).toContain('[AUDIT]');
    expect(logCall).toContain('203.0.113.xxx'); // Last octet masked
    expect(logCall).not.toContain('203.0.113.195');

    consoleSpy.mockRestore();
  });

  it('API route returns generic error messages and hides raw stack traces on internal failures', async () => {
    const invalidJsonReq = new NextRequest('http://localhost:3000/api/plan', {
      method: 'POST',
      body: 'invalid-non-json-string',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '172.16.0.2',
      },
    });

    const res = await planHandler(invalidJsonReq);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.message).toBe('Malformed JSON payload.');
    expect(json.stack).toBeUndefined(); // Stack trace never exposed to client
  });
});
