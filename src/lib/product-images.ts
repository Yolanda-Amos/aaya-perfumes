/**
 * Product photography.
 *
 * Maps each slug to its photograph under `public/products/`. These are the
 * real Naseem 24ml roll-ons, so the shop shows the bottle the customer
 * actually receives rather than an illustration of it.
 *
 * To add or swap a photo:
 *   1. Drop the file in `public/products/` using the filename below
 *      (lowercase, hyphenated, matching the slug).
 *   2. Add or change the slug here.
 *
 * Any product without an entry — or whose file is not on disk yet — renders
 * the tinted CSS bottle instead, so the shop never shows a broken image.
 */
export const PRODUCT_IMAGES: Record<string, string> = {
  // Oud and wood
  "oud-bushra": "/products/oud-bushra.jpg",
  "black-oud": "/products/black-oud.jpg",
  bukhoor: "/products/bukhoor.jpg",
  burhan: "/products/burhan.jpg",
  bushra: "/products/bushra.jpg",

  // Fresh and citrus
  jazi: "/products/jazi.jpg",
  nada: "/products/nada.jpg",
  niko: "/products/niko.jpg",
  spark: "/products/spark.jpg",
  yusra: "/products/yusra.jpg",

  // Floral and soft
  amani: "/products/amani.jpg",
  daliya: "/products/daliya.jpg",
  "jameelah-green": "/products/jameelah-green.jpg",
  lovely: "/products/lovely.jpg",

  // Sweet and warm
  azhar: "/products/azhar.jpg",
  "be-sugar": "/products/be-sugar.jpg",
  candy: "/products/candy.jpg",
  zahabia: "/products/zahabia.jpg",

  // Deep and spicy
  "al-aqmar": "/products/al-aqmar.jpg",
  dani: "/products/dani.jpg",
  sadaat: "/products/sadaat.jpg",
  tayiba: "/products/tayiba.jpg",

  // Floral, romantic
  juliet: "/products/juliet.jpg",
};

/** Path a product's photo is expected at, whether or not it has been added. */
export function productImagePath(slug: string): string {
  return PRODUCT_IMAGES[slug] ?? `/products/${slug}.jpg`;
}