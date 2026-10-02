import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/** Session-aware client. Uses the anon key and the visitor's auth cookies.
 *  This is the one to use for reading the user and listing their orders. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — middleware already
            // refreshed the session, so this is safe to ignore.
          }
        },
      },
    }
  );
}

/**
 * Service-role client for WRITING orders.
 *
 * This key bypasses row-level security, so it must never reach the browser
 * bundle. Only server actions may call this. The anon-key `createClient`
 * above handles everything else — reading the session and listing a
 * customer's own orders, both of which RLS permits.
 */
export function createAdminClient() {
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local — see README section 3."
    );
  }
  return createSupabaseClient(env("NEXT_PUBLIC_SUPABASE_URL"), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
