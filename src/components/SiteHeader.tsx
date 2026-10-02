"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderActions, { NAV } from "@/components/HeaderActions";
import CartDrawer from "@/components/CartDrawer";

/** Minimal navbar: wordmark left, links centre, utilities right. */
export default function SiteHeader({
  user,
  signOut,
}: {
  user: { email?: string } | null;
  signOut: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-30 border-b bg-ivory/85 backdrop-blur-md"
        style={{ borderColor: "var(--rule)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="wordmark text-lg text-espresso"
            aria-label="Aaya Perfume — home"
          >
            Aaya
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.9rem] text-espresso/75 transition-colors hover:text-sage-deep"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <HeaderActions
            user={user}
            signOut={signOut}
            onOpenMenu={() => setMenuOpen(true)}
            onToggleSearch={() => setSearchOpen((v) => !v)}
            searchOpen={searchOpen}
          />
        </div>

        {searchOpen && (
          <div
            className="border-t bg-cream"
            style={{ borderColor: "var(--rule)" }}
          >
            <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const value = new FormData(e.currentTarget).get("q");
                  if (typeof value === "string" && value.trim()) {
                    window.location.href = `/#fragrances?q=${encodeURIComponent(
                      value.trim()
                    )}`;
                  }
                }}
                className="flex items-center gap-3"
              >
                <label htmlFor="site-search" className="sr-only">
                  Search fragrances
                </label>
                <input
                  id="site-search"
                  name="q"
                  type="search"
                  autoFocus
                  placeholder="Search by name or note — rose, oud, musk…"
                  className="field"
                />
                <button type="submit" className="btn btn-primary shrink-0">
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div
            className="backdrop-in absolute inset-0 bg-espresso/25"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            className="fade absolute inset-x-0 top-0 border-b bg-cream px-5 pb-8 pt-20"
            style={{ borderColor: "var(--rule)" }}
          >
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 font-display text-2xl text-espresso transition-colors hover:bg-sage"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-[0.95rem] text-espresso/75 transition-colors hover:bg-sage"
                >
                  {user ? "My account" : "Sign in"}
                </Link>
              </li>
            </ul>
            {user && (
              <div
                className="mt-4 border-t px-4 pt-4"
                style={{ borderColor: "var(--rule)" }}
              >
                <p className="mb-2 truncate text-[0.85rem] text-taupe">
                  {user.email}
                </p>
                {signOut}
              </div>
            )}
          </nav>
        </div>
      )}

      <CartDrawer />
    </>
  );
}