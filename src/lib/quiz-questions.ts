import type { Family, Season, Occasion, Audience } from "./types";

export type Dimension = "family" | "season" | "occasion" | "audience";

export type QuizOption = {
  id: string;
  label: string;
  blurb?: string;
  weights: Partial<Record<Dimension, string[]>>;
  intensity?: number;
  /** Shown as "Your fragrance personality" on the result screen. */
  personality?: string;
  /** Botanical mark drawn on the answer card. */
  glyph?: "leaf" | "bloom" | "sun" | "moon" | "spark" | "drop";
};

export type Question = {
  id: string;
  prompt: string;
  hint?: string;
  options: QuizOption[];
};

/**
 * Five questions. Each answer contributes weights rather than a verdict,
 * so recommend() can score the real catalogue and explain the match.
 *
 * "Fruity" is not a family in the product data, so it maps onto the sweet
 * and fresh families, which is what fruity notes are actually built from.
 */
export const QUESTIONS: Question[] = [
  {
    id: "mood",
    prompt: "What kind of mood do you want your fragrance to create?",
    hint: "Go with instinct rather than the answer that sounds nicest.",
    options: [
      {
        id: "fresh", label: "Fresh & Clean", glyph: "leaf",
        blurb: "Light on the skin, easy all day.",
        weights: { family: ["fresh", "aquatic", "musk"] }, intensity: 1,
        personality: "Fresh & Effortless",
      },
      {
        id: "romantic", label: "Soft & Romantic", glyph: "bloom",
        blurb: "Something that lingers gently.",
        weights: { family: ["floral", "musk"] }, intensity: 1,
        personality: "Soft & Feminine",
      },
      {
        id: "sweet", label: "Sweet & Playful", glyph: "spark",
        blurb: "Warm, edible, a little fun.",
        weights: { family: ["sweet"] }, intensity: 2,
        personality: "Sweet & Playful",
      },
      {
        id: "bold", label: "Bold & Confident", glyph: "sun",
        blurb: "Present from the moment you walk in.",
        weights: { family: ["oud", "spicy", "woody"] }, intensity: 3,
        personality: "Confident & Mysterious",
      },
    ],
  },
  {
    id: "setting",
    prompt: "Which setting sounds most like you?",
    options: [
      {
        id: "morning", label: "A sunny morning", glyph: "sun",
        blurb: "Light, clean, nothing heavy.",
        weights: { season: ["summer", "all-year"], occasion: ["daily", "work"] },
        intensity: 1,
      },
      {
        id: "evening", label: "A romantic evening", glyph: "moon",
        blurb: "Soft light and something warm.",
        weights: { season: ["winter"], occasion: ["evening"] }, intensity: 2,
      },
      {
        id: "friends", label: "A day out with friends", glyph: "drop",
        blurb: "Easy, fun, never too much.",
        weights: { season: ["all-year"], occasion: ["daily"] }, intensity: 1,
      },
      {
        id: "occasion", label: "A special occasion", glyph: "spark",
        blurb: "Wedding, gifting, the photo people keep.",
        weights: { season: ["winter", "all-year"], occasion: ["occasion"] },
        intensity: 3,
      },
    ],
  },
  {
    id: "family",
    prompt: "Which scent family attracts you most?",
    options: [
      {
        id: "floral", label: "Floral", glyph: "bloom",
        blurb: "Rose, jasmine, soft petals.",
        weights: { family: ["floral"] },
      },
      {
        id: "fruity", label: "Fruity", glyph: "drop",
        blurb: "Citrus and ripe fruit — built from fresh and sweet notes.",
        weights: { family: ["fresh", "aquatic", "sweet"] },
      },
      {
        id: "fresh", label: "Fresh", glyph: "leaf",
        blurb: "Green, aquatic, air.",
        weights: { family: ["fresh", "aquatic"] },
      },
      {
        id: "warm", label: "Warm & Sensual", glyph: "moon",
        blurb: "Oud, spice, deep woods.",
        weights: { family: ["oud", "spicy", "woody"] },
      },
    ],
  },
  {
    id: "impression",
    prompt: "How do you want people to experience your scent?",
    options: [
      {
        id: "so-fresh", label: "“She smells so fresh.”", glyph: "leaf",
        blurb: "Clean, like the air after rain.",
        weights: { family: ["fresh", "aquatic", "musk"] }, intensity: 1,
        personality: "Fresh & Effortless",
      },
      {
        id: "so-sweet", label: "“She smells so sweet.”", glyph: "spark",
        blurb: "Warm and a little addictive.",
        weights: { family: ["sweet", "floral"] }, intensity: 2,
        personality: "Sweet & Playful",
      },
      {
        id: "so-elegant", label: "“She smells so elegant.”", glyph: "bloom",
        blurb: "Polished and put together.",
        weights: { family: ["musk", "woody", "floral"] }, intensity: 2,
        personality: "Soft & Feminine",
      },
      {
        id: "unforgettable", label: "“She smells unforgettable.”", glyph: "sun",
        blurb: "The one people remember.",
        weights: { family: ["oud", "spicy", "woody"] }, intensity: 3,
        personality: "Confident & Mysterious",
      },
    ],
  },
  {
    id: "personality",
    prompt: "Choose your fragrance personality.",
    options: [
      {
        id: "soft", label: "Soft & feminine", glyph: "bloom",
        blurb: "Gentle, pretty, quietly lovely.",
        weights: { family: ["floral", "musk"] }, intensity: 1,
        personality: "Soft & Feminine",
      },
      {
        id: "effortless", label: "Fresh & effortless", glyph: "leaf",
        blurb: "Nothing to prove.",
        weights: { family: ["fresh", "aquatic"] }, intensity: 1,
        personality: "Fresh & Effortless",
      },
      {
        id: "playful", label: "Sweet & playful", glyph: "spark",
        blurb: "Warm, fun, a little mischief.",
        weights: { family: ["sweet"] }, intensity: 2,
        personality: "Sweet & Playful",
      },
      {
        id: "mysterious", label: "Confident & mysterious", glyph: "moon",
        blurb: "A little withholding.",
        weights: { family: ["oud", "spicy", "woody"] }, intensity: 3,
        personality: "Confident & Mysterious",
      },
    ],
  },
];

export type { Family, Season, Occasion, Audience };
