import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xqftqlgwynzgbfhbjkbf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxZnRxbGd3eW56Z2JmaGJqa2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MzAwMzcsImV4cCI6MjA4NjMwNjAzN30.xPAeU8um9b3liw0wrJSdZoBBp1EHMPsWQ-j1eq4ezOE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});
