export type EventType = 'wedding' | 'birthday' | 'community_event';
export type StylePreference = 'budget' | 'balanced' | 'premium';
export type VenueTypePreference = 'indoor' | 'outdoor' | 'hybrid';
export type TaskOwner = 'host' | 'family' | 'vendor' | 'planner';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type BudgetHealthScore = 'healthy' | 'tight' | 'over_budget';

export interface EventPlanningInput {
  eventType: EventType;
  title: string;
  city: string;
  eventDate: string; // YYYY-MM-DD
  guestCount: number;
  totalBudget: number; // in currency units (e.g. INR)
  currency?: string;
  style?: StylePreference;
  venueType?: VenueTypePreference;
  dietaryRequirements?: string[];
  accessibilityRequirements?: string[];
  specialRequests?: string;
  currentDate?: string; // Optional reference date for deterministic testing, defaults to current date
}

export interface BudgetCategoryAllocation {
  category: string;
  displayName: string;
  percentage: number;
  amount: number;
  notes: string;
  isContingency: boolean;
}

export interface CateringFeasibility {
  isFeasible: boolean;
  minRecommendedPerGuest: number;
  actualPerGuest: number;
  warning?: string;
}

export interface BudgetHealthResult {
  score: BudgetHealthScore;
  description: string;
  variance: number;
  contingencyPercentage: number;
  contingencyAmount: number;
}

export interface ComputedBudgetResult {
  totalBudget: number;
  allocations: BudgetCategoryAllocation[];
  contingencyPercentage: number;
  contingencyAmount: number;
  cateringPerGuest: number;
  cateringFeasibility: CateringFeasibility;
  health: BudgetHealthResult;
}

export interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string; // YYYY-MM-DD
  daysBeforeEvent: number;
  owner: TaskOwner;
  isOverdue: boolean;
  isDoNow: boolean;
  dependencies: string[]; // List of prerequisite milestone IDs
  priority: TaskPriority;
}

export interface EstimatedBudgetRange {
  min: number;
  target: number;
  max: number;
}

export interface VendorRecommendation {
  id: string;
  vendorType: string;
  whyNeeded: string;
  bookingDeadline: string; // YYYY-MM-DD
  daysBeforeEvent: number;
  keyQuestions: string[];
  estimatedBudgetRange: EstimatedBudgetRange;
  googleMapsSearchUrl: string;
  isCritical: boolean;
}

export type ConflictType =
  | 'budget_too_low'
  | 'venue_deadline'
  | 'caterer_invitation_order'
  | 'due_date_congestion'
  | 'missing_accessibility'
  | 'outdoor_weather_risk';

export interface FeasibilityConflict {
  id: string;
  type: ConflictType;
  severity: 'warning' | 'critical';
  title: string;
  description: string;
  remediation: string;
}

export interface FeasibilityReport {
  isFeasible: boolean;
  overallScore: number; // 0 to 100
  conflicts: FeasibilityConflict[];
  summary: string;
}

export interface ComputedPlan {
  input: EventPlanningInput;
  budget: ComputedBudgetResult;
  timeline: TimelineMilestone[];
  vendors: VendorRecommendation[];
  feasibility: FeasibilityReport;
  summary: {
    guestCount: number;
    costPerGuest: number;
    daysUntilEvent: number;
    milestoneCount: number;
    vendorCount: number;
  };
}
