import { Type, Schema } from '@google/genai';
import { z } from 'zod';

// ============================================================================
// Google Gemini SDK Strict Response Schemas
// ============================================================================

/**
 * Strict responseJsonSchema for CelebrateAI plan creative & culinary recommendations.
 * Every field has a descriptive directive and bounded structural properties.
 */
export const planEnrichmentResponseSchema: Schema = {
  type: Type.OBJECT,
  description: 'Personalized creative and culinary recommendations strictly aligned with the fixed computed event plan.',
  properties: {
    themes: {
      type: Type.ARRAY,
      description: 'Exactly 3 cohesive, distinct themes tailored to event city and style.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Creative theme title' },
          description: { type: Type.STRING, description: 'Vivid aesthetic overview and styling narrative' },
          palette: {
            type: Type.ARRAY,
            description: 'Exactly 4 cohesive hex colors or color names',
            items: { type: Type.STRING },
          },
          decor_ideas: {
            type: Type.ARRAY,
            description: '3 to 4 actionable decor, floral, and ambient styling ideas',
            items: { type: Type.STRING },
          },
          signature_moment: { type: Type.STRING, description: 'Memorable experiential focal point for guests' },
        },
        required: ['name', 'description', 'palette', 'decor_ideas', 'signature_moment'],
      },
    },
    menu: {
      type: Type.OBJECT,
      description: 'Regional culinary plan respecting dietary and style constraints.',
      properties: {
        summary: { type: Type.STRING, description: 'Overview of culinary concept and service style' },
        sections: {
          type: Type.ARRAY,
          description: 'Curated menu courses (e.g. Welcome Drinks, Starters, Mains, Desserts)',
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Course or section title' },
              items: {
                type: Type.ARRAY,
                description: 'List of specific regional food or beverage items',
                items: { type: Type.STRING },
              },
            },
            required: ['name', 'items'],
          },
        },
        dietary_notes: {
          type: Type.ARRAY,
          description: 'Kitchen segregation, allergen warnings, and compliance confirmations',
          items: { type: Type.STRING },
        },
      },
      required: ['summary', 'sections', 'dietary_notes'],
    },
    risks: {
      type: Type.ARRAY,
      description: 'Realistic logistical and environmental risks with concrete contingency plans.',
      items: {
        type: Type.OBJECT,
        properties: {
          risk: { type: Type.STRING, description: 'Specific failure mode or hazard' },
          impact: {
            type: Type.STRING,
            description: 'Severity level: low, medium, or high',
          },
          mitigation: { type: Type.STRING, description: 'Actionable preventive measure or backup protocol' },
        },
        required: ['risk', 'impact', 'mitigation'],
      },
    },
    savings_tips: {
      type: Type.ARRAY,
      description: 'Category-specific savings tips mapped to computed budget categories.',
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: 'Exact matching computed budget category key' },
          percentage: { type: Type.NUMBER, description: 'Realistic savings percentage estimate between 0 and 30' },
          advice: { type: Type.STRING, description: 'Practical trade-off, procurement hack, or timing optimization' },
        },
        required: ['category', 'percentage', 'advice'],
      },
    },
    personal_tasks: {
      type: Type.ARRAY,
      description: '2 to 4 thoughtful personal preparation milestones.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Actionable personal milestone title' },
          reason: { type: Type.STRING, description: 'Why this milestone is crucial for host readiness' },
          suggested_offset_days: {
            type: Type.INTEGER,
            description: 'Positive integer of days before event day (e.g. 14 for 14 days prior)',
          },
        },
        required: ['title', 'reason', 'suggested_offset_days'],
      },
    },
    run_sheet: {
      type: Type.ARRAY,
      description: 'Chronological event-day itinerary sequence.',
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING, description: 'Clock time e.g. 09:00 AM or 07:30 PM' },
          activity: { type: Type.STRING, description: 'Detailed itinerary activity' },
          owner: { type: Type.STRING, description: 'Responsible lead person, vendor, or coordinator' },
        },
        required: ['time', 'activity', 'owner'],
      },
    },
  },
  required: ['themes', 'menu', 'risks', 'savings_tips', 'personal_tasks', 'run_sheet'],
};

/**
 * Strict responseJsonSchema for Grounded Assistant Chat.
 */
export const assistantChatResponseSchema: Schema = {
  type: Type.OBJECT,
  description: 'Grounded assistant answer strictly based on event plan context with suggested follow-up questions.',
  properties: {
    answer: {
      type: Type.STRING,
      description: 'Direct, helpful answer strictly grounded in the user event plan.',
    },
    suggestedQuestions: {
      type: Type.ARRAY,
      description: 'Exactly 3 relevant follow-up questions the user might ask next.',
      items: { type: Type.STRING },
    },
    citations: {
      type: Type.ARRAY,
      description: 'Referenced budget lines, milestones, or vendor categories.',
      items: { type: Type.STRING },
    },
  },
  required: ['answer', 'suggestedQuestions'],
};

// ============================================================================
// Post-Response Zod Validation Schemas (Strict Safety & Bounds)
// ============================================================================

export const rawThemeZodSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(800),
  palette: z.array(z.string().min(1).max(50)).min(3).max(6),
  decor_ideas: z.array(z.string().min(1).max(300)).min(2).max(8),
  signature_moment: z.string().min(1).max(500),
});

export const rawMenuSectionZodSchema = z.object({
  name: z.string().min(1).max(80),
  items: z.array(z.string().min(1).max(200)).min(1).max(15),
});

export const rawMenuZodSchema = z.object({
  summary: z.string().min(1).max(600),
  sections: z.array(rawMenuSectionZodSchema).min(1).max(8),
  dietary_notes: z.array(z.string().min(1).max(300)).max(10).default([]),
});

export const rawRiskZodSchema = z.object({
  risk: z.string().min(1).max(300),
  impact: z.string().min(1).max(50),
  mitigation: z.string().min(1).max(500),
});

export const rawSavingsTipZodSchema = z.object({
  category: z.string().min(1).max(80),
  percentage: z.number(),
  advice: z.string().min(1).max(500),
});

export const rawPersonalTaskZodSchema = z.object({
  title: z.string().min(1).max(150),
  reason: z.string().min(1).max(400),
  suggested_offset_days: z.number().int(),
});

export const rawRunSheetZodSchema = z.object({
  time: z.string().min(1).max(50),
  activity: z.string().min(1).max(250),
  owner: z.string().min(1).max(80),
});

export const rawPlanEnrichmentZodSchema = z.object({
  themes: z.array(rawThemeZodSchema).min(1).max(5),
  menu: rawMenuZodSchema,
  risks: z.array(rawRiskZodSchema).min(1).max(8),
  savings_tips: z.array(rawSavingsTipZodSchema).min(1).max(10),
  personal_tasks: z.array(rawPersonalTaskZodSchema).min(1).max(6),
  run_sheet: z.array(rawRunSheetZodSchema).min(3).max(20),
});

export type RawPlanEnrichment = z.infer<typeof rawPlanEnrichmentZodSchema>;

export const assistantChatZodSchema = z.object({
  answer: z.string().min(1),
  suggestedQuestions: z.array(z.string().min(1).max(200)).min(1).max(5),
  citations: z.array(z.string().min(1).max(100)).optional().default([]),
});

export type RawAssistantChatOutput = z.infer<typeof assistantChatZodSchema>;
