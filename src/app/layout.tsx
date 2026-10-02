import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import SignOutButton from "@/components/SignOutButton";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { CartProvider } from "@/components/CartProvider";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

/* DM Serif Display carries the editorial voice; Manrope keeps UI and
   body text modern and highly legible on a phone. */
const dmserif = DM_Serif_Display({
  variable: "--font-dmserif",
  subsets: ["latin"],
  weight: "400",
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
  let user: { email?: string } | null = null;
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return (
    <html lang="en">
      <body className={`${dmserif.variable} ${manrope.variable} antialiased`}>
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
        </CartProvider>
      </body>
    </html>
  );
}
