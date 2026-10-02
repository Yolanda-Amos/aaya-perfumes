"use client";

import Link from "next/link";
import Bottle from "./Bottle";
import { useCart } from "@/components/CartProvider";
import type { Match } from "@/lib/quiz";
import { formatPrice, FAMILY_LABEL } from "@/lib/products";

function Hero({ match }: { match: Match }) {
  const { add, setOpen } = useCart();
  const p = match.product;
  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1fr]">
      <Link
        href={`/fragrance/${p.slug}`}
        className="group relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[--radius-card] border transition-shadow duration-300 hover:shadow-[--shadow-lift]"
        style={{
          borderColor: "var(--rule)",
          background: `linear-gradient(168deg,
            color-mix(in oklab, ${p.hue} 26%, var(--color-cream)),
            var(--color-cream) 65%)`,
        }}
        aria-label={`View ${p.name}`}
      >
        <div className="transition-transform duration-500 group-hover:scale-105">
          <Bottle hue={p.hue} size="xl" />
        </div>
      </Link>

      <div className="flex flex-col justify-center">
        <p className="eyebrow">{FAMILY_LABEL[p.family]}</p>
        <h4 className="mt-2 font-display text-3xl">{p.name}</h4>
        <p className="mt-3 font-display text-2xl text-sage-deep">
          {formatPrice(p.price_minor)}
        </p>

        {match.reasons.length > 0 && (
          <ul className="mt-5 space-y-2">
            {match.reasons.map((r) => (
              <li key={r} className="flex gap-3 text-[0.92rem] leading-relaxed">
                <span aria-hidden="true" className="text-sage-mid">—</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              add(p.slug);
              setOpen(true);
            }}
            className="btn btn-primary"
          >
            Add to Cart
          </button>
          <Link href={`/fragrance/${p.slug}`} className="btn btn-ghost">
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}

/** "We found your scent." — the recommendation, with a way to retake. */
export default function QuizResult({
  personality,
  matches,
  onRetake,
  onBack,
}: {
  personality: string;
  matches: Match[];
  onRetake: () => void;
  onBack: () => void;
}) {
  const top = matches[0];

  return (
    <div className="swap mx-auto max-w-4xl">
      <p className="eyebrow">We found your scent</p>
      <h3 className="mt-3 font-display text-4xl sm:text-5xl">
        {personality || "Your signature scent"}
      </h3>

      {!top ? (
        <>
          <p className="mt-5 measure text-taupe">
            We could not match that combination. Try again — or browse the full
            collection.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onRetake} className="btn btn-primary">
              Retake quiz
            </button>
            <Link href="/#fragrances" className="btn btn-ghost">
              Browse fragrances
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="mt-4 measure text-taupe">
            We think you&rsquo;ll love{" "}
            <span className="font-medium text-espresso">{top.product.name}</span> —
            picked from the collection we actually stock, so you can order it today.
          </p>

          <Hero match={top} />

          {matches.length > 1 && (
            <>
              <h4 className="mt-14 font-display text-2xl">You might also like</h4>
              <ul className="mt-5 grid grid-cols-2 gap-4">
                {matches.slice(1).map((m) => (
                  <li key={m.product.id}>
                    <Link
                      href={`/fragrance/${m.product.slug}`}
                      className="flex items-center gap-4 rounded-[--radius-card] border bg-cream p-4 transition-shadow duration-300 hover:shadow-[--shadow-soft]"
                      style={{ borderColor: "var(--rule)" }}
                    >
                      <span
                        className="flex h-16 w-14 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: `color-mix(in oklab, ${m.product.hue} 20%, var(--color-cream))` }}
                      >
                        <Bottle hue={m.product.hue} size="sm" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-lg leading-tight">
                          {m.product.name}
                        </span>
                        <span className="text-[0.82rem] text-taupe">
                          {formatPrice(m.product.price_minor)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div
            className="mt-14 rounded-[--radius-card] border p-7 text-center"
            style={{ borderColor: "var(--rule)", background: "var(--color-sage)" }}
          >
            <p className="font-display text-2xl">Not quite your vibe?</p>
            <p className="mx-auto mt-2 measure-tight text-[0.9rem] text-taupe">
              Different answers lead to a different bottle. Nothing is lost by
              trying again.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={onRetake} className="btn btn-primary">
                Retake Quiz
              </button>
              <button type="button" onClick={onBack} className="btn btn-ghost bg-cream">
                Review my answers
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
