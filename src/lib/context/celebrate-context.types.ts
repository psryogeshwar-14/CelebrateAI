import type { ComputedPlan, EventPlanningInput, EventType } from '../engine/types';
import type { ValidatedEnrichmentOutput } from '../ai/validate';

export interface VendorOverride {
  status: string;
  quoteAmount?: number;
  notes?: string;
}

export interface CelebrateContextType {
  plan: ComputedPlan | null;
  aiEnrichment: ValidatedEnrichmentOutput | null;
  isLoading: boolean;
  error: string | null;
  completedTaskIds: string[];
  actualSpends: Record<string, number>;
  vendorOverrides: Record<string, VendorOverride>;
  isDarkMode: boolean;
  activeDemoId: string | null;
  toggleTheme: () => void;
  loadDemoEvent: (demoType: EventType) => void;
  setPlan: (plan: ComputedPlan, ai?: ValidatedEnrichmentOutput) => void;
  toggleTask: (taskId: string) => void;
  updateCategoryActualSpend: (category: string, amount: number) => void;
  updateVendor: (vendorId: string, updates: VendorOverride) => void;
  replanEvent: (updates: Partial<EventPlanningInput>) => Promise<void>;
}
