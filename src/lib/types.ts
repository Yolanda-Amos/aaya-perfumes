export type Note = { top: string; heart: string; base: string };

/** Olfactive families. The quiz scores against these. */
export type Family =
  | "oud"
  | "floral"
  | "fresh"
  | "woody"
  | "musk"
  | "sweet"
  | "spicy"
  | "aquatic";

export type Audience = "women" | "men" | "unisex";
export type Season = "summer" | "winter" | "all-year";
export type Occasion = "daily" | "work" | "evening" | "occasion";

export type Product = {
  id: string;
  slug: string;
  name: string;
  family: Family;
  /** Short line for the card — a sentence, not a paragraph. */
  blurb: string;
  notes: Note;
  size_ml: number;
  /** Minor units in kobo: 1250000 = ₦12,500. */
  price_minor: number;
  /** Struck-through "was" price, in minor units. */
  compare_minor: number;
  stock: number;
  /** Glass tint for the bottle illustration. */
  hue: string;
  /**
   * Photograph of the real bottle, relative to `public/`.
   * Merged in from `lib/product-images.ts` rather than the data files so the
   * photography set stays in one editable place. When this is absent — or the
   * file has not been added yet — `ProductImage` falls back to the CSS bottle.
   */
  image?: string;
  /** Drives the men / women / unisex filter. */
  audience: Audience;
  /** 1 = close to skin, 3 = fills a room. Feeds the quiz. */
  intensity: 1 | 2 | 3;
  seasons: Season[];
  occasion: Occasion[];
};

export const AUDIENCE_LABEL: Record<Audience, string> = {
  women: "For her",
  men: "For him",
  unisex: "Unisex",
};

export const FAMILY_LABEL: Record<Family, string> = {
  oud: "Oud",
  floral: "Floral",
  fresh: "Fresh",
  woody: "Woody",
  musk: "Musk",
  sweet: "Sweet",
  spicy: "Spicy",
  aquatic: "Aquatic",
};

export const SEASON_LABEL: Record<Season, string> = {
  summer: "Summer",
  winter: "Winter",
  "all-year": "All year",
};

export const OCCASION_LABEL: Record<Occasion, string> = {
  daily: "Every day",
  work: "The office",
  evening: "Evenings out",
  occasion: "Occasions",
};

export const CURRENCY = "NGN";

/** Prices are stored in kobo (minor units) so 1250000 renders as ₦12,500. */
export function formatPrice(minor: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(minor / 100)
    .replace("NGN", "₦");
}
