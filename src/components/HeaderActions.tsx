"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useCart } from "@/components/CartProvider";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/#fragrances", label: "Shop" },
  { href: "/#quiz", label: "Find Your Scent" },
  { href: "/#about", label: "About" },
];

/** The utility cluster: search, account, cart. */
export default function HeaderActions({
  user,
  signOut,
  onOpenMenu,
  onToggleSearch,
  searchOpen,
}: {
  user: { email?: string } | null;
  signOut: React.ReactNode;
  onOpenMenu: () => void;
  onToggleSearch: () => void;
  searchOpen: boolean;
}) {
  const { count, setOpen } = useCart();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={onToggleSearch}
        className="flex h-10 w-10 items-center justify-center rounded-full text-espresso/70 transition-colors hover:bg-sage"
        aria-label="Search fragrances"
        aria-expanded={searchOpen}
      >
        <Icon name="search" />
      </button>

      {user ? (
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/account"
            className="max-w-32 truncate rounded-full px-3 py-2 text-[0.85rem] text-espresso/75 transition-colors hover:bg-sage"
          >
            Account
          </Link>
          {signOut}
        </div>
      ) : (
        <Link
          href="/account"
          className="hidden rounded-full px-3 py-2 text-[0.85rem] text-espresso/75 transition-colors hover:bg-sage sm:block"
        >
          Account
        </Link>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-espresso/70 transition-colors hover:bg-sage"
        aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      >
        <Icon name="bag" />
        {count > 0 && (
          <span
            className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-espresso px-1 text-[0.6rem] font-semibold text-ivory"
            aria-live="polite"
          >
            {count}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={onOpenMenu}
        className="flex h-10 w-10 items-center justify-center rounded-full text-espresso/70 transition-colors hover:bg-sage md:hidden"
        aria-label="Open menu"
      >
        <Icon name="menu" />
      </button>
    </div>
  );
}