import type { Product } from "./types";
import { PART_ONE } from "./data/part-one";
import { PART_TWO } from "./data/part-two";
import { PART_THREE } from "./data/part-three";

export * from "./types";

/* All 37 roll-ons from the Naseem 24ml collection, ₦12,500 each.
   `family`, `intensity`, `seasons`, `occasion` and the note
   pyramids are our own merchandising — the source site does not publish
   a note breakdown for this collection. Refine them as real supplier
   copy arrives. */
export const CATALOGUE: Product[] = [...PART_ONE, ...PART_TWO, ...PART_THREE];

export function bySlug(slug: string) {
  return CATALOGUE.find((p) => p.slug === slug);
}
