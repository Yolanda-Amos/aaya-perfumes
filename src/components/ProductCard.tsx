import Link from "next/link";
import Bottle from "./Bottle";
import { formatPrice, FAMILY_LABEL, type Product } from "@/lib/products";

/* One product on the shelf. The note pyramid is hidden until hover or
   keyboard focus, so the grid stays calm and the detail is earned. */
export default function ProductCard({ product }: { product: Product }) {
  const out = product.stock === 0;
  const onSale = product.compare_minor > product.price_minor;
  const save = product.compare_minor - product.price_minor;

  return (
    <article className="group flex flex-col">
      <div
        className="relative flex items-center justify-center border bg-porcelain p-5 transition-colors duration-300"
        style={{ borderColor: "var(--rule)" }}
      >
        <Bottle hue={product.hue} label={`${product.name} roll-on bottle`} />

        {onSale && !out && (
          <p className="absolute left-3 top-3 bg-sand px-2 py-1 text-[0.7rem] tracking-[.06em] text-cocoa">
            Save {formatPrice(save)}
          </p>
        )}
        {out && (
          <p className="absolute left-3 top-3 bg-espresso px-2 py-1 text-[0.7rem] tracking-[.06em] text-ivory">
            Sold out
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="tag">{FAMILY_LABEL[product.family]}</p>
        <h3 className="mt-1 font-display text-xl leading-tight">{product.name}</h3>

        <p className="mt-2 text-[0.85rem] leading-relaxed text-taupe">
          {product.blurb}
        </p>

        {/* The sillage reveal — notes unfurl on hover or focus. */}
        <div className="sillage">
          <div>
            <dl
              className="mt-3 space-y-1.5 border-t pt-3 text-[0.8rem]"
              style={{ borderColor: "var(--rule)" }}
            >
              <div className="flex gap-2">
                <dt className="w-12 shrink-0 text-taupe">Top</dt>
                <dd>{product.notes.top}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-12 shrink-0 text-taupe">Heart</dt>
                <dd>{product.notes.heart}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-12 shrink-0 text-taupe">Base</dt>
                <dd>{product.notes.base}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div
          className="mt-auto flex items-center justify-between gap-3 border-t pt-4"
          style={{ borderColor: "var(--rule)" }}
        >
          <p className="text-[0.9rem]">
            {onSale && (
              <span className="mr-1.5 text-taupe line-through">
                {formatPrice(product.compare_minor)}
              </span>
            )}
            <span className={onSale ? "text-gold-ink" : ""}>
              {formatPrice(product.price_minor)}
            </span>
            <span className="text-taupe"> · {product.size_ml}ml</span>
          </p>

          {out ? (
            <span
              className="btn btn-ghost cursor-not-allowed text-[0.8rem] opacity-50"
              aria-disabled="true"
            >
              Sold out
            </span>
          ) : (
            <Link
              href={`/checkout?add=${product.slug}`}
              className="btn btn-ghost px-4 text-[0.8rem]"
            >
              Add
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
