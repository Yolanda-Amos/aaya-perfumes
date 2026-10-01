import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Pinyon_Script } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import SignOutButton from "@/components/SignOutButton";
import Icon from "@/components/Icon";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* The script face from the branding reference. Used for the wordmark and
   section flourishes only — never for body copy or buttons. */
const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aaya Perfume — Arabic roll-ons, 24ml",
  description:
    "Thirty-seven Arabic roll-on perfumes, 24ml each at Dhs 15.75. Take the scent quiz and we will match you to three.",
};

const NAV = [
  { href: "/#fragrances", label: "Shop" },
  { href: "/#quiz", label: "Scent quiz" },
  { href: "/checkout", label: "Your bag" },
];


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
      <body
        className={`${cormorant.variable} ${inter.variable} ${pinyon.variable} antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-espresso focus:px-4 focus:py-2 focus:text-ivory"
        >
          Skip to content
        </a>

        {/* Announcement bar — the one place a small all-caps line earns
            its keep, because it is a shipping promise, not a label. */}
        <p className="on-dark px-4 py-2 text-center text-[0.72rem] tracking-[.08em]">
          Free shipping on orders over Dhs 75 · Two samples with every order
        </p>

        <header
          className="sticky top-0 z-30 border-b bg-ivory/90 backdrop-blur-md"
          style={{ borderColor: "var(--rule)" }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
            <Link href="/" className="leading-none">
              <span className="font-script block text-4xl text-espresso">Aaya</span>
              <span className="tag block text-[0.6rem] tracking-[.3em]">
                PARFUMS
              </span>
            </Link>

            <nav
              aria-label="Main"
              className="hidden items-center gap-8 text-[0.9rem] sm:flex"
            >
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-cocoa transition-colors hover:text-gold-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="hidden max-w-36 truncate text-[0.85rem] text-taupe hover:text-cocoa sm:block"
                  >
                    {user.email}
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <Link
                  href="/account"
                  className="hidden text-[0.85rem] text-cocoa transition-colors hover:text-gold-ink sm:block"
                >
                  Sign in
                </Link>
              )}
              <Link
                href="/checkout"
                className="flex items-center gap-1.5"
                aria-label="Your bag"
              >
                <Icon name="bag" className="h-5 w-5" />
                <span className="sr-only">Your bag</span>
              </Link>
            </div>
          </div>
        </header>


        <main id="main">{children}</main>

        <footer className="on-dark mt-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <p className="font-script text-4xl text-ivory">Aaya</p>
              <p className="mt-3 measure text-[0.9rem] text-ivory/70">
                Thirty-seven Arabic roll-ons, 24ml each. Priced flat so you can
                afford to try four before you commit to one.
              </p>
              <form
                action="#"
                className="mt-7 flex max-w-sm gap-2"
                method="post"
              >
                <label htmlFor="newsletter" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="field"
                />
                <button type="submit" className="btn btn-primary shrink-0">
                  Subscribe
                </button>
              </form>
            </div>

            <div>
              <p className="tag">Shop</p>
              <ul className="mt-4 space-y-2.5 text-[0.9rem] text-ivory/70">
                <li>
                  <Link href="/#fragrances" className="hover:text-ivory">
                    All roll-ons
                  </Link>
                </li>
                <li>
                  <Link href="/#quiz" className="hover:text-ivory">
                    Scent quiz
                  </Link>
                </li>
                <li>
                  <Link href="/checkout" className="hover:text-ivory">
                    Your bag
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-ivory">
                    Your orders
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="tag">Reach us</p>
              <ul className="mt-4 space-y-2.5 text-[0.9rem] text-ivory/70">
                <li>hello@aayaperfume.com</li>
                <li>+971 4 000 0000</li>
                <li>Dubai, UAE</li>
              </ul>
            </div>
          </div>

          <div className="rule" />
          <p className="mx-auto max-w-7xl px-6 py-6 text-center text-[0.8rem] text-ivory/55">
            © {new Date().getFullYear()} Aaya Perfumes. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}

