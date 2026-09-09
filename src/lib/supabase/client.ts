import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SPBS_URL;
const supabaseAnonKey = import.meta.env.VITE_SPBS_ANONKEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
