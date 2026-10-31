export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type EventTypeEnum = 'wedding' | 'birthday' | 'community_event';
export type EventStatusEnum = 'draft' | 'planning' | 'confirmed' | 'completed';
export type BudgetCategoryEnum =
  | 'venue'
  | 'catering'
  | 'decor'
  | 'photography'
  | 'entertainment'
  | 'apparel_makeup'
  | 'invitations_favors'
  | 'logistics_permits'
  | 'contingency';
export type TaskStatusEnum = 'todo' | 'in_progress' | 'done' | 'overdue';
export type TaskPriorityEnum = 'low' | 'medium' | 'high' | 'critical';
export type VendorStatusEnum =
  | 'shortlisted'
  | 'contacted'
  | 'quoted'
  | 'booked'
  | 'cancelled';
export type IdeaKindEnum = 'theme' | 'menu' | 'risk' | 'run_sheet' | 'saving_tip';
