import type { EventPlanningInput, ComputedPlan } from '@/lib/engine/types';
import type { FullEventAggregate, EventModel } from '@/lib/types/models';

export type { EventPlanningInput, ComputedPlan, FullEventAggregate, EventModel };

export interface WizardFormState {
  currentStep: number;
  eventType: 'wedding' | 'birthday' | 'community_event';
  title: string;
  city: string;
  eventDate: string;
  guestCount: number;
  totalBudget: number;
  budgetDisplay: string;
  style: 'budget' | 'balanced' | 'premium';
  venueType: 'indoor' | 'outdoor';
  selectedDietary: string[];
  selectedAccessibility: string[];
  specialRequests: string;
  isSubmitting: boolean;
  formErrors: Record<string, string>;
}
