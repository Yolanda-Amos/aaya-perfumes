"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { clearLocalCart } from "@/components/CartProvider";

export default function SignOutButton({ variant = "link" }: { variant?: "link" | "dark" }) {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        // "local" ends only this browser's session; the phone stays signed in.
        clearLocalCart();
        await createClient().auth.signOut({ scope: "local" });
        clearLocalCart();
        // Full reload so the server-rendered header and profile drop the
        // signed-in state immediately.
        window.location.assign("/");
      }}
      className={
        variant === "dark"
          ? "btn btn-ivory-ghost"
          : "text-[0.85rem] text-taupe underline-offset-4 transition-colors hover:text-espresso hover:underline"
      }
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
