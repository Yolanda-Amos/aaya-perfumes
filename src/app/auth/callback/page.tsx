import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { isNewAccount, withWelcomeFlag } from "@/lib/auth-notice";

/** Google redirects here after the user consents. Supabase exchanges the
 *  one-time code for a session cookie, then we send them onward.
 *
 *  When this exchange creates a brand-new account we add `welcome=1` to the
 *  destination so the confirmation notice can appear on arrival. */
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
      // A first-time signup gets the confirmation; a returning customer does
      // not, so the notice always means "this account was just created".
      const isNew = isNewAccount(data.user?.created_at);
      redirect(isNew ? withWelcomeFlag(safeNext) : safeNext);
    }
  }
  redirect("/?signin=failed");
}
