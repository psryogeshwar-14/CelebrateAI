import { ComputedPlan } from '@/lib/engine/types';
import { geminiService } from './services/gemini.service';
import { recommendationService, sanitizeText } from './services/recommendation.service';
import { ValidatedEnrichmentOutput, AssistantChatReply, GeminiServiceOptions } from './types';

// Adapters
export * from './adapters/gemini-client';

// Services
export * from './services/gemini.service';
export * from './services/recommendation.service';

// Schemas
export * from './schemas/recommendation.schema';

// Prompts
export * from './prompts/event-planner.prompt';
export * from './prompts/replan.prompt';
export * from './prompts/assistant.prompt';

// Types
export * from './types';

// UI Components
export * from './components/ColorPaletteSwatch';
export * from './components/ThemeCard';
export * from './components/BanquetMenuSection';
export * from './components/RiskMitigationTable';
export * from './components/IdeasFeature';
export * from './components/AssistantFeature';

// ============================================================================
// Top-Level Convenience Helpers & Backward-Compatible Wrappers
// ============================================================================

export async function generatePlanEnrichment(
  plan: ComputedPlan,
  options?: GeminiServiceOptions
): Promise<ValidatedEnrichmentOutput> {
  return geminiService.generateEnrichment(plan, options);
}

export async function generateGroundedAssistantReply(
  plan: ComputedPlan,
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<AssistantChatReply> {
  return geminiService.generateAssistantReply(plan, message, history);
}

export function checkRateLimit(identifier: string) {
  return geminiService.checkRateLimit(identifier);
}

export function clearEnrichmentCache(): void {
  geminiService.clearCache();
}

export function validateAndMergeEnrichment(rawJson: unknown, plan: ComputedPlan): ValidatedEnrichmentOutput {
  return recommendationService.validateAndMerge(rawJson, plan);
}

export function getOfflineFallbackEnrichment(plan: ComputedPlan): ValidatedEnrichmentOutput {
  return recommendationService.getOfflineFallback(plan);
}

export { sanitizeText };
