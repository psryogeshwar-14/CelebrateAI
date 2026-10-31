import { SupabaseClient } from '@supabase/supabase-js';
import { Database, IdeaKindEnum } from '../types/database.types';

type IdeaRow = Database['public']['Tables']['ideas']['Row'];
type IdeaInsert = Database['public']['Tables']['ideas']['Insert'];

export class IdeaRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async listByEventId(eventId: string): Promise<IdeaRow[]> {
    const { data, error } = await this.supabase
      .from('ideas')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to list ideas: ${error.message}`);
    }

    return data || [];
  }

  async getByKind(eventId: string, kind: IdeaKindEnum): Promise<IdeaRow | null> {
    const { data, error } = await this.supabase
      .from('ideas')
      .select('*')
      .eq('event_id', eventId)
      .eq('kind', kind)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to get idea of kind ${kind}: ${error.message}`);
    }

    return data;
  }

  async create(idea: IdeaInsert): Promise<IdeaRow> {
    const { data, error } = await this.supabase
      .from('ideas')
      .insert(idea)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create idea: ${error.message}`);
    }

    return data;
  }

  async createBatch(ideas: IdeaInsert[]): Promise<IdeaRow[]> {
    if (ideas.length === 0) return [];

    const { data, error } = await this.supabase
      .from('ideas')
      .insert(ideas)
      .select();

    if (error) {
      throw new Error(`Failed to save batch ideas: ${error.message}`);
    }

    return data || [];
  }

  async deleteForEvent(eventId: string): Promise<boolean> {
    const { error } = await this.supabase.from('ideas').delete().eq('event_id', eventId);

    if (error) {
      throw new Error(`Failed to delete ideas for event: ${error.message}`);
    }

    return true;
  }
}
