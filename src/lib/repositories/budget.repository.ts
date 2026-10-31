import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

type BudgetItemRow = Database['public']['Tables']['budget_items']['Row'];
type BudgetItemInsert = Database['public']['Tables']['budget_items']['Insert'];
type BudgetItemUpdate = Database['public']['Tables']['budget_items']['Update'];

export class BudgetRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async listByEventId(eventId: string): Promise<BudgetItemRow[]> {
    const { data, error } = await this.supabase
      .from('budget_items')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to list budget items: ${error.message}`);
    }

    return data || [];
  }

  async create(item: BudgetItemInsert): Promise<BudgetItemRow> {
    const { data, error } = await this.supabase
      .from('budget_items')
      .insert(item)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create budget item: ${error.message}`);
    }

    return data;
  }

  async createBatch(items: BudgetItemInsert[]): Promise<BudgetItemRow[]> {
    if (items.length === 0) return [];

    const { data, error } = await this.supabase
      .from('budget_items')
      .insert(items)
      .select();

    if (error) {
      throw new Error(`Failed to create batch budget items: ${error.message}`);
    }

    return data || [];
  }

  async update(id: string, updates: BudgetItemUpdate): Promise<BudgetItemRow> {
    const { data, error } = await this.supabase
      .from('budget_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update budget item: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('budget_items').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete budget item: ${error.message}`);
    }

    return true;
  }
}
