"use client";

import Link from "next/link";
import Field from "@/components/Field";
import GoogleSignIn from "@/components/GoogleSignIn";
import type { CartLine } from "@/components/OrderSummary";
import { money, shippingFor } from "@/lib/orders";
import type { CheckoutState } from "@/app/checkout/actions";

const fields = [
  { name: "name", label: "Full name", autoComplete: "name", placeholder: "Amara Okonkwo", span: true },
  { name: "email", label: "Email", type: "email", inputMode: "email" as const, autoComplete: "email", placeholder: "you@example.com", span: true },
  { name: "address", label: "Delivery address", autoComplete: "street-address", placeholder: "12 Al Wasl Road, Dubai", span: true },
];

const paymentFields = [
  { name: "card", label: "Card number", autoComplete: "cc-number", inputMode: "numeric" as const, maxLength: 19, placeholder: "4242 4242 4242 4242", span: true },
  { name: "expiry", label: "Expiry", autoComplete: "cc-exp", inputMode: "numeric" as const, maxLength: 7, placeholder: "MM/YY" },
  { name: "cvc", label: "Security code", autoComplete: "cc-csc", inputMode: "numeric" as const, maxLength: 4, placeholder: "123" },
];

function Form({
  lines,
  err,
  state,
  pending,
  cartValue,
  signedIn,
  formAction,
}: {
  lines: CartLine[];
  err: NonNullable<CheckoutState["fieldErrors"]>;
  state: CheckoutState;
  pending: boolean;
  cartValue: string;
  signedIn: boolean;
  formAction: (payload: FormData) => void;
}) {
  const total = lines.reduce((s, l) => s + l.product.price_minor * l.qty, 0);
  return (
    <form action={formAction} noValidate className="space-y-10">
      <input type="hidden" name="cart" value={cartValue} />

      <fieldset className="space-y-5">
        <legend className="mb-4 font-display text-2xl">Where it goes</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((f) => (
            <Field key={f.name} {...f} error={err[f.name]} />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-4 font-display text-2xl">Payment</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {paymentFields.map((f) => (
            <Field key={f.name} {...f} error={err[f.name]} />
          ))}
        </div>
      </fieldset>

      {state.error && (
        <p
          role="alert"
          className="border px-4 py-3 text-[0.9rem] text-[#d98b7a]"
          style={{
            borderColor: "color-mix(in oklab, #d98b7a 45%, transparent)",
          }}
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full sm:w-auto"
        aria-busy={pending}
      >
        {pending
          ? "Placing your order…"
          : `Pay ${money(total + shippingFor(total))}`}
      </button>

      {!signedIn && (
        <div
          className="space-y-3 border-t pt-6"
          style={{ borderColor: "var(--rule)" }}
        >
          <p className="measure text-[0.9rem] text-taupe">
            Have an Aaya account? Sign in first and this order is saved to your
            order history. You can also check out as a guest.
          </p>
          <GoogleSignIn next="/checkout" />
        </div>
      )}
    </form>
  );
}

export function Confirmed({
  reference,
  signedInEmail,
}: {
  reference: string;
  signedInEmail?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-28 text-center">
      <p className="tag">Order confirmed</p>
      <h1 className="mt-4 font-display text-5xl">Thank you.</h1>
      <p className="mx-auto mt-5 measure text-taupe">
        We have emailed your receipt to {signedInEmail ?? "your inbox"}. Your
        reference is <strong className="text-cocoa">{reference}</strong> — quote
        it if you write to us.
      </p>
      <p className="mt-3 measure text-taupe">
        Your two samples are packed alongside the bottles. Orders leave the same
        week, and you will get a second email when yours ships.
      </p>
      <Link href="/" className="btn btn-primary mt-10">
        Back to the collection
      </Link>
    </div>
  );
}

export function EmptyBag() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-28 text-center">
      <h1 className="font-display text-5xl">Your bag is empty</h1>
      <p className="mx-auto mt-4 measure text-taupe">
        Nothing in here yet. Every roll-on is Dhs 15.75, so start with two and
        see which one you reach for on day three.
      </p>
      <Link href="/#fragrances" className="btn btn-primary mt-9">
        Browse the roll-ons
      </Link>
    </div>
  );
}

export default function FormAndStates(props: Parameters<typeof Form>[0]) {
  return <Form {...props} />;
}
