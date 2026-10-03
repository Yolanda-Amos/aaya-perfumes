import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

/**
 * A product photograph in the signature mihrab arch, with an optional
 * brass outline floating just outside it.
 *
 * Server component: the photo is a remote Naseem image, so if one ever
 * fails to load the arch simply shows its tinted background.
 */
export default function ArchPhoto({
  product,
  className = "",
  outline = false,
  priority = false,
  sizes = "(max-width: 640px) 45vw, 22vw",
  link = false,
  style,
}: {
  product: Product;
  className?: string;
  outline?: boolean;
  priority?: boolean;
  sizes?: string;
  link?: boolean;
  style?: React.CSSProperties;
}) {
  const inner = (
    <>
      {outline && <span className="arch-line" aria-hidden="true" />}
      <div
        className="arch h-full w-full"
        style={{
          background: `linear-gradient(170deg, color-mix(in oklab, ${product.hue} 35%, var(--color-ivory)), var(--color-ivory))`,
        }}
      >
        {product.image && (
          <Image
            src={product.image}
            alt={`${product.name} 24ml roll-on`}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          />
        )}
      </div>
    </>
  );

  // The sizing classes go on the outermost element so width/aspect work
  // whether or not the arch is wrapped in a link.
  if (!link) {
    return (
      <div className={`relative ${className}`} style={style}>
        {inner}
      </div>
    );
  }
  return (
    <Link
      href={`/fragrance/${product.slug}`}
      className={`group relative block ${className}`}
      style={style}
      aria-label={`View ${product.name}`}
    >
      {inner}
    </Link>
  );
}
