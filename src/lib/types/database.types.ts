import type {
  Json,
  EventTypeEnum,
  EventStatusEnum,
  BudgetCategoryEnum,
  TaskStatusEnum,
  TaskPriorityEnum,
  VendorStatusEnum,
  IdeaKindEnum,
} from './database-enums';

export * from './database-enums';




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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      event_type_enum: EventTypeEnum;
      event_status_enum: EventStatusEnum;
      budget_category_enum: BudgetCategoryEnum;
      task_status_enum: TaskStatusEnum;
      task_priority_enum: TaskPriorityEnum;
      vendor_status_enum: VendorStatusEnum;
      idea_kind_enum: IdeaKindEnum;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
