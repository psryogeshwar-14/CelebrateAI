import { z } from 'zod';
import {
  eventTypeEnum,
  eventStatusEnum,
  budgetCategoryEnum,
  taskStatusEnum,
  taskPriorityEnum,
  vendorStatusEnum,
  ideaKindEnum,
} from './enums';

export * from './enums';
export * from './idea-schemas';

export const createEventSchema = z.object({
  eventType: eventTypeEnum,
  title: z.string().min(3, 'Title must be at least 3 characters long').max(120),
  city: z.string().min(2, 'City is required').default('Bengaluru'),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  guestCount: z.number().int().positive('Guest count must be greater than 0'),
  totalBudget: z.number().positive('Total budget must be greater than 0'),
  currency: z.string().default('INR'),
  style: z.string().min(2, 'Style or vibe is required'),
  dietaryNeeds: z.array(z.string()).default([]),
  accessibilityNeeds: z.array(z.string()).default([]),
  specialRequests: z.string().max(1000).optional().nullable(),
  status: eventStatusEnum.default('planning'),
  isDemo: z.boolean().default(false),
});

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().uuid(),
});

export const createBudgetItemSchema = z.object({
  eventId: z.string().uuid(),
  category: budgetCategoryEnum,
  plannedAmount: z.number().nonnegative(),
  actualAmount: z.number().nonnegative().default(0),
  notes: z.string().max(500).optional().nullable(),
});

export const updateBudgetItemSchema = z.object({
  id: z.string().uuid(),
  plannedAmount: z.number().nonnegative().optional(),
  actualAmount: z.number().nonnegative().optional(),
  notes: z.string().max(500).optional().nullable(),
});

export const createTimelineTaskSchema = z.object({
  eventId: z.string().uuid(),
  title: z.string().min(3).max(150),
  description: z.string().max(1000).optional().nullable(),
  owner: z.string().max(80).default('host'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: taskStatusEnum.default('todo'),
  priority: taskPriorityEnum.default('medium'),
  isAiGenerated: z.boolean().default(false),
});

export const updateTimelineTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(150).optional(),
  description: z.string().max(1000).optional().nullable(),
  owner: z.string().max(80).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
});

export const createVendorSchema = z.object({
  eventId: z.string().uuid(),
  vendorType: z.string().min(2).max(100),
  name: z.string().max(120).optional().nullable(),
  contact: z.string().max(200).optional().nullable(),
  quoteAmount: z.number().nonnegative().optional().nullable(),
  status: vendorStatusEnum.default('shortlisted'),
  bookingDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  questions: z.array(z.string()).default([]),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateVendorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(120).optional().nullable(),
  contact: z.string().max(200).optional().nullable(),
  quoteAmount: z.number().nonnegative().optional().nullable(),
  status: vendorStatusEnum.optional(),
  bookingDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  questions: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional().nullable(),
});

export const createIdeaSchema = z.object({
  eventId: z.string().uuid(),
  kind: ideaKindEnum,
  content: z.record(z.unknown()),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type CreateBudgetItemInput = z.infer<typeof createBudgetItemSchema>;
export type UpdateBudgetItemInput = z.infer<typeof updateBudgetItemSchema>;
export type CreateTimelineTaskInput = z.infer<typeof createTimelineTaskSchema>;
export type UpdateTimelineTaskInput = z.infer<typeof updateTimelineTaskSchema>;
export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
