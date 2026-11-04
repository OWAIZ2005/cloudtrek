export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when the public Supabase credentials are present. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** True when the server-only service role key is also present. */
export const hasServiceRole = () => Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
