import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  console.warn("VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set in env");
}

export const supabase: SupabaseClient = createClient(url || "", anonKey || "");
