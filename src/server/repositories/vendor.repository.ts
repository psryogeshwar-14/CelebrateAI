import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database.types';

export type VendorRow = Database['public']['Tables']['vendors']['Row'];
export type VendorInsert = Database['public']['Tables']['vendors']['Insert'];
export type VendorUpdate = Database['public']['Tables']['vendors']['Update'];

export class VendorRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async listByEventId(eventId: string): Promise<VendorRow[]> {
    const { data, error } = await this.supabase
      .from('vendors')
      .select('*')
      .eq('event_id', eventId)
      .order('booking_deadline', { ascending: true });

    if (error) {
      throw new Error(`Failed to list vendors: ${error.message}`);
    }

    return data || [];
  }

  async create(vendor: VendorInsert): Promise<VendorRow> {
    const { data, error } = await this.supabase
      .from('vendors')
      .insert(vendor)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create vendor: ${error.message}`);
    }

    return data;
  }

  async createBatch(vendors: VendorInsert[]): Promise<VendorRow[]> {
    if (vendors.length === 0) return [];

    const { data, error } = await this.supabase
      .from('vendors')
      .insert(vendors)
      .select();

    if (error) {
      throw new Error(`Failed to create batch vendors: ${error.message}`);
    }

    return data || [];
  }

  async update(id: string, updates: VendorUpdate): Promise<VendorRow> {
    const { data, error } = await this.supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update vendor: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('vendors').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete vendor: ${error.message}`);
    }

    return true;
  }
}
