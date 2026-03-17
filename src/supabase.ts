import { createClient } from '@supabase/supabase-js';

// Using the keys you provided so you don't have to configure them manually
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://byawcbpsabtyyemazsjk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5YXdjYnBzYWJ0eXllbWF6c2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTMzODYsImV4cCI6MjA4ODYyOTM4Nn0.CCnEGGTgqrJbadLvlBrGI4fo5q2o3M48DcnSGlJFpT0';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
