"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useCart } from "@/components/CartProvider";

function firstName(user: { email?: string; user_metadata?: Record<string, unknown> }): string {
  const meta = user.user_metadata ?? {};
  const full = (typeof meta.full_name === "string" && meta.full_name) || (typeof meta.name === "string" && meta.name) || "";
  return full.trim().split(/\s+/)[0] ?? "";
}

/** Google profile photo, or the user's initial on brass. */
export function Avatar({
  user,
  size = 32,
}: {
  user: { email?: string; user_metadata?: Record<string, unknown> };
  size?: number;
}) {
  const meta = user.user_metadata ?? {};
  const src = typeof meta.avatar_url === "string" ? meta.avatar_url : typeof meta.picture === "string" ? meta.picture : "";
  const initial = (firstName(user) || user.email || "A").charAt(0).toUpperCase();
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" width={size} height={size} referrerPolicy="no-referrer" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-brass font-display text-night"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/#fragrances", label: "Shop" },
  { href: "/#quiz", label: "Find Your Scent" },
  { href: "/#about", label: "About" },
];

/** The utility cluster: search, account, cart. */
export default function HeaderActions({
  user,
  onOpenMenu,
  onToggleSearch,
  searchOpen,
}: {
  user: { email?: string; user_metadata?: Record<string, unknown> } | null;
  /** Kept for API compatibility; sign-out now lives on the profile page. */
  signOut?: React.ReactNode;
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
        <Link
          href="/account"
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 text-[0.85rem] text-espresso/80 transition-colors hover:bg-sage sm:pr-3"
          aria-label="Your profile"
        >
          <Avatar user={user} />
          <span className="hidden max-w-28 truncate sm:inline">
            {firstName(user) || "Profile"}
          </span>
        </Link>
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