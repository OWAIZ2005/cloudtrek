export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
/**
 * Public (browser-safe) key. Supabase now calls it the "publishable" key; the older name
 * "anon" is still accepted. Literal property access is required so Next can inline it.
 */
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/** True when the public Supabase credentials are present. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * True when the server-only secret key is also present. Accepts the new
 * SUPABASE_SECRET_KEY or the legacy SUPABASE_SERVICE_ROLE_KEY.
 */
export const serverSecretKey = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const hasServiceRole = () => Boolean(serverSecretKey());
