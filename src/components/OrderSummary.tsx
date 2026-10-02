"use client";

import { formatPrice, type Product } from "@/lib/products";
import { money } from "@/lib/orders";

export type CartLine = { product: Product; qty: number };

/** The right-hand ledger on the checkout page. */
export default function OrderSummary({
  lines,
  subtotal,
  shipping,
  onQty,
}: {
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  onQty: (slug: string, delta: number) => void;
}) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <h2
        className="tag border-b pb-3"
        style={{ borderColor: "var(--rule)" }}
      >
        Your order
      </h2>

      <ul className="divide-y" style={{ borderColor: "var(--rule)" }}>
        {lines.map((line) => (
          <li key={line.product.slug} className="flex gap-4 py-5">
            <div
              className="h-16 w-12 shrink-0 rounded-b-sm border"
              style={{
                background: `linear-gradient(180deg, color-mix(in oklab, ${line.product.hue} 60%, transparent), ${line.product.hue})`,
                borderColor: "var(--rule)",
              }}
              aria-hidden="true"
            />
            <div className="flex-1">
              <p className="font-display text-lg leading-tight">
                {line.product.name}
              </p>
              <p className="text-[0.8rem] text-taupe">
                {line.product.size_ml}ml ·{" "}
                {formatPrice(line.product.price_minor)}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onQty(line.product.slug, -1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border text-espresso/70 transition-colors hover:bg-sage"
                  aria-label={`Remove one ${line.product.name}`}
                >
                  −
                </button>
                <span
                  className="w-8 text-center text-[0.9rem]"
                  aria-live="polite"
                >
                  {line.qty}
                </span>
                <button
                  type="button"
                  onClick={() => onQty(line.product.slug, 1)}
                  className="btn btn-ghost h-9 min-h-9 w-9 px-0 text-[0.9rem]"
                  aria-label={`Add one more ${line.product.name}`}
                >
                  +
                </button>
              </div>
            </div>
            <p className="shrink-0 text-[0.9rem]">
              {money(line.product.price_minor * line.qty)}
            </p>
          </li>
        ))}
      </ul>

      <Totals subtotal={subtotal} shipping={shipping} />
    </aside>
  );
}

function Totals({
  subtotal,
  shipping,
}: {
  subtotal: number;
  shipping: number;
}) {
  return (
    <dl className="mt-2 space-y-2 text-[0.9rem]">
      <div className="flex justify-between">
        <dt className="text-taupe">Subtotal</dt>
        <dd>{money(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-taupe">Delivery</dt>
        <dd>{shipping === 0 ? "Free" : money(shipping)}</dd>
      </div>
      <div
        className="flex justify-between border-t pt-3 text-[1.05rem]"
        style={{ borderColor: "var(--rule)" }}
      >
        <dt>Total</dt>
        <dd>{money(subtotal + shipping)}</dd>
      </div>
    </dl>
  );
}
