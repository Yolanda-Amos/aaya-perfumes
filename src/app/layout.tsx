import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import SignOutButton from "@/components/SignOutButton";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { CartProvider } from "@/components/CartProvider";
import WelcomeNotice from "@/components/WelcomeNotice";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

/* Cormorant Garamond carries the editorial voice; Manrope keeps UI and
   body text modern and highly legible on a phone. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aaya Perfume — a scent that feels like you",
  description:
    "Small-batch Arabic roll-on fragrances in 24ml. Take the scent quiz and we'll match you to a bottle.",
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: { email?: string; user_metadata?: Record<string, unknown> } | null = null;
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const fullName =
    typeof user?.user_metadata?.full_name === "string"
      ? (user.user_metadata.full_name as string)
      : typeof user?.user_metadata?.name === "string"
        ? (user.user_metadata.name as string)
        : "";
  const firstName = fullName.trim().split(/\s+/)[0] ?? "";

  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-espresso focus:px-5 focus:py-2.5 focus:text-ivory"
        >
          Skip to content
        </a>

        <CartProvider>
          <SiteHeader user={user} signOut={<SignOutButton />} />

          <main id="main">{children}</main>

          <SiteFooter />

          {/* Confirms every Google sign-in (new account, returning, or failed).
              useSearchParams needs a Suspense boundary here or the build
              hangs — see AGENTS.md. */}
          <Suspense fallback={null}>
            <WelcomeNotice firstName={firstName} email={user?.email ?? ""} />
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}
