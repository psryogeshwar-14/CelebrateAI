import { ComputedPlan } from '@/lib/engine/types';

// ============================================================================
// AI Domain Recommendation Types
// ============================================================================

export interface ThemeRecommendation {
  name: string;
  description: string;
  palette: string[];
  decorIdeas: string[];
  signatureMoment: string;
}

export interface MenuSection {
  name: string;
  items: string[];
}

export interface MenuRecommendation {
  summary: string;
  sections: MenuSection[];
  dietaryNotes: string[];
}

export type RiskImpactLevel = 'low' | 'medium' | 'high';

export interface RiskMitigation {
  risk: string;
  impact: RiskImpactLevel;
  mitigation: string;
}

export interface SavingsTipRecommendation {
  category: string;
  categoryDisplayName: string;
  percentage: number;
  calculatedSavingsAmount: number;
  advice: string;
}

export type ValidatedSavingsTip = SavingsTipRecommendation;

export interface PersonalTaskRecommendation {
  id: string;
  title: string;
  reason: string;
  suggestedOffsetDays: number;
  calculatedDueDate: string;
  isOverdue: boolean;
}

export type ValidatedPersonalTask = PersonalTaskRecommendation;

export interface RunSheetItem {
  time: string;
  activity: string;
  owner: string;
}

export interface ValidatedEnrichmentOutput {
  isAIOffline: boolean;
  aiStatus: string;
  generatedAt: string;
  themes: ThemeRecommendation[];
  menu: MenuRecommendation;
  risks: RiskMitigation[];
  savingsTips: SavingsTipRecommendation[];
  personalTasks: PersonalTaskRecommendation[];
  runSheet: RunSheetItem[];
}

export type PlanEnrichmentResult = ValidatedEnrichmentOutput;

export interface AssistantChatReply {
  answer: string;
  suggestedQuestions: string[];
  citations: string[];
  isAIOffline: boolean;
}

export type AssistantReplyResult = AssistantChatReply;

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  retryAfterSec?: number;
}

// ============================================================================
// Adapter Interfaces & Execution Options
// ============================================================================

export interface GeminiGenerateOptions {
  contents: string | Array<{ role: string; parts: Array<{ text: string }> }>;
  systemInstruction?: string;
  responseSchema?: unknown;
  timeoutMs?: number;
}

export interface GeminiResponse {
  text: string;
}

export interface IGeminiClientAdapter {
  isAvailable(): boolean;
  generateContent(options: GeminiGenerateOptions): Promise<GeminiResponse>;
}

export interface GeminiServiceOptions {
  bypassCache?: boolean;
  userIdentifier?: string;
  isReplan?: boolean;
  changesSummary?: string;
}
