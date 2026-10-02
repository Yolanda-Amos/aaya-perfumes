import type { Product } from "../types";

/** NADA → ZAHABIA. */
export const PART_THREE: Product[] = [
  {
    id: "nada", slug: "nada", name: "Nada", family: "fresh",
    blurb: "Cool citrus and green tea. Reads as expensive and quiet.",
    notes: { top: "Bergamot, lemon", heart: "Green tea, mint", base: "Vetiver, musk" },
    size_ml: 24, price_minor: 1250000, compare_minor: 1500000, stock: 24, hue: "#a8c4b0",
    audience: "unisex", intensity: 1, seasons: ["summer", "all-year"], occasion: ["work", "daily"],
  },
  {
    id: "niko", slug: "niko", name: "Niko", family: "aquatic",
    blurb: "Mineral and clean, with a grapefruit edge that keeps it awake.",
    notes: { top: "Grapefruit, bergamot", heart: "Marine, fig leaf", base: "Ambergris, cedar" },
    size_ml: 24, price_minor: 1250000, compare_minor: 1500000, stock: 23, hue: "#7fa0ad",
    audience: "men", intensity: 2, seasons: ["summer"], occasion: ["daily", "evening"],
  },
  {
    id: "oud-bushra", slug: "oud-bushra", name: "Oud Bushra", family: "oud",
    blurb: "Plain, strong and entirely unapologetic. Oud with nothing in the way.",
    notes: { top: "Cardamom", heart: "Rose, oud", base: "Amber, musk" },
    size_ml: 24, price_minor: 1250000, compare_minor: 1500000, stock: 13, hue: "#5c4636",
    audience: "men", intensity: 3, seasons: ["winter"], occasion: ["occasion", "evening"],
  },
  {
    id: "red-coral", slug: "red-coral", name: "Red Coral", family: "spicy",
    blurb: "Ripe fruit and warm spice — a sunset in a bottle.",
    notes: { top: "Mandarin, chili", heart: "Peony, plum", base: "Amber, sandalwood" },
    size_ml: 24, price_minor: 1250000, compare_minor: 1500000, stock: 18, hue: "#d1584f",
    audience: "women", intensity: 2, seasons: ["summer", "all-year"], occasion: ["evening", "daily"],
  },
  {
    id: "romeo", slug: "romeo", name: "Romeo", family: "spicy",
    blurb: "Bold and romantic — leather, spice and a warm rose heart.",
    notes: { top: "Black pepper, bergamot", heart: "Rose, cinnamon", base: "Leather, oud" },
    size_ml: 24, price_minor: 1250000, compare_minor: 1500000, stock: 20, hue: "#9c3f3a",
    audience: "men", intensity: 3, seasons: ["winter"], occasion: ["evening", "occasion"],
  },
  {
    id: "sadaat", slug: "sadaat", name: "Sadaat", family: "musk",
    blurb: "A soft, enveloping musk that sits under everything else.",
    notes: { top: "Pear, aldehydes", heart: "Musk, jasmine", base: "Sandalwood, cashmere" },
    size_ml: 24, price_minor: 1250000, compare_minor: 1500000, stock: 25, hue: "#ddd4c6",
    audience: "unisex", intensity: 1, seasons: ["all-year"], occasion: ["work", "daily"],
  },
  {
    id: "sakina", slug: "sakina", name: "Sakina", family: "floral",
    blurb: "White floral and incense — refined, and a little formal.",
    notes: { top: "Bergamot, saffron", heart: "Jasmine, tuberose", base: "Incense, musk" },
    size_ml: 24, price_minor: 1250000, compare_minor: 1500000, stock: 17, hue: "#e8dcc4",
    audience: "women", intensity: 2, seasons: ["all-year"], occasion: ["work", "occasion"],
  },
  {
    id: "spark", slug: "spark", name: "Spark", family: "fresh",
    blurb: "Fast, bright and gone by lunchtime — in the best way.",
    notes: { top: "Lemon, pink pepper", heart: "Mint, jasmine", base: "Musk, cedar" },
    size_ml: 24, price_minor: 1250000, compare_minor: 1500000, stock: 26, hue: "#f0d98c",
    audience: "unisex", intensity: 1, seasons: ["summer"], occasion: ["daily", "work"],
  },
  {
    id: "tayiba", slug: "tayiba", name: "Tayiba", family: "spicy",
    blurb: "Warm and architectural — a spice blend with real structure.",
    notes: { top: "Cardamom, lemon", heart: "Clove, cinnamon", base: "Oud, amber" },
    size_ml: 24, price_minor: 1250000, compare_minor: 1500000, stock: 19, hue: "#b06a3c",
    audience: "unisex", intensity: 2, seasons: ["winter"], occasion: ["work", "evening"],
  },
  {
    id: "thaljee", slug: "thaljee", name: "Thaljee", family: "fresh",
    blurb: "Green and herbal, with a cucumber snap on the opening.",
    notes: { top: "Cucumber, basil", heart: "Sage, geranium", base: "Vetiver, musk" },
    size_ml: 24, price_minor: 1250000, compare_minor: 1500000, stock: 22, hue: "#a3c3a1",
    audience: "unisex", intensity: 1, seasons: ["summer", "all-year"], occasion: ["daily", "work"],
  },
  {
    id: "yusra", slug: "yusra", name: "Yusra", family: "sweet",
    blurb: "Softly sweet, warmly spiced, easy to wear every single day.",
    notes: { top: "Bergamot, honey", heart: "Rose, jasmine", base: "Vanilla, sandalwood" },
    size_ml: 24, price_minor: 1250000, compare_minor: 1500000, stock: 24, hue: "#dda87f",
    audience: "women", intensity: 2, seasons: ["all-year"], occasion: ["daily", "work"],
  },
  {
    id: "zahabia", slug: "zahabia", name: "Zahabia", family: "floral",
    blurb: "Golden florals over amber — named for gold, and it earns it.",
    notes: { top: "Apricot, saffron", heart: "Orange blossom, jasmine", base: "Amber, musk" },
    size_ml: 24, price_minor: 1250000, compare_minor: 1500000, stock: 0, hue: "#d8b26a",
    audience: "women", intensity: 2, seasons: ["all-year"], occasion: ["occasion", "evening"],
  },
];
