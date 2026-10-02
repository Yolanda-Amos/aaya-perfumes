"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import type { Family, Product } from "@/lib/products";

export type Mood = "fresh" | "sweet" | "floral" | "bold";

export const MOODS: {
  id: Mood;
  name: string;
  line: string;
  /** Which real product families satisfy this mood. */
  families: Family[];
  wash: string;
}[] = [
  {
    id: "fresh", name: "Fresh", line: "Clean, airy and effortless.",
    families: ["fresh", "aquatic", "musk"], wash: "var(--color-sage)",
  },
  {
    id: "sweet", name: "Sweet", line: "Playful, warm and irresistible.",
    families: ["sweet", "musk"], wash: "var(--color-peach)",
  },
  {
    id: "floral", name: "Floral", line: "Soft, feminine and romantic.",
    families: ["floral", "musk"], wash: "var(--color-rose-soft)",
  },
  {
    id: "bold", name: "Bold", line: "Confident, mysterious and memorable.",
    families: ["oud", "spicy", "woody"], wash: "#e6e0d5",
  },
];

export function matchesMood(product: Product, mood: Mood) {
  return MOODS.find((m) => m.id === mood)!.families.includes(product.family);
}

/** "What's your mood today?" — browsable, and it filters the real catalogue. */
export default function MoodSection({ products }: { products: Product[] }) {
  const [active, setActive] = useState<Mood | null>(null);

  const picks = useMemo(() => {
    if (!active) return [];
    return products
      .filter((p) => matchesMood(p, active) && p.stock > 0)
      .slice(0, 4);
  }, [products, active]);

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOODS.map((mood) => {
          const on = active === mood.id;
          return (
            <li key={mood.id}>
              <button
                type="button"
                onClick={() => setActive(on ? null : mood.id)}
                aria-pressed={on}
                className={`group h-full w-full rounded-[--radius-card] border p-6 text-left transition-all duration-300 ${
                  on ? "border-sage-mid shadow-[--shadow-lift]" : "border-line hover:border-sage-mid"
                }`}
                style={{ background: mood.wash }}
              >
                <h3 className="font-display text-2xl">{mood.name}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-espresso/70">
                  {mood.line}
                </p>
                <p className="mt-4 text-[0.78rem] font-medium text-sage-deep">
                  {on ? "Showing these" : `Show ${mood.name.toLowerCase()}`}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      {active && (
        <div className="mt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-2xl">
              {MOODS.find((m) => m.id === active)!.name} fragrances
            </h3>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="text-[0.85rem] text-taupe underline-offset-4 hover:text-espresso hover:underline"
            >
              Clear
            </button>
          </div>

          {picks.length === 0 ? (
            <p className="mt-6 text-taupe">
              Nothing in this mood right now — try another.
            </p>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {picks.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}