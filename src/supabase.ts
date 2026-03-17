import { createClient } from '@supabase/supabase-js';

// Using the keys you provided so you don't have to configure them manually
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://byawcbpsabtyyemazsjk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qJLpmayAi1odZkQi2joA_A_dNV4MIyL';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
