import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseUrl, isSupabaseConfigured } from "./env";

/** Session-aware client (admin auth). Row Level Security applies as the signed-in user. */
export async function createSessionClient() {
  if (!isSupabaseConfigured) return null;
  const jar = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {
          /* called from a Server Component; proxy refreshes the session */
        }
      },
    },
  });
}
