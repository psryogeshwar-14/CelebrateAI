import type { Schema } from '@google/genai';
import { Type } from '@google/genai';

/**
 * Strict responseJsonSchema for CelebrateAI plan enrichment.
 */
export const planEnrichmentResponseSchema: Schema = {
  type: Type.OBJECT,
  description: 'Personalized creative and culinary recommendations strictly aligned with fixed computed plan.',
  properties: {
    themes: {
      type: Type.ARRAY,
      description: 'Exactly 3 personalized theme concepts.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Theme title' },
          description: { type: Type.STRING, description: 'Vivid aesthetic overview' },
          palette: {
            type: Type.ARRAY,
            description: '4 hex colors or color names',
            items: { type: Type.STRING },
          },
          decor_ideas: {
            type: Type.ARRAY,
            description: '3-4 actionable decor and styling ideas',
            items: { type: Type.STRING },
          },
          signature_moment: { type: Type.STRING, description: 'Memorable experiential focal point' },
        },
        required: ['name', 'description', 'palette', 'decor_ideas', 'signature_moment'],
      },
    },
    menu: {
      type: Type.OBJECT,
      description: 'Regional culinary plan respecting dietary and style constraints.',
      properties: {
        summary: { type: Type.STRING, description: 'Overview of culinary concept' },
        sections: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Section name e.g. Welcome Drinks, Starters, Mains, Desserts' },
              items: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['name', 'items'],
          },
        },
        dietary_notes: {
          type: Type.ARRAY,
          description: 'Segregation notes and dietary compliance confirmations',
          items: { type: Type.STRING },
        },
      },
      required: ['summary', 'sections', 'dietary_notes'],
    },
    risks: {
      type: Type.ARRAY,
      description: 'Realistic risks and actionable contingencies.',
      items: {
        type: Type.OBJECT,
        properties: {
          risk: { type: Type.STRING, description: 'Risk description' },
          impact: { type: Type.STRING, description: 'low, medium, or high' },
          mitigation: { type: Type.STRING, description: 'Concrete backup action' },
        },
        required: ['risk', 'impact', 'mitigation'],
      },
    },
    savings_tips: {
      type: Type.ARRAY,
      description: 'Category-specific savings tips with realistic potential savings percentage (0-30%).',
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: 'Must match an existing computed budget category' },
          percentage: { type: Type.NUMBER, description: 'Realistic savings percentage estimate between 0 and 30' },
          advice: { type: Type.STRING, description: 'Practical trade-off or procurement hack' },
        },
        required: ['category', 'percentage', 'advice'],
      },
    },
    personal_tasks: {
      type: Type.ARRAY,
      description: '2-4 thoughtful personal milestones tailored to cultural or style nuances.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Actionable milestone title' },
          reason: { type: Type.STRING, description: 'Why this milestone matters' },
          suggested_offset_days: {
            type: Type.INTEGER,
            description: 'Days before event day (e.g. 14 for 14 days before)',
          },
        },
        required: ['title', 'reason', 'suggested_offset_days'],
      },
    },
    run_sheet: {
      type: Type.ARRAY,
      description: 'Chronological day-of itinerary sequence.',
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING, description: 'e.g. 07:30 AM or 06:00 PM' },
          activity: { type: Type.STRING, description: 'Activity description' },
          owner: { type: Type.STRING, description: 'Responsible role or lead person' },
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
