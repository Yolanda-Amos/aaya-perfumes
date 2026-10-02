"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GoogleMark from "@/components/GoogleMark";

/** How long the notice stays before dismissing itself. */
const DWELL_MS = 7000;

/**
 * Confirms that a Google sign-in created an account.
 *
 * The auth callback adds `welcome=1` to the redirect target only when the
 * account was genuinely just created, so arriving on a page with the flag is
 * itself the signal. The flag is stripped from the URL on sight — otherwise a
 * refresh or a shared link would replay the notice to someone who already
 * has an account.
 *
 * Announced politely rather than assertively: it confirms something the user
 * just did, so it should not interrupt what a screen reader is currently
 * saying.
 */
export default function WelcomeNotice() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [show, setShow] = useState(false);

  const flag = params.get("welcome");
  const armed = flag === "1";

  // Read the flag, then clean it out of the address bar.
  useEffect(() => {
    if (!armed) return;
    setShow(true);
    const url = new URL(window.location.href);
    url.searchParams.delete("welcome");
    window.history.replaceState(null, "", url.toString());
  }, [armed, pathname]);

  // Self-dismiss, unless reduced motion is on — the animation is the only
  // thing that would be lost, but a notice that vanishes mid-read is worse.
  useEffect(() => {
    if (!show) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setTimeout(() => setShow(false), DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="toast-in pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-5 sm:justify-end sm:px-6 sm:pb-6"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex w-full max-w-sm items-start gap-3.5 rounded-[--radius-card] border p-4 pr-3 shadow-[0_18px_40px_-18px_rgb(48_40_36/.28)] backdrop-blur-sm"
        style={{
          borderColor: "var(--rule)",
          background: "color-mix(in oklab, var(--color-cream) 92%, transparent)",
        }}
      >
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--color-sage)" }}
        >
          <GoogleMark className="h-[18px] w-[18px]" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-display text-[1.05rem] leading-tight">
            Account created
          </p>
          <p className="mt-1 text-[0.82rem] leading-relaxed text-taupe">
            You&rsquo;re signed in with Google. Your orders and saved scents
            will follow you here.
          </p>
          <Link
            href="/account"
            onClick={() => setShow(false)}
            className="mt-2 inline-block text-[0.82rem] font-medium text-sage-deep underline-offset-4 hover:underline"
          >
            View your account
          </Link>
        </div>

        <button
          type="button"
          onClick={() => {
            setShow(false);
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