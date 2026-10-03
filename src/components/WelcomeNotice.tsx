"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GoogleMark from "@/components/GoogleMark";

/** How long the notice stays before dismissing itself. */
const DWELL_MS = 7000;

type Kind = "new" | "back" | "failed";

/**
 * Confirms the outcome of a Google sign-in.
 *
 * The auth callback adds a flag to the redirect target:
 *   - `welcome=1`      a brand-new account was just created
 *   - `welcome=back`   a returning customer signed in
 *   - `signin=failed`  the sign-in did not complete
 *
 * The flag is stripped from the URL on sight, otherwise a refresh or a shared
 * link would replay the notice.
 *
 * Success is announced politely (it confirms something the user just did);
 * failure is announced assertively so it is not missed.
 */
export default function WelcomeNotice({
  firstName = "",
  email = "",
}: {
  firstName?: string;
  email?: string;
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [kind, setKind] = useState<Kind | null>(null);

  const welcome = params.get("welcome");
  const signin = params.get("signin");
  const incoming: Kind | null =
    welcome === "1"
      ? "new"
      : welcome === "back"
        ? "back"
        : signin === "failed"
          ? "failed"
          : null;

  // Read the flag, then clean it out of the address bar.
  useEffect(() => {
    if (!incoming) return;
    setKind(incoming);
    const url = new URL(window.location.href);
    url.searchParams.delete("welcome");
    url.searchParams.delete("signin");
    window.history.replaceState(null, "", url.toString());
  }, [incoming, pathname]);

  // Self-dismiss, unless reduced motion is on — a notice that vanishes
  // mid-read is worse than one that stays.
  useEffect(() => {
    if (!kind) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setTimeout(() => setKind(null), DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [kind]);

  if (!kind) return null;

  const failed = kind === "failed";
  const name = firstName ? `, ${firstName}` : "";

  const title =
    kind === "new"
      ? `Welcome to Aaya${name}`
      : kind === "back"
        ? `Welcome back${name}`
        : "Sign-in didn’t complete";

  const body =
    kind === "new"
      ? "Your account has been created and you’re signed in with Google. Your orders and saved scents will follow you here."
      : kind === "back"
        ? "You’re signed in with Google. Your bag and order history are ready for you."
        : "Something interrupted the Google sign-in. Please try again — nothing was charged and your bag is safe.";

  return (
    <div
      className="toast-in pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-5 sm:justify-end sm:px-6 sm:pb-6"
      role={failed ? "alert" : "status"}
      aria-live={failed ? "assertive" : "polite"}
    >
      <div
        className="pointer-events-auto flex w-full max-w-sm items-start gap-3.5 rounded-[--radius-card] border p-4 pr-3 shadow-[0_18px_40px_-18px_rgb(48_40_36/.28)] backdrop-blur-sm"
        style={{
          borderColor: failed ? "var(--color-rose)" : "var(--rule)",
          background: "color-mix(in oklab, var(--color-cream) 92%, transparent)",
        }}
      >
        <span
          className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ background: failed ? "var(--color-peach)" : "var(--color-sage)" }}
        >
          <GoogleMark className="h-[18px] w-[18px]" />
          {!failed && (
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-ivory ring-2"
              style={{
                background: "var(--color-sage-mid)",
                // ring colour matches the card so the tick looks cut out
                ["--tw-ring-color" as string]: "var(--color-cream)",
              }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3}>
                <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-display text-[1.05rem] leading-tight">{title}</p>
          <p className="mt-1 text-[0.82rem] leading-relaxed text-taupe">{body}</p>
          {!failed && email && (
            <p className="mt-1 truncate text-[0.78rem] text-taupe/90">{email}</p>
          )}
          <Link
            href="/account"
            onClick={() => setKind(null)}
            className="mt-2 inline-block text-[0.82rem] font-medium text-sage-deep underline-offset-4 hover:underline"
          >
            {failed ? "Try signing in again" : "View your account"}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => {
            setKind(null);
            router.refresh();
          }}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-taupe transition-colors hover:bg-sage/60 hover:text-espresso"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
