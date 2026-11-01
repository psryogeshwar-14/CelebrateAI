import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database.types';
import { logger } from '@/shared/lib/logger';

export function createClientSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    logger.warn('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Running in fallback mode.', undefined, 'supabase-client');
    return null;
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
