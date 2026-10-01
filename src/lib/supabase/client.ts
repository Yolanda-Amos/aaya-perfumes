"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

let cached: ReturnType<typeof createBrowserClient> | undefined;

/** Browser Supabase client for sign-in buttons. */
export function createClient() {
  if (!cached) {
    cached = createBrowserClient(
      env("NEXT_PUBLIC_SUPABASE_URL"),
      env("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    );
  }
  return cached;
}
