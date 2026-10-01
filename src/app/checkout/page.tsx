import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Checkout — Aaya Perfume" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string | string[] }>;
}) {
  const { add } = await searchParams;
  const slugs = (Array.isArray(add) ? add : add ? [add] : [])
    .flatMap((s) => s.split(","))
    .map((s) => s.trim())
    .filter(Boolean);

  let signedIn = false;
  let signedInEmail: string | undefined;
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
    signedInEmail = data.user?.email;
  }

  return (
    <CheckoutClient
      add={slugs}
      signedIn={signedIn}
      signedInEmail={signedInEmail}
    />
  );
}
