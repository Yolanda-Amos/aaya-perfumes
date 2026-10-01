import type { Product } from "../types";

/** AFZAL → JAMEELAH RED. All Dhs 15.75 (was 21.00), 24ml roll-on. */
export const PART_ONE: Product[] = [
  {
    id: "afzal", slug: "afzal", name: "Afzal", family: "woody",
    blurb: "Polished woods over a soft amber — the one you wear to be taken seriously.",
    notes: { top: "Bergamot, pink pepper", heart: "Cedar, cypress", base: "Sandalwood, amber" },
    size_ml: 24, price_minor: 1575, compare_minor: 2100, stock: 24, hue: "#b08d57",
    audience: "men", intensity: 2, seasons: ["all-year"], occasion: ["work", "daily"],
  },
  {
    id: "al-aqmar", slug: "al-aqmar", name: "Al Aqmar", family: "woody",
    blurb: "Dry, quiet and unmistakably woody. Sits close and stays all day.",
    notes: { top: "Grapefruit peel", heart: "Vetiver, iris", base: "Oakmoss, sandalwood" },
    size_ml: 24, price_minor: 1575, compare_minor: 2100, stock: 20, hue: "#9a8465",
    audience: "unisex", intensity: 1, seasons: ["all-year"], occasion: ["work", "daily"],
  },
  {
    id: "amani", slug: "amani", name: "Amani", family: "floral",
    blurb: "A bright floral that opens fast and never turns heavy.",
    notes: { top: "Pear, lemon leaf", heart: "Peony, jasmine", base: "White musk, cedar" },
    size_ml: 24, price_minor: 1575, compare_minor: 2100, stock: 30, hue: "#e6b9bf",
    audience: "women", intensity: 2, seasons: ["summer", "all-year"], occasion: ["daily", "work"],
  },
  {
    id: "azhar", slug: "azhar", name: "Azhar", family: "spicy",
    blurb: "Warm spice and citrus peel — festive without being sweet.",
    notes: { top: "Cardamom, orange peel", heart: "Cinnamon, rose", base: "Labdanum, tonka" },
    size_ml: 24, price_minor: 1575, compare_minor: 2100, stock: 18, hue: "#c2703f",
    audience: "unisex", intensity: 2, seasons: ["winter", "all-year"], occasion: ["evening", "occasion"],
  },
  {
    id: "be-sugar", slug: "be-sugar", name: "Be Sugar", family: "sweet",
    blurb: "Caramel and vanilla, kept deliberately light by a citric edge.",
    notes: { top: "Mandarin", heart: "Caramel, heliotrope", base: "Vanilla, praline" },
    size_ml: 24, price_minor: 1575, compare_minor: 2100, stock: 26, hue: "#e0b877",
    audience: "women", intensity: 2, seasons: ["winter"], occasion: ["evening", "daily"],
  },
  {
    id: "black-oud", slug: "black-oud", name: "Black Oud", family: "oud",
    blurb: "The heaviest thing on the shelf. Smoky, animalic, unforgettable.",
    notes: { top: "Saffron", heart: "Rose, frankincense", base: "Oud, amber, leather" },
    size_ml: 24, price_minor: 1575, compare_minor: 2100, stock: 0, hue: "#2b2320",
    audience: "unisex", intensity: 3, seasons: ["winter"], occasion: ["occasion", "evening"],
  },
  {
    id: "bukhoor", slug: "bukhoor", name: "Bukhoor", family: "oud",
    blurb: "Incense smoke and sandalwood — a masjid at dusk.",
    notes: { top: "Cloves, lemon", heart: "Frankincense, myrrh", base: "Sandalwood, oud" },
    size_ml: 24, price_minor: 1575, compare_minor: 2100, stock: 15, hue: "#8c6a4e",
    audience: "men", intensity: 3, seasons: ["winter"], occasion: ["occasion", "evening"],
  },
  {
    id: "burhan", slug: "burhan", name: "Burhan", family: "woody",
    blurb: "Clean woods and a whisper of smoke. Modern and easy to wear.",
    notes: { top: "Grapefruit, sage", heart: "Cedar, tobacco leaf", base: "Vetiver, musk" },
    size_ml: 24, price_minor: 1575, compare_minor: 2100, stock: 22, hue: "#a89478",
    audience: "men", intensity: 2, seasons: ["all-year"], occasion: ["daily", "work"],
  },
  {
    id: "bushra", slug: "bushra", name: "Bushra", family: "spicy",
    blurb: "Sweet heat — dates and spice over a soft amber base.",
    notes: { top: "Cinnamon, dates", heart: "Rose, geranium", base: "Amber, vanilla" },
    size_ml: 24, price_minor: 1575, compare_minor: 2100, stock: 19, hue: "#b5754a",
    audience: "unisex", intensity: 2, seasons: ["winter", "all-year"], occasion: ["evening", "occasion"],
  },
  {
    id: "candy", slug: "candy", name: "Candy", family: "sweet",
    blurb: "Sugar, cherry and vanilla. Exactly what it says on the label.",
    notes: { top: "Red cherry, lemon", heart: "Jasmine, sugar", base: "Vanilla, tonka" },
    size_ml: 24, price_minor: 1575, compare_minor: 2100, stock: 28, hue: "#e58a94",
    audience: "women", intensity: 2, seasons: ["all-year"], occasion: ["daily", "evening"],
  },
  {
    id: "daliya", slug: "daliya", name: "Daliya", family: "floral",
    blurb: "Soft rose and powdery musk — the quietest floral here.",
    notes: { top: "Lychee, bergamot", heart: "Rose, peony", base: "Musk, cashmere" },
    size_ml: 24, price_minor: 1575, compare_minor: 2100, stock: 25, hue: "#dba7a4",
    audience: "unisex", intensity: 1, seasons: ["all-year"], occasion: ["daily", "work"],
  },
  {
    id: "dani", slug: "dani", name: "Dani", family: "musk",
    blurb: "Skin musk and a little sandalwood. It disappears, then reappears.",
    notes: { top: "Aldehydes", heart: "Musk, linen", base: "Sandalwood, ambrette" },
    size_ml: 24, price_minor: 1575, compare_minor: 2100, stock: 23, hue: "#cfc0ae",
    audience: "unisex", intensity: 1, seasons: ["all-year"], occasion: ["work", "daily"],
  },
];
