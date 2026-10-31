import {
  EventTypeEnum,
  EventStatusEnum,
  BudgetCategoryEnum,
  TaskStatusEnum,
  TaskPriorityEnum,
  VendorStatusEnum,
  IdeaKindEnum,
} from './database.types';
import {
  ThemeIdeaContent,
  MenuIdeaContent,
  RiskIdeaContent,
  RunSheetIdeaContent,
  SavingTipIdeaContent,
} from '../validations/schemas';

export interface EventModel {
  id: string;
  userId: string | null;
  eventType: EventTypeEnum;
  title: string;
  city: string;
  eventDate: string; // YYYY-MM-DD
  guestCount: number;
  totalBudget: number;
  currency: string;
  style: string;
  dietaryNeeds: string[];
  accessibilityNeeds: string[];
  specialRequests: string | null;
  status: EventStatusEnum;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItemModel {
  id: string;
  eventId: string;
  category: BudgetCategoryEnum;
  plannedAmount: number;
  actualAmount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineTaskModel {
  id: string;
  eventId: string;
  title: string;
  description: string | null;
  owner: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  dependencyTaskId: string | null;
  isAiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorModel {
  id: string;
  eventId: string;
  vendorType: string;
  name: string | null;
  contact: string | null;
  quoteAmount: number | null;
  status: VendorStatusEnum;
  bookingDeadline: string; // YYYY-MM-DD
  questions: string[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaModel {
  id: string;
  eventId: string;
  kind: IdeaKindEnum;
  content:
    | ThemeIdeaContent
    | MenuIdeaContent
    | RiskIdeaContent
    | RunSheetIdeaContent
    | SavingTipIdeaContent
    | Record<string, any>;
  createdAt: string;
}

export interface BudgetHealthResult {
  totalBudget: number;
  totalPlanned: number;
  totalActual: number;
  remainingPlannedBuffer: number;
  remainingActualBuffer: number;
  variance: number;
  status: 'healthy' | 'caution' | 'critical';
  warningMessage: string | null;
  spentPercentage: number;
  allocatedPercentage: number;
}

export interface ProgressResult {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionPercentage: number;
  isHealthy: boolean;
}

export interface FullEventAggregate {
  event: EventModel;
  budgetItems: BudgetItemModel[];
  timelineTasks: TimelineTaskModel[];
  vendors: VendorModel[];
  ideas: {
    themes?: ThemeIdeaContent;
    menu?: MenuIdeaContent;
    risks?: RiskIdeaContent;
    runSheet?: RunSheetIdeaContent;
    savingTips?: SavingTipIdeaContent;
  };
  budgetHealth: BudgetHealthResult;
  progress: ProgressResult;
}
