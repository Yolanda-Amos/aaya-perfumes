import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { isNewAccount, withWelcomeFlag } from "@/lib/auth-notice";
import { ensureWelcomed } from "@/lib/welcome";

/**
 * Google redirects here after the user consents. Supabase exchanges the
 * one-time code for a session, which is stored as auth cookies.
 *
 * This MUST be a Route Handler, not a page: Next.js forbids setting cookies
 * while rendering a Server Component, and our server client swallows that
 * error. As a page, the exchange "succeeded" but the session cookie was
 * silently dropped, so users bounced back to the sign-in screen.
 *
 * We add `welcome=1` (new account) or `welcome=back` (returning customer) to
 * the destination so a confirmation notice appears on arrival.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (isSupabaseConfigured && code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Only allow same-site relative paths.
      const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
      const isNew = isNewAccount(data.user?.created_at);
      // Welcome email, once per account (no-op if already sent).
      if (data.user) await ensureWelcomed(data.user);
      return NextResponse.redirect(
        new URL(withWelcomeFlag(safeNext, isNew ? "new" : "back"), origin)
      );
    }
  }

  return NextResponse.redirect(new URL("/?signin=failed", origin));
}
