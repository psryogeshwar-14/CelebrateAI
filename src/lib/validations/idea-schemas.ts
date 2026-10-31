import { z } from 'zod';
import { budgetCategoryEnum } from './enums';

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

export type ThemeConceptItem = z.infer<typeof themeConceptItemSchema>;
export type ThemeIdeaContent = z.infer<typeof themeIdeaSchema>;
export type MenuIdeaContent = z.infer<typeof menuIdeaSchema>;
export type RiskIdeaContent = z.infer<typeof riskIdeaSchema>;
export type RunSheetIdeaContent = z.infer<typeof runSheetIdeaSchema>;
export type SavingTipIdeaContent = z.infer<typeof savingTipIdeaSchema>;
export type AIEnrichmentOutput = z.infer<typeof aiEnrichmentOutputSchema>;
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
