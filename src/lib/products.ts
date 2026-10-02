import type { Product } from "./types";
import { PART_ONE } from "./data/part-one";
import { PART_TWO } from "./data/part-two";
import { PART_THREE } from "./data/part-three";
import { PRODUCT_IMAGES } from "./product-images";

export * from "./types";

/* All 37 roll-ons from the Naseem 24ml collection, ₦12,500 each.
   `family`, `intensity`, `seasons`, `occasion` and the note
   pyramids are our own merchandising — the source site does not publish
   a note breakdown for this collection. Refine them as real supplier
   copy arrives.

   Photography is merged on here rather than written into the data files, so
   adding a photo means dropping a file in `public/products/` and nothing
   else. Products with no entry simply have no `image` and render the CSS
   bottle fallback. */
const ALL: Product[] = [...PART_ONE, ...PART_TWO, ...PART_THREE];

export const CATALOGUE: Product[] = ALL.map((p) => {
  const image = PRODUCT_IMAGES[p.slug];
  return image ? { ...p, image } : p;
});

export function bySlug(slug: string) {
  return CATALOGUE.find((p) => p.slug === slug);
}
