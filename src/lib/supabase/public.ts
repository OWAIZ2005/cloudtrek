import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl, isSupabaseConfigured } from "./env";

/** Cookie-less anon client for public catalogue reads (RLS limits to active content). */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
}
