import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

type EventRow = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

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
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }

    return data;
  }

  async update(id: string, updates: EventUpdate, userId?: string): Promise<EventRow> {
    let query = this.supabase.from('events').update(updates).eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.select().single();
    if (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }

    return data;
  }

  async delete(id: string, userId?: string): Promise<boolean> {
    let query = this.supabase.from('events').delete().eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { error } = await query;
    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }

    return true;
  }
}
