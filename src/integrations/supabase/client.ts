
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jbhiichhwwfaujicscsf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiaGlpY2hod3dmYXVqaWNzY3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjM0NjEsImV4cCI6MjA1ODE5OTQ2MX0.khOo7P4tIZmNazxsXSSb2-6cykPL4jyH8TIZXFImSb0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined
  }
});

// Custom type for profile data that we use in our application
export type ProfileType = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  company_name: string | null;
  is_agency: string | null;
  created_at: string;
  updated_at: string;
};
