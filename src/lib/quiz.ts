import type { Family, Product, Season, Occasion, Audience } from "./types";
import { QUESTIONS } from "./quiz-questions";

/** Scored match, with the reason we can honestly show the shopper. */
export type Match = {
  product: Product;
  score: number;
  /** Plain-language reasons, traceable to one of their own choices. */
  reasons: string[];
};

const WEIGHT = 10;
const INTENSITY_WEIGHT = 7;
const SEASON_WEIGHT = 6;
const OCCASION_WEIGHT = 8;
const AUDIENCE_WEIGHT = 4;

/**
 * Scores the catalogue against a set of answers.
 *
 * Deliberately simple and explainable — every match traces back to one of
 * the shopper's own choices, so the "why" we show them is honest rather
 * than decorative.
 */
export function recommend(
  answers: Record<string, string>,
  products: Product[],
  limit = 3
): Match[] {
  // Never recommend something they cannot buy.
  const buyable = products.filter((p) => p.stock > 0);
  if (!buyable.length) return [];

  const chosen = QUESTIONS.map((q) => ({
    question: q,
    option: q.options.find((o) => o.id === answers[q.id]),
  })).filter((c) => Boolean(c.option));

  if (!chosen.length) return [];

  const families = new Set<Family>();
  const seasons = new Set<Season>();
  const occasions = new Set<Occasion>();
  const audiences = new Set<Audience>();
  const intensities: number[] = [];

  for (const { option } of chosen) {
    if (!option) continue;
    (option.weights.family ?? []).forEach((f) => families.add(f as Family));
    (option.weights.season ?? []).forEach((s) => seasons.add(s as Season));
    (option.weights.occasion ?? []).forEach((o) => occasions.add(o as Occasion));
    (option.weights.audience ?? []).forEach((a) => audiences.add(a as Audience));
    if (option.intensity) intensities.push(option.intensity);
  }

  const targetIntensity = intensities.length
    ? intensities.reduce((a, b) => a + b, 0) / intensities.length
    : 0;

  const scored: Match[] = buyable.map((product) => {
    let score = 0;
    const reasons: string[] = [];

    if (families.has(product.family)) {
      score += WEIGHT;
      reasons.push(`It is ${product.family}-led, which is the family you chose.`);
    }
    if (product.seasons.some((s) => seasons.has(s))) {
      score += SEASON_WEIGHT;
      reasons.push("It suits the time of year you described.");
    }
    if (product.occasion.some((o) => occasions.has(o))) {
      score += OCCASION_WEIGHT;
      reasons.push("It is built for the moments you named.");
    }
    if (audiences.has(product.audience)) {
      score += AUDIENCE_WEIGHT;
    }
    if (targetIntensity) {
      const distance = Math.abs(product.intensity - targetIntensity);
      // Full marks at the exact level, tapering to a third two steps away.
      score += INTENSITY_WEIGHT * (1 - distance / 3);
      if (distance === 0) {
        reasons.push(
          product.intensity === 1
            ? "It sits close to the skin, as you asked."
            : product.intensity === 2
              ? "Its projection is the middle ground you picked."
              : "It fills a room, as you wanted."
        );
      }
    }

    return { product, score, reasons: reasons.slice(0, 2) };
  });

  return scored
    .filter((m) => m.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name)
    )
    .slice(0, limit);
}
