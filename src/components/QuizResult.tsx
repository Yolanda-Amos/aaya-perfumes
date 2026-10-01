"use client";

import Link from "next/link";
import { formatPrice, FAMILY_LABEL } from "@/lib/products";
import type { Match } from "@/lib/quiz";
import Bottle from "./Bottle";

/** The results screen. Shown once all questions are answered. */
export default function QuizResult({
  matches,
  onRetake,
}: {
  matches: Match[];
  onRetake: () => void;
}) {
  const top = matches[0];

  return (
    <div className="rise">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="tag">Your match</p>
          <h3 className="mt-2 font-display text-4xl">
            {top ? `Start with ${top.product.name}` : "No match yet"}
          </h3>
        </div>
        <button type="button" onClick={onRetake} className="btn btn-ghost">
          Retake the quiz
        </button>
      </div>

      {matches.length === 0 ? (
        <>
          <p className="mt-6 measure text-cocoa">
            We could not match that combination. Try choosing again — or browse the
            full collection below.
          </p>
        </>
      ) : (
        <>
          <p className="mt-4 measure text-cocoa">
            Three from the 24ml collection, chosen from your answers. Every bottle
            is Dhs 15.75, so trying more than one costs less than a coffee.
          </p>

          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {matches.map((match, i) => (
              <li
                key={match.product.id}
                className="flex flex-col border bg-porcelain p-5"
                style={{ borderColor: "var(--rule)" }}
              >
                {i === 0 && (
                  <p className="mb-3 self-start bg-espresso px-2.5 py-1 text-[0.7rem] tracking-[.08em] text-ivory">
                    Closest match
                  </p>
                )}
                <div className="flex flex-1 items-center justify-center py-4">
                  <Bottle hue={match.product.hue} size="sm" />
                </div>
                <p className="tag">{FAMILY_LABEL[match.product.family]}</p>
                <h4 className="mt-1 font-display text-2xl">
                  {match.product.name}
                </h4>
                <ul className="mt-3 space-y-1.5 text-[0.85rem] text-cocoa">
                  {match.reasons.map((reason) => (
                    <li key={reason} className="flex gap-2">
                      <span aria-hidden="true" className="text-gold-ink">
                        —
                      </span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[0.9rem] font-medium">
                  {formatPrice(match.product.price_minor)}
                </p>
                <Link
                  href={`/checkout?add=${match.product.slug}`}
                  className="btn btn-ghost mt-3 w-full text-[0.85rem]"
                  aria-disabled={match.product.stock === 0}
                >
                  {match.product.stock === 0 ? "Sold out" : "Add to bag"}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
