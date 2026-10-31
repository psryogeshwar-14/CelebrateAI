import { Json } from '@/lib/types/database.types';

export interface SeedEventBundle {
  event: {
    id: string;
    event_type: 'wedding' | 'birthday' | 'community_event';
    title: string;
    city: string;
    event_date: string;
    guest_count: number;
    total_budget: number;
    currency: string;
    style: string;
    dietary_needs: string[];
    accessibility_needs: string[];
    special_requests: string;
    status: 'draft' | 'planning' | 'confirmed' | 'completed';
    is_demo: boolean;
  };
  budgetItems: Array<{
    category:
      | 'venue'
      | 'catering'
      | 'decor'
      | 'photography'
      | 'entertainment'
      | 'apparel_makeup'
      | 'invitations_favors'
      | 'logistics_permits'
      | 'contingency';
    planned_amount: number;
    actual_amount: number;
    notes: string;
  }>;
  timelineTasks: Array<{
    title: string;
    description: string;
    owner: string;
    due_date: string;
    status: 'todo' | 'in_progress' | 'done' | 'overdue';
    priority: 'low' | 'medium' | 'high' | 'critical';
    is_ai_generated: boolean;
  }>;
  vendors: Array<{
    vendor_type: string;
    name: string;
    contact: string;
    quote_amount: number;
    status: 'shortlisted' | 'contacted' | 'quoted' | 'booked' | 'cancelled';
    booking_deadline: string;
    questions: string[];
    notes: string;
  }>;
  ideas: Array<{
    kind: 'theme' | 'menu' | 'risk' | 'run_sheet' | 'saving_tip';
    content: Json;
  }>;
}

