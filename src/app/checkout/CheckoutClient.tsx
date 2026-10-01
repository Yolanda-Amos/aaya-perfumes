"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { placeOrder, type CheckoutState } from "@/app/checkout/actions";
import Form, {
  Confirmed,
  EmptyBag,
} from "@/app/checkout/CheckoutForm";
import OrderSummary, { type CartLine } from "@/components/OrderSummary";
import { CATALOGUE, type Product } from "@/lib/products";
import { shippingFor } from "@/lib/orders";

const initialState: CheckoutState = { ok: false };

export default function CheckoutClient({
  add,
  signedIn,
  signedInEmail,
}: {
  add: string[];
  signedIn: boolean;
  signedInEmail?: string;
}) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    const wanted = add.length ? add : CATALOGUE.slice(0, 1).map((p) => p.slug);
    return wanted
      .map((slug) => CATALOGUE.find((p) => p.slug === slug))
      .filter((p): p is Product => Boolean(p))
      .map((product) => ({ product, qty: 1 }));
  });

  const [state, formAction, pending] = useActionState(placeOrder, initialState);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.product.price_minor * l.qty, 0),
    [lines]
  );
  const shipping = shippingFor(subtotal);
  const cartValue = lines.map((l) => `${l.product.slug}:${l.qty}`).join(",");

  function setQty(slug: string, delta: number) {
    setLines((prev) =>
      prev
        .map((l) =>
          l.product.slug === slug
            ? { ...l, qty: Math.min(10, Math.max(0, l.qty + delta)) }
            : l
        )
        .filter((l) => l.qty > 0)
    );
  }

  if (state.ok && state.reference) {
    return (
      <Confirmed reference={state.reference} signedInEmail={signedInEmail} />
    );
  }
  if (lines.length === 0) return <EmptyBag />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-5xl">Checkout</h1>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
        <Form
          lines={lines}
          err={state.fieldErrors ?? {}}
          state={state}
          pending={pending}
          cartValue={cartValue}
          signedIn={signedIn}
          formAction={formAction}
        />
        <OrderSummary
          lines={lines}
          subtotal={subtotal}
          shipping={shipping}
          onQty={setQty}
        />
      </div>
    </div>
  );
}
