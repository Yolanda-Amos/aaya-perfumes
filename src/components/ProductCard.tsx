"use client";

import Link from "next/link";
import { useState } from "react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/components/CartProvider";
import { formatPrice, FAMILY_LABEL, type Product } from "@/lib/products";

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9z" />
    </svg>
  );
}

/** One fragrance. The image breathes on hover; Add to Cart is revealed. */
export default function ProductCard({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const [liked, setLiked] = useState(false);
  const out = product.stock === 0;
  const onSale = product.compare_minor > product.price_minor;

  return (
    <article className="group flex h-full flex-col">
      <div
        className="relative overflow-hidden rounded-[--radius-card] border transition-shadow duration-300 group-hover:shadow-[--shadow-lift]"
        style={{
          borderColor: "var(--rule)",
          background: `linear-gradient(168deg,
            color-mix(in oklab, ${product.hue} 22%, var(--color-cream)),
            var(--color-cream) 62%)`,
        }}
      >
        <Link
          href={`/fragrance/${product.slug}`}
          className="relative block aspect-[4/5] overflow-hidden"
          aria-label={`View ${product.name}`}
        >
          {/* The photograph fills the panel and scales gently on hover. The
              fallback bottle supplies its own padding. */}
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06]">
            <ProductImage product={product} size="lg" />
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label={liked ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200 ${
            liked
              ? "border-rose bg-rose/25 text-espresso"
              : "border-line bg-cream/85 text-taupe hover:text-espresso"
          }`}
        >
          <Heart filled={liked} />
        </button>

        {onSale && !out && (
          <p className="absolute left-3 top-3 rounded-full bg-sage px-2.5 py-1 text-[0.68rem] font-medium tracking-wide text-espresso">
            Save {formatPrice(product.compare_minor - product.price_minor)}
          </p>
        )}
        {out && (
          <p className="absolute left-3 top-3 rounded-full bg-espresso px-2.5 py-1 text-[0.68rem] font-medium tracking-wide text-ivory">
            Sold out
          </p>
        )}

        {/* Always visible on touch; revealed on hover for pointers. */}
        <div className="absolute inset-x-3 bottom-3 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          {out ? (
            <span className="btn btn-ghost w-full cursor-not-allowed bg-cream/90 text-[0.82rem]">Sold out</span>
          ) : (
            <button
              type="button"
              onClick={() => {
                add(product.slug);
                setOpen(true);
              }}
              className="btn btn-primary w-full text-[0.82rem]"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow">{FAMILY_LABEL[product.family]}</p>
        <h3 className="mt-1.5">
          <Link
            href={`/fragrance/${product.slug}`}
            className="font-display text-[1.35rem] leading-tight transition-colors hover:text-sage-deep"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[0.85rem] leading-relaxed text-taupe">
          {product.blurb}
        </p>

        <div className="sillage mt-3">
          <div>
            <dl className="space-y-1 border-t pt-3 text-[0.78rem]" style={{ borderColor: "var(--rule)" }}>
              {([
                ["Top", product.notes.top],
                ["Heart", product.notes.heart],
                ["Base", product.notes.base],
              ] as const).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="w-12 shrink-0 text-taupe">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-auto flex items-baseline justify-between gap-3 pt-4">
          <p className="text-[0.95rem]">
            {onSale && (
              <span className="mr-1.5 text-taupe line-through">
                {formatPrice(product.compare_minor)}
              </span>
            )}
            <span className="font-medium">{formatPrice(product.price_minor)}</span>
          </p>
          <p className="text-[0.78rem] text-taupe">{product.size_ml}ml</p>
        </div>
      </div>
    </article>
  );
}