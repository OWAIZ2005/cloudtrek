import "server-only";
import { createClient } from "@supabase/supabase-js";
import { serverSecretKey, supabaseUrl } from "./env";

/**
 * Service-role client. Server-only: never import from a client component.
 * Used solely for submitting public enquiries and uploading customer files.
 */
export function createServiceClient() {
  const key = serverSecretKey();
  if (!supabaseUrl || !key) return null;
  return createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
