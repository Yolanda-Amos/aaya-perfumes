"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { CATALOGUE, FAMILY_LABEL, type Audience, type Family, type Product } from "@/lib/products";

type Filter = "all" | Family | Audience;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "floral", label: FAMILY_LABEL.floral },
  { id: "fresh", label: FAMILY_LABEL.fresh },
  { id: "sweet", label: FAMILY_LABEL.sweet },
  { id: "oud", label: FAMILY_LABEL.oud },
  { id: "woody", label: FAMILY_LABEL.woody },
  { id: "musk", label: FAMILY_LABEL.musk },
  { id: "spicy", label: FAMILY_LABEL.spicy },
  { id: "unisex", label: "Unisex" },
  { id: "women", label: "For her" },
  { id: "men", label: "For him" },
];

/** The collection, filtered by family or audience. Two-up on mobile. */
export default function ShopGrid({ products }: { products: Product[] }) {
  return (
    <Suspense fallback={<GridFallback />}>
      <Grid products={products} />
    </Suspense>
  );
}

function GridFallback() {
  return (
    <div className="h-40 animate-pulse rounded-[--radius-card] bg-sage" />
  );
}

function Grid({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const q = params.get("q");
    if (q) setQuery(q);
  }, [params]);

  // The navbar search prefills this via ?q=rose.
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesFilter =
        filter === "all" || p.audience === filter || p.family === filter;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q) ||
        p.notes.top.toLowerCase().includes(q) ||
        p.notes.heart.toLowerCase().includes(q) ||
        p.notes.base.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [products, filter, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex flex-wrap gap-2" role="group" aria-label="Filter fragrances">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-[0.8rem] transition-colors duration-200 ${
                  active
                    ? "border-espresso bg-espresso text-ivory"
                    : "border-line bg-cream text-espresso/80 hover:border-sage-mid"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <label className="lg:w-64">
          <span className="sr-only">Search fragrances</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes or name"
            className="field"
          />
        </label>
      </div>

      <p className="mt-5 text-[0.85rem] text-taupe" aria-live="polite">
        Showing {visible.length} of {CATALOGUE.length} fragrances
      </p>

      {visible.length === 0 ? (
        <div
          className="mt-10 rounded-[--radius-card] border border-dashed p-12 text-center"
          style={{ borderColor: "var(--rule)" }}
        >
          <p className="font-display text-2xl">Nothing matches that</p>
          <p className="mx-auto mt-2 max-w-sm text-[0.9rem] text-taupe">
            Try a different family, or clear the search to see all{" "}
            {CATALOGUE.length} bottles.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setQuery("");
            }}
            className="btn btn-primary mt-6"
          >
            Show all fragrances
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}