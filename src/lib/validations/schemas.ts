import { z } from 'zod';

// ============================================================================
// Enums and Primitives
// ============================================================================

export const eventTypeEnum = z.enum(['wedding', 'birthday', 'community_event']);
export const eventStatusEnum = z.enum(['draft', 'planning', 'confirmed', 'completed']);
export const budgetCategoryEnum = z.enum([
  'venue',
  'catering',
  'decor',
  'photography',
  'entertainment',
  'apparel_makeup',
  'invitations_favors',
  'logistics_permits',
  'contingency',
]);
export const taskStatusEnum = z.enum(['todo', 'in_progress', 'done', 'overdue']);
export const taskPriorityEnum = z.enum(['low', 'medium', 'high', 'critical']);
export const vendorStatusEnum = z.enum([
  'shortlisted',
  'contacted',
  'quoted',
  'booked',
  'cancelled',
]);
export const ideaKindEnum = z.enum(['theme', 'menu', 'risk', 'run_sheet', 'saving_tip']);

// ============================================================================
// Event Input Schemas
// ============================================================================

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

// ============================================================================
// Budget Item Schemas
// ============================================================================

export const createBudgetItemSchema = z.object({
  eventId: z.string().uuid(),
  category: budgetCategoryEnum,
  plannedAmount: z.number().nonnegative('Planned amount cannot be negative'),
  actualAmount: z.number().nonnegative('Actual amount cannot be negative').default(0),
  notes: z.string().max(500).optional().nullable(),
});

export const updateBudgetItemSchema = z.object({
  id: z.string().uuid(),
  plannedAmount: z.number().nonnegative().optional(),
  actualAmount: z.number().nonnegative().optional(),
  notes: z.string().max(500).optional().nullable(),
});

// ============================================================================
// Timeline Task Schemas
// ============================================================================

export const createTimelineTaskSchema = z.object({
  eventId: z.string().uuid(),
  title: z.string().min(2, 'Task title is required').max(200),
  description: z.string().max(1000).optional().nullable(),
  owner: z.string().min(2, 'Owner role or name is required').default('Host'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be YYYY-MM-DD'),
  status: taskStatusEnum.default('todo'),
  priority: taskPriorityEnum.default('medium'),
  dependencyTaskId: z.string().uuid().optional().nullable(),
  isAiGenerated: z.boolean().default(false),
});

export const updateTimelineTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  owner: z.string().min(2).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  dependencyTaskId: z.string().uuid().optional().nullable(),
});

// ============================================================================
// Vendor Schemas
// ============================================================================

export const createVendorSchema = z.object({
  eventId: z.string().uuid(),
  vendorType: z.string().min(2, 'Vendor category/type is required'),
  name: z.string().max(120).optional().nullable(),
  contact: z.string().max(200).optional().nullable(),
  quoteAmount: z.number().nonnegative().optional().nullable(),
  status: vendorStatusEnum.default('shortlisted'),
  bookingDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Booking deadline must be YYYY-MM-DD'),
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

// ============================================================================
// Ideas Schemas
// ============================================================================

export const createIdeaSchema = z.object({
  eventId: z.string().uuid(),
  kind: ideaKindEnum,
  content: z.record(z.unknown()),
});

// ============================================================================
// AI Structured Output Schemas (Validated when Gemini returns content)
// ============================================================================

export const colorPaletteItemSchema = z.object({
  hex: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Must be a valid hex color code'),
  name: z.string().min(1),
});

export const themeConceptItemSchema = z.object({
  title: z.string().min(3),
  tagline: z.string().min(5),
  colorPalette: z.array(colorPaletteItemSchema).min(3).max(5),
  decorElements: z.array(z.string()).min(2),
  ambianceAndVibe: z.string().min(10),
  signatureMoment: z.string().min(10),
});

export const themeIdeaSchema = z.object({
  concepts: z.array(themeConceptItemSchema).length(3, 'Exactly 3 theme concepts are required'),
});

export const menuItemSchema = z.object({
  dishName: z.string().min(2),
  description: z.string().min(5),
  dietaryTags: z.array(z.string()),
});

export const signatureDrinkSchema = z.object({
  cocktail: z.string().min(2),
  mocktailAlternative: z.string().min(2),
  notes: z.string().min(5),
});

export const menuIdeaSchema = z.object({
  cuisineStyle: z.string().min(3),
  welcomeDrinks: z.array(signatureDrinkSchema).min(1),
  appetizers: z.array(menuItemSchema).min(2),
  mains: z.array(menuItemSchema).min(2),
  desserts: z.array(menuItemSchema).min(1),
  dietaryComplianceNotes: z.string().min(10),
});

export const riskItemSchema = z.object({
  category: z.string().min(2),
  riskDescription: z.string().min(5),
  severity: z.enum(['low', 'medium', 'high']),
  probability: z.enum(['low', 'medium', 'high']),
  contingencyPlan: z.string().min(10),
});

export const riskIdeaSchema = z.object({
  risks: z.array(riskItemSchema).min(3),
});

export const runSheetItemSchema = z.object({
  timeSlot: z.string().min(3),
  activity: z.string().min(3),
  location: z.string().optional().nullable(),
  leadPerson: z.string().min(2),
  notes: z.string().optional().nullable(),
});

export const runSheetIdeaSchema = z.object({
  itinerary: z.array(runSheetItemSchema).min(4),
});

export const savingTipItemSchema = z.object({
  category: budgetCategoryEnum,
  practicalTip: z.string().min(10),
  tradeOffToAvoid: z.string().min(10),
});

export const savingTipIdeaSchema = z.object({
  tips: z.array(savingTipItemSchema).min(3),
});

export const aiEnrichmentOutputSchema = z.object({
  themes: themeIdeaSchema,
  menu: menuIdeaSchema,
  risks: riskIdeaSchema,
  runSheet: runSheetIdeaSchema,
  savingTips: savingTipIdeaSchema,
});

// Grounded Chat Schemas
export const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

// ============================================================================
// Inferred TypeScript Types
// ============================================================================

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type CreateBudgetItemInput = z.infer<typeof createBudgetItemSchema>;
export type UpdateBudgetItemInput = z.infer<typeof updateBudgetItemSchema>;
export type CreateTimelineTaskInput = z.infer<typeof createTimelineTaskSchema>;
export type UpdateTimelineTaskInput = z.infer<typeof updateTimelineTaskSchema>;
export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;

export type ThemeConceptItem = z.infer<typeof themeConceptItemSchema>;
export type ThemeIdeaContent = z.infer<typeof themeIdeaSchema>;
export type MenuIdeaContent = z.infer<typeof menuIdeaSchema>;
export type RiskIdeaContent = z.infer<typeof riskIdeaSchema>;
export type RunSheetIdeaContent = z.infer<typeof runSheetIdeaSchema>;
export type SavingTipIdeaContent = z.infer<typeof savingTipIdeaSchema>;
export type AIEnrichmentOutput = z.infer<typeof aiEnrichmentOutputSchema>;
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
