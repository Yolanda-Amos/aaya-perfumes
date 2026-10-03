import { NextResponse } from "next/server";

/**
 * GET /api/config — public settings for the Aaya mobile app.
 *
 * Only values that are already public (they ship in the website's browser
 * bundle) are returned: the Supabase URL and anon key. Row-level security
 * protects the data; the service-role key is never exposed.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    },
    { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" } }
  );
}
