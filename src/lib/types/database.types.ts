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

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          user_id: string | null;
          event_type: EventTypeEnum;
          title: string;
          city: string;
          event_date: string;
          guest_count: number;
          total_budget: number;
          currency: string;
          style: string;
          dietary_needs: string[];
          accessibility_needs: string[];
          special_requests: string | null;
          status: EventStatusEnum;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_type: EventTypeEnum;
          title: string;
          city?: string;
          event_date: string;
          guest_count: number;
          total_budget: number;
          currency?: string;
          style: string;
          dietary_needs?: string[];
          accessibility_needs?: string[];
          special_requests?: string | null;
          status?: EventStatusEnum;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          event_type?: EventTypeEnum;
          title?: string;
          city?: string;
          event_date?: string;
          guest_count?: number;
          total_budget?: number;
          currency?: string;
          style?: string;
          dietary_needs?: string[];
          accessibility_needs?: string[];
          special_requests?: string | null;
          status?: EventStatusEnum;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      budget_items: {
        Row: {
          id: string;
          event_id: string;
          category: BudgetCategoryEnum;
          planned_amount: number;
          actual_amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          category: BudgetCategoryEnum;
          planned_amount: number;
          actual_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          category?: BudgetCategoryEnum;
          planned_amount?: number;
          actual_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      timeline_tasks: {
        Row: {
          id: string;
          event_id: string;
          title: string;
          description: string | null;
          owner: string;
          due_date: string;
          status: TaskStatusEnum;
          priority: TaskPriorityEnum;
          dependency_task_id: string | null;
          is_ai_generated: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          title: string;
          description?: string | null;
          owner?: string;
          due_date: string;
          status?: TaskStatusEnum;
          priority?: TaskPriorityEnum;
          dependency_task_id?: string | null;
          is_ai_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          title?: string;
          description?: string | null;
          owner?: string;
          due_date?: string;
          status?: TaskStatusEnum;
          priority?: TaskPriorityEnum;
          dependency_task_id?: string | null;
          is_ai_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      vendors: {
        Row: {
          id: string;
          event_id: string;
          vendor_type: string;
          name: string | null;
          contact: string | null;
          quote_amount: number | null;
          status: VendorStatusEnum;
          booking_deadline: string;
          questions: string[];
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          vendor_type: string;
          name?: string | null;
          contact?: string | null;
          quote_amount?: number | null;
          status?: VendorStatusEnum;
          booking_deadline: string;
          questions?: string[];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          vendor_type?: string;
          name?: string | null;
          contact?: string | null;
          quote_amount?: number | null;
          status?: VendorStatusEnum;
          booking_deadline?: string;
          questions?: string[];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ideas: {
        Row: {
          id: string;
          event_id: string;
          kind: IdeaKindEnum;
          content: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          kind: IdeaKindEnum;
          content: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          kind?: IdeaKindEnum;
          content?: Json;
          created_at?: string;
        };
      };
    };
  };
}
