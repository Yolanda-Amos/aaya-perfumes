import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

/** Google redirects here after the user consents. Supabase exchanges the
 *  one-time code for a session cookie, then we send them onward. */
export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; next?: string }>;
}) {
  const { code, next = "/" } = await searchParams;

  if (isSupabaseConfigured && code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Only allow same-site relative paths.
      redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
    }
  }
  redirect("/?signin=failed");
}
