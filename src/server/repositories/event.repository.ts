import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database.types';

export type EventRow = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

export class EventRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async findById(id: string): Promise<EventRow | null> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to find event: ${error.message}`);
    }

    return data;
  }

  async listForUser(userId: string | null, includeDemo = true): Promise<EventRow[]> {
    let query = this.supabase.from('events').select('*').order('event_date', { ascending: true });

    if (userId) {
      if (includeDemo) {
        query = query.or(`user_id.eq.${userId},is_demo.eq.true`);
      } else {
        query = query.eq('user_id', userId);
      }
    } else if (includeDemo) {
      query = query.eq('is_demo', true);
    } else {
      return [];
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to list events: ${error.message}`);
    }

    return data || [];
  }

  async create(event: EventInsert): Promise<EventRow> {
    const { data, error } = await this.supabase
      .from('events')
      .insert(event)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }

    return data;
  }

  async update(id: string, updates: EventUpdate): Promise<EventRow> {
    const { data, error } = await this.supabase
      .from('events')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('events').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }

  async getDemoEvents(): Promise<EventRow[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('is_demo', true)
      .order('event_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to load demo events: ${error.message}`);
    }

    return data || [];
  }
}
