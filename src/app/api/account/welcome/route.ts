import { NextResponse, type NextRequest } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";
import { ensureWelcomed } from "@/lib/welcome";

/**
 * POST /api/account/welcome — called by the mobile app after sign-in with
 * `Authorization: Bearer <supabase access token>`. Sends the welcome email
 * if this account has never had one. Safe to call on every sign-in.
 */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ status: "skipped" }, { status: 200 });
  }
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "missing token" }, { status: 401 });

  const supabase = createSupabaseClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  const status = await ensureWelcomed(data.user);
  return NextResponse.json({ status });
}
