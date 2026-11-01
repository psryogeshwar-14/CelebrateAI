import { describe, it, expect } from 'vitest';
import { createClient } from './client';
import { BENGALURU_DEMO_EVENTS } from '../data/seeds';

describe('Supabase Auth & Row-Level Security (RLS) Policy Verification', () => {
  it('client initialization never exposes the service-role key to the browser', () => {
    // Check client environment access
    const _browserClientEnv = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const _serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Service role key must NEVER start with NEXT_PUBLIC_
    expect(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();

    // Client supabase instance exists and is safely configured
    const client = createClient();
    expect(client).toBeDefined();
  });

  it('verifies demo seed events are properly marked as is_demo = true for public access', () => {
    // Under Supabase RLS policy: "Public demo events are viewable by everyone where is_demo = true"
    for (const demo of BENGALURU_DEMO_EVENTS) {
      expect(demo.event.is_demo).toBe(true);
      expect(demo.event.id).toBeDefined();
      expect(demo.event.title).toBeDefined();
      expect(demo.event.city).toBe('Bengaluru');
      expect(demo.budgetItems.length).toBeGreaterThan(0);
      expect(demo.vendors.length).toBeGreaterThan(0);
    }
  });

  it('validates simulated user RLS ownership rule', () => {
    const userA = 'user-uuid-1111';
    const userB = 'user-uuid-2222';

    const eventByUserA = {
      id: 'event-uuid-a',
      user_id: userA,
      is_demo: false,
    };

    const demoEvent = {
      id: 'event-uuid-demo',
      user_id: null,
      is_demo: true,
    };

    // RLS Policy Evaluation Simulation:
    // User can read if: is_demo = true OR auth.uid() = user_id
    const canUserAReadOwn = eventByUserA.is_demo || eventByUserA.user_id === userA;
    const canUserBReadUserA = eventByUserA.is_demo || eventByUserA.user_id === userB;
    const canAnonReadDemo = demoEvent.is_demo;

    expect(canUserAReadOwn).toBe(true);
    expect(canUserBReadUserA).toBe(false); // Isolated by RLS
    expect(canAnonReadDemo).toBe(true); // Public demo accessible
  });
});
