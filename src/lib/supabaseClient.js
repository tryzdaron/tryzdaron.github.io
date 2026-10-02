import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mtdhnnossksapmakrdpq.supabase.co'
const supabaseAnonKey = 'sb_publishable_94RsGEHN5A0rAQSdGKqGmw__9T01s-J'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)