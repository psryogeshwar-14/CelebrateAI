import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database.types';

export function createAdminSupabaseClient() {
  if (typeof window !== 'undefined') {
    throw new Error(
      'CRITICAL SECURITY VIOLATION: Supabase service-role client was attempted in browser environment!'
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
