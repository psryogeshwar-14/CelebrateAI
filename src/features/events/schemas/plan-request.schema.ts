import { z } from 'zod';

export const planRequestZodSchema = z
  .object({
    eventType: z.enum(['wedding', 'birthday', 'community_event']),
    title: z.string().min(3).max(120),
    city: z.string().min(2).max(100).default('Bengaluru'),
    eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be formatted as YYYY-MM-DD'),
    guestCount: z.number().int().positive().max(10000),
    totalBudget: z.number().positive().max(1000000000),
    currency: z.string().default('INR'),
    style: z.enum(['budget', 'balanced', 'premium']).default('balanced'),
    venueType: z.enum(['indoor', 'outdoor', 'hybrid']).default('indoor'),
    dietaryRequirements: z.array(z.string().max(80)).default([]),
    accessibilityRequirements: z.array(z.string().max(80)).default([]),
    specialRequests: z.string().max(1000).optional().nullable(),
    currentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  })
  .strict();

export const replanRequestZodSchema = z
  .object({
    eventType: z.enum(['wedding', 'birthday', 'community_event']),
    title: z.string().min(3).max(120),
    city: z.string().min(2).max(100).default('Bengaluru'),
    eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be formatted as YYYY-MM-DD'),
    guestCount: z.number().int().positive().max(10000),
    totalBudget: z.number().positive().max(1000000000),
    currency: z.string().default('INR'),
    style: z.enum(['budget', 'balanced', 'premium']).default('balanced'),
    venueType: z.enum(['indoor', 'outdoor', 'hybrid']).default('indoor'),
    dietaryRequirements: z.array(z.string().max(80)).default([]),
    accessibilityRequirements: z.array(z.string().max(80)).default([]),
    specialRequests: z.string().max(1000).optional().nullable(),
    currentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    forceRefreshAI: z.boolean().default(false),
  })
  .strict();

export type PlanRequestInput = z.infer<typeof planRequestZodSchema>;
export type ReplanRequestInput = z.infer<typeof replanRequestZodSchema>;
