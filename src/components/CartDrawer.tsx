"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart, toCartValue, type CartLine } from "@/components/CartProvider";
import { ProductThumb } from "@/components/Bottle";
import { money } from "@/lib/orders";

function Row({ line, onQty, onRemove, onNavigate }: {
  line: CartLine;
  onQty: (slug: string, qty: number) => void;
  onRemove: (slug: string) => void;
  onNavigate: () => void;
}) {
  const btn = "flex h-9 w-9 items-center justify-center rounded-full border text-espresso/70 transition-colors hover:bg-sage";
  return (
    <li className="flex gap-4 py-5">
      <Link href={`/fragrance/${line.product.slug}`} onClick={onNavigate} className="shrink-0">
        <ProductThumb product={line.product} />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg leading-tight">{line.product.name}</p>
        <p className="text-[0.78rem] text-taupe">{line.product.size_ml}ml roll-on</p>
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => onQty(line.product.slug, line.qty - 1)} className={btn} style={{ borderColor: "var(--rule)" }} aria-label={`Remove one ${line.product.name}`}>−</button>
            <span className="w-7 text-center text-[0.9rem]" aria-live="polite">{line.qty}</span>
            <button type="button" onClick={() => onQty(line.product.slug, line.qty + 1)} className={btn} style={{ borderColor: "var(--rule)" }} aria-label={`Add one more ${line.product.name}`}>+</button>
          </div>
          <button type="button" onClick={() => onRemove(line.product.slug)} className="text-[0.78rem] text-taupe underline-offset-4 transition-colors hover:text-espresso hover:underline">
            Remove
          </button>
        </div>
      </div>
      <p className="shrink-0 text-[0.9rem]">{money(line.product.price_minor * line.qty)}</p>
    </li>
  );
}

/** Slide-out cart. Checkout itself is unchanged — this hands off to it. */
export default function CartDrawer() {
  const { open, setOpen, lines, count, subtotal, setQty, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your cart">
      <div className="backdrop-in absolute inset-0 bg-espresso/30" onClick={() => setOpen(false)} />
      <div className="slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl">
        <header className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: "var(--rule)" }}>
          <h2 className="font-display text-2xl">Your cart{count > 0 && <span className="text-taupe"> ({count})</span>}</h2>
          <button type="button" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full text-espresso/60 transition-colors hover:bg-sage" aria-label="Close cart">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <p className="font-display text-2xl">Your cart is empty</p>
            <p className="measure text-[0.9rem] text-taupe">Start with the quiz and we will point you at a bottle.</p>
            <Link href="/#fragrances" onClick={() => setOpen(false)} className="btn btn-primary">Browse fragrances</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-6" style={{ borderColor: "var(--rule)" }}>
              {lines.map((line) => (
                <Row key={line.product.slug} line={line} onQty={setQty} onRemove={remove} onNavigate={() => setOpen(false)} />
              ))}
            </ul>
            <footer className="border-t px-6 py-5" style={{ borderColor: "var(--rule)" }}>
              <div className="flex items-baseline justify-between">
                <span className="text-taupe">Subtotal</span>
                <span className="font-display text-2xl">{money(subtotal)}</span>
              </div>
              <p className="mt-1 text-[0.78rem] text-taupe">Delivery is calculated at checkout.</p>
              <Link href={`/checkout?add=${encodeURIComponent(toCartValue(lines))}`} onClick={() => setOpen(false)} className="btn btn-primary mt-4 w-full">Checkout</Link>
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost mt-2 w-full">Keep shopping</button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}