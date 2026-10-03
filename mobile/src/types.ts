export type Product = {
  id: string;
  slug: string;
  name: string;
  family: string;
  blurb: string;
  notes: { top: string; heart: string; base: string };
  size_ml: number;
  price_minor: number;
  compare_minor: number;
  stock: number;
  hue: string;
  image: string | null;
  audience: string;
};

export type CartItem = { slug: string; qty: number };
