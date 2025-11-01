import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create supabase client without strict typing to avoid build issues
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
