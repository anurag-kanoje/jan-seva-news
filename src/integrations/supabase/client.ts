import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qltedcfuztowideidlrh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsdGVkY2Z1enRvd2lkZWlkbHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTYyNjAsImV4cCI6MjA4NjI5MjI2MH0.-ncrflDZ_QtIT6vrZVTGPzxVFLJDZXaa0NLwuPYCqDc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});
