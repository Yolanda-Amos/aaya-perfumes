"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import GoogleMark from "@/components/GoogleMark";

/** Sends the visitor to Google's consent screen, then back to /auth/callback. */
export default function GoogleSignIn({ next = "/" }: { next?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    if (!isSupabaseConfigured) {
      setError(
        "Google sign-in is not switched on yet. Add your Supabase keys to .env.local — see README."
      );
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={signIn}
        disabled={busy}
        className="btn btn-ghost w-full"
        aria-busy={busy}
      >
        <GoogleMark />
        {busy ? "Opening Google…" : "Continue with Google"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-[0.85rem] text-[#d98b7a]">
          {error}
        </p>
      )}
    </div>
  );
}
