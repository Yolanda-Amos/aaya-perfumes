import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import { CATALOGUE, bySlug } from "@/lib/products";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) return { title: "Fragrance not found — Aaya Perfume" };
  return {
    title: `${product.name} — Aaya Perfume`,
    description: product.blurb,
  };
}

export default async function FragrancePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) notFound();

  // Same family first, then anything else — all from the real catalogue.
  const related = CATALOGUE.filter(
    (p) => p.slug !== product.slug && p.stock > 0
  )
    .sort((a, b) => {
      const aSame = a.family === product.family ? 0 : 1;
      const bSame = b.family === product.family ? 0 : 1;
      return aSame - bSame || a.name.localeCompare(b.name);
    })
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-24 border-t pt-14" style={{ borderColor: "var(--rule)" }}>
          <h2 className="font-display text-3xl">You might also like</h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}