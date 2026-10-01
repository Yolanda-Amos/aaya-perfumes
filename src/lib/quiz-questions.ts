import type { Family, Season, Occasion, Audience } from "./types";

/** The five questions. Each answer contributes weights, never a verdict. */
export type Question = {
  id: string;
  prompt: string;
  hint?: string;
  options: QuizOption[];
};

export type QuizOption = {
  id: string;
  label: string;
  blurb?: string;
  weights: Partial<Record<Dimension, string[]>>;
  intensity?: number;
};

export type Dimension = "family" | "season" | "occasion" | "audience";

export const QUESTIONS: Question[] = [
  {
    id: "moment",
    prompt: "When do you most want to be remembered?",
    hint: "Think about your most common day, not your best one.",
    options: [
      {
        id: "daily", label: "Every day, everywhere",
        blurb: "Something you never have to think about putting on.",
        weights: { occasion: ["daily"] }, intensity: 1,
      },
      {
        id: "work", label: "At work, around people",
        blurb: "Presentable, professional, not the loudest in the lift.",
        weights: { occasion: ["work"], family: ["musk", "woody"] }, intensity: 1,
      },
      {
        id: "evening", label: "Evenings out",
        blurb: "Dinner, a party, someone you want to remember you.",
        weights: { occasion: ["evening"] }, intensity: 2,
      },
      {
        id: "occasion", label: "Occasions that matter",
        blurb: "Weddings, gifting, the photograph people keep.",
        weights: { occasion: ["occasion"], family: ["oud", "sweet"] }, intensity: 3,
      },
    ],
  },
  {
    id: "feeling",
    prompt: "Which of these sounds most like you?",
    hint: "Go with instinct rather than the answer that sounds nicest.",
    options: [
      {
        id: "warm", label: "Warm and woody",
        blurb: "Sandalwood, cedar, a room with the curtains drawn.",
        weights: { family: ["woody"] },
      },
      {
        id: "oud", label: "Dark and smoky",
        blurb: "Incense, oud, resin. You like the serious ones.",
        weights: { family: ["oud"] },
      },
      {
        id: "fresh", label: "Fresh and clean",
        blurb: "Citrus, sea air. The first five minutes are the best five minutes.",
        weights: { family: ["fresh", "aquatic"] },
      },
      {
        id: "floral", label: "Soft and floral",
        blurb: "Rose, jasmine, powder. Gentle rather than loud.",
        weights: { family: ["floral"] },
      },
      {
        id: "sweet", label: "Sweet and edible",
        blurb: "Vanilla, caramel, dates. Comfort in a bottle.",
        weights: { family: ["sweet"] },
      },
      {
        id: "spicy", label: "Warm and spiced",
        blurb: "Cinnamon, cardamom, pepper. A little heat.",
        weights: { family: ["spicy"] },
      },
    ],
  },
  {
    id: "season",
    prompt: "What time of year is it when you reach for a bottle?",
    options: [
      {
        id: "summer", label: "Hot months",
        blurb: "You want something that does not fight the heat.",
        weights: { season: ["summer"] },
      },
      {
        id: "winter", label: "Cold months",
        blurb: "You want warmth that stays close to you.",
        weights: { season: ["winter"] },
      },
      {
        id: "allyear", label: "All year, honestly",
        blurb: "One bottle, worn every day, no seasons.",
        weights: { season: ["all-year"] },
      },
    ],
  },
  {
    id: "projection",
    prompt: "How far should it travel?",
    hint: "This is the question people most often get wrong about themselves.",
    options: [
      {
        id: "whisper", label: "Only me, at arm's length",
        blurb: "A private thing. People ask what you are wearing.",
        weights: { occasion: ["work", "daily"] }, intensity: 1,
      },
      {
        id: "room", label: "A conversation, not a room",
        blurb: "Noticeable up close, forgettable across a table.",
        weights: {}, intensity: 2,
      },
      {
        id: "roomfill", label: "Let it fill the room",
        blurb: "You would rather be asked about it than not.",
        weights: { occasion: ["evening", "occasion"] }, intensity: 3,
      },
    ],
  },
  {
    id: "for-whom",
    prompt: "Who is this bottle really for?",
    options: [
      { id: "her", label: "For me", weights: { audience: ["women", "unisex"] } },
      { id: "him", label: "For him", weights: { audience: ["men", "unisex"] } },
      { id: "anyone", label: "Whichever works", weights: { audience: ["unisex"] } },
    ],
  },
];

export type { Family, Season, Occasion, Audience };
