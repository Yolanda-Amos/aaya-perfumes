"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await createClient().auth.signOut();
        router.refresh();
        router.push("/");
      }}
      className="tag underline-offset-4 hover:text-cocoa hover:underline"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
