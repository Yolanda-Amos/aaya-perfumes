"use client";

import { useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/components/CartProvider";
import {
  formatPrice,
  FAMILY_LABEL,
  SEASON_LABEL,
  OCCASION_LABEL,
  type Product,
} from "@/lib/products";

const NOTES = (p: Product) =>
  [
    ["Top notes", p.notes.top],
    ["Heart notes", p.notes.heart],
    ["Base notes", p.notes.base],
  ] as const;

/** Product detail: imagery left, buying panel right. */
export default function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const out = product.stock === 0;
  const onSale = product.compare_minor > product.price_minor;
  const go = () => {
    add(product.slug, qty);
  };
  const qtyBtn =
    "flex h-10 w-10 items-center justify-center rounded-full text-espresso/70 transition-colors hover:bg-sage disabled:opacity-40";
  const audience =
    product.audience === "unisex"
      ? "Unisex"
      : product.audience === "women"
        ? "For her"
        : "For him";

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-[--radius-card] border"
          style={{
            borderColor: "var(--rule)",
            background: `linear-gradient(168deg,
              color-mix(in oklab, ${product.hue} 26%, var(--color-cream)),
              var(--color-cream) 68%)`,
          }}
        >
          <div className="drift absolute inset-0">
            <ProductImage product={product} size="xl" priority />
          </div>
          {onSale && !out && (
            <p className="absolute left-5 top-5 rounded-full bg-sage px-3 py-1.5 text-[0.72rem] font-medium tracking-wide text-espresso">
              Save {formatPrice(product.compare_minor - product.price_minor)}
            </p>
          )}
          {out && (
            <p className="absolute left-5 top-5 rounded-full bg-espresso px-3 py-1.5 text-[0.72rem] font-medium tracking-wide text-ivory">
              Sold out
            </p>
          )}
        </div>

        <dl
          className="mt-6 grid gap-px overflow-hidden rounded-[--radius-card] border sm:grid-cols-3"
          style={{ borderColor: "var(--rule)", background: "var(--rule)" }}
        >
          {NOTES(product).map(([label, value]) => (
            <div key={label} className="bg-cream p-5">
              <dt className="eyebrow">{label}</dt>
              <dd className="mt-2 text-[0.88rem] leading-relaxed">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <p className="eyebrow">{FAMILY_LABEL[product.family]}</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">{product.name}</h1>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="font-display text-3xl text-sage-deep">
            {formatPrice(product.price_minor)}
          </span>
          {onSale && (
            <span className="text-taupe line-through">
              {formatPrice(product.compare_minor)}
            </span>
          )}
        </div>
        <p className="mt-1 text-[0.85rem] text-taupe">
          {product.size_ml}ml roll-on · {audience}
        </p>

        <p className="mt-6 measure text-[1.02rem] leading-relaxed text-cocoa">
          {product.blurb}
        </p>

        <dl className="mt-8 space-y-3 border-y py-6 text-[0.9rem]" style={{ borderColor: "var(--rule)" }}>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-taupe">Family</dt>
            <dd>{FAMILY_LABEL[product.family]}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-taupe">Best for</dt>
            <dd>{product.occasion.map((o) => OCCASION_LABEL[o]).join(", ")}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-taupe">Season</dt>
            <dd>{product.seasons.map((s) => SEASON_LABEL[s]).join(", ")}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-taupe">Strength</dt>
            <dd>
              {product.intensity === 1
                ? "Soft — close to skin"
                : product.intensity === 2
                  ? "Moderate — noticed up close"
                  : "Bold — fills the room"}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border p-1" style={{ borderColor: "var(--rule)" }}>
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={out} className={qtyBtn} aria-label="Decrease quantity">−</button>
            <span className="w-9 text-center" aria-live="polite">{qty}</span>
            <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} disabled={out} className={qtyBtn} aria-label="Increase quantity">+</button>
          </div>
          <button type="button" onClick={go} disabled={out} className="btn btn-primary flex-1 sm:flex-none sm:px-10">
            {out ? "Sold out" : "Add to Cart"}
          </button>
          <button type="button" onClick={go} disabled={out} className="btn btn-sage sm:px-8">
            Buy Now
          </button>
        </div>

        {product.stock > 0 && product.stock <= 10 && (
          <p className="mt-3 text-[0.82rem] text-rose">Only {product.stock} left in this batch.</p>
        )}

        <div className="mt-8 rounded-[--radius-card] bg-sage p-6 text-[0.9rem] leading-relaxed">
          <p className="font-medium">Why we make it this way</p>
          <p className="mt-2 text-cocoa">
            Every Aaya bottle is a 24ml roll-on — small enough to carry, big
            enough to wear daily. It goes on in seconds, sits close to the skin,
            and travels without leaking. One bottle is roughly three months of
            everyday wear, so you can afford to try three before you commit.
          </p>
        </div>

        <Link href="/#fragrances" className="mt-8 inline-block text-[0.88rem] text-taupe underline-offset-4 transition-colors hover:text-espresso hover:underline">
          ← Back to all fragrances
        </Link>
      </div>
    </div>
  );
}
