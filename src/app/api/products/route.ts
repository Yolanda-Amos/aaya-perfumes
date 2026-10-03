import { NextResponse } from "next/server";
import { CATALOGUE } from "@/lib/products";

/**
 * GET /api/products — the catalogue, shared by the website and the
 * Aaya mobile app so both always show the same bottles and prices.
 * Prices are in kobo (price_minor); format them as ₦ on the client.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  const products = CATALOGUE.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    family: p.family,
    blurb: p.blurb,
    notes: p.notes,
    size_ml: p.size_ml,
    price_minor: p.price_minor,
    compare_minor: p.compare_minor,
    stock: p.stock,
    hue: p.hue,
    image: p.image ?? null,
    audience: p.audience,
  }));
  return NextResponse.json(
    { products },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
}
