import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

export function createAdminSupabaseClient() {
  if (typeof window !== 'undefined') {
    throw new Error(
      'CRITICAL SECURITY VIOLATION: Supabase service-role client was attempted in browser environment!'
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
