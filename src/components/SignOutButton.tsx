"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton({ variant = "link" }: { variant?: "link" | "dark" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        // "local" ends only this browser's session; the phone stays signed in.
        await createClient().auth.signOut({ scope: "local" });
        router.refresh();
        router.push("/");
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
