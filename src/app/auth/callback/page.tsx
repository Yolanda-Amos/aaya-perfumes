import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { isNewAccount, withWelcomeFlag } from "@/lib/auth-notice";

/** Google redirects here after the user consents. Supabase exchanges the
 *  one-time code for a session cookie, then we send them onward.
 *
 *  We add `welcome=1` (new account) or `welcome=back` (returning customer) to
 *  the destination so a confirmation notice appears on arrival. */
export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; next?: string }>;
}) {
  const { code, next = "/" } = await searchParams;

  if (isSupabaseConfigured && code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Only allow same-site relative paths.
      const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
      // Every successful sign-in gets a confirmation: "Account created" for a
      // first-time signup, "Welcome back" for a returning customer.
      const isNew = isNewAccount(data.user?.created_at);
      redirect(withWelcomeFlag(safeNext, isNew ? "new" : "back"));
    }
  }
  redirect("/?signin=failed");
}
