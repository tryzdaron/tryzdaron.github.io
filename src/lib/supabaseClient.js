import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mtdhnnossksapmakrdpq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZGhubm9zc2tzYXBtYWtyZHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTYxNTQzNywiZXhwIjoyMTA1MTkxNDM3fQ.1bUQlnutp-C7m3USrAJsEkARBx2dbjHBYnT6YBWgwAI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)