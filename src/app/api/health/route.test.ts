import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('Health Endpoint: GET /api/health', () => {
  it('returns 200 OK with { status: "ok" }', async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual({ status: 'ok' });
    expect(res.headers.get('Cache-Control')).toContain('no-cache');
  });
});
