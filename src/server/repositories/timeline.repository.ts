import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database.types';

export type TimelineTaskRow = Database['public']['Tables']['timeline_tasks']['Row'];
export type TimelineTaskInsert = Database['public']['Tables']['timeline_tasks']['Insert'];
export type TimelineTaskUpdate = Database['public']['Tables']['timeline_tasks']['Update'];

export class TimelineRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async listByEventId(eventId: string): Promise<TimelineTaskRow[]> {
    const { data, error } = await this.supabase
      .from('timeline_tasks')
      .select('*')
      .eq('event_id', eventId)
      .order('due_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to list timeline tasks: ${error.message}`);
    }

    return data || [];
  }

  async create(task: TimelineTaskInsert): Promise<TimelineTaskRow> {
    const { data, error } = await this.supabase
      .from('timeline_tasks')
      .insert(task)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create timeline task: ${error.message}`);
    }

    return data;
  }

  async createBatch(tasks: TimelineTaskInsert[]): Promise<TimelineTaskRow[]> {
    if (tasks.length === 0) return [];

    const { data, error } = await this.supabase
      .from('timeline_tasks')
      .insert(tasks)
      .select();

    if (error) {
      throw new Error(`Failed to create batch timeline tasks: ${error.message}`);
    }

    return data || [];
  }

  async update(id: string, updates: TimelineTaskUpdate): Promise<TimelineTaskRow> {
    const { data, error } = await this.supabase
      .from('timeline_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update timeline task: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('timeline_tasks').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete timeline task: ${error.message}`);
    }

    return true;
  }
}
