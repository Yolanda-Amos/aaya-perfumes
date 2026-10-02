import type { Metadata } from "next";
import Link from "next/link";
import TestEmailForm from "./TestEmailForm";
import { isMailgunConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Email test — Aaya Perfumes" };
export const dynamic = "force-dynamic";

/** A small helper for checking the confirmation email without an order. */
export default function EmailTestPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="tag">Developer tool</p>
      <h1 className="mt-2 font-display text-4xl">Send a sample email</h1>
      <p className="mt-4 measure text-cocoa">
        Sends the real order-confirmation email so you can check how it looks in
        your inbox. Nothing is saved to the database.
      </p>

      <div className="mt-10">
        {isMailgunConfigured ? (
          <TestEmailForm />
        ) : (
          <div
            className="border p-5"
            style={{ borderColor: "var(--rule)", background: "var(--color-sand)" }}
          >
            <p className="font-medium">Mailgun is not set up yet</p>
            <p className="mt-2 text-[0.9rem] text-cocoa">
              Add <code>MAILGUN_DOMAIN</code> and <code>MAILGUN_API_KEY</code> to{" "}
              <code>.env.local</code>, then restart the server. README section 5
              walks through it.
            </p>
          </div>
        )}
      </div>

      <Link href="/account" className="btn btn-ghost mt-10">
        Back to your account
      </Link>
    </div>
  );
}
