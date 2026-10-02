"use client";

import { useState } from "react";
import Image from "next/image";
import Bottle from "./Bottle";
import type { Product } from "@/lib/types";

/** Fixed footprints, used for the fallback bottle and `fit="contain"`. */
const BOX = {
  sm: "h-20 w-8",
  md: "h-32 w-12",
  lg: "h-56 w-20",
  xl: "h-80 w-28",
} as const;

/**
 * The product's photograph, with the tinted CSS bottle as a fallback.
 *
 * The photographs are added to `public/products/` as files are supplied. Until
 * a given file exists — or if it is renamed or corrupt — the browser fires an
 * error on the <img> and we swap in the bottle illustration rather than
 * showing a broken-image icon. `Product.image` being absent skips the <img>
 * entirely, so nothing 404s for products that have no photo yet.
 *
 * `fit`:
 *   "cover"  — fills the frame. The roll-on shots are styled scenes (moss,
 *              snow, beach), so the photography *is* the product image and
 *              should fill its card edge to edge. Used on cards and detail.
 *   "contain"— whole bottle, letterboxed on the tinted panel. Used where the
 *              bottle needs to sit on the brand colour rather than in a
 *              scene, and for small thumbnails.
 *
 * With `fit="cover"` the element fills its nearest positioned parent, so the
 * parent must set the frame (aspect ratio, rounding, overflow).
 */
export default function ProductImage({
  product,
  size = "lg",
  fit = "cover",
  label,
  priority = false,
  className = "",
}: {
  product: Product;
  /** Box size for the fallback bottle and for `fit="contain"`. */
  size?: keyof typeof BOX;
  fit?: "cover" | "contain";
  /** Accessible description. Defaults to the product name. */
  label?: string;
  /** Set on the first card or two so the image is not lazy-loaded. */
  priority?: boolean;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const alt = label ?? product.name;
  const src = product.image;

  // No photo mapped, or the file failed to load — draw the bottle instead.
  if (!src || broken) {
    return (
      <div className={className}>
        <Bottle
          hue={product.hue}
          size={size}
          label={product.image ? `${alt} — photograph unavailable` : alt}
        />
      </div>
    );
  }

  return (
    <div
      className={
        fit === "cover"
          ? `absolute inset-0 ${className}`
          : `relative ${BOX[size]} ${className}`
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        // Tall narrow shots on cards, larger frame on the detail page.
        sizes={
          fit === "cover"
            ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            : "(max-width: 640px) 40vw, 20vw"
        }
        className={fit === "cover" ? "object-cover" : "object-contain"}
        priority={priority}
        onError={() => setBroken(true)}
      />
    </div>
  );
}

/** Small square thumbnail used in the cart drawer. */
export function ProductImageThumb({ product }: { product: Product }) {
  const [broken, setBroken] = useState(false);
  const src = product.image;

  if (!src || broken) {
    return (
      <div
        className="flex h-24 w-20 shrink-0 items-center justify-center rounded-xl border"
        style={{
          borderColor: "var(--rule)",
          background: `linear-gradient(165deg, color-mix(in oklab, ${product.hue} 24%, var(--color-cream)), var(--color-cream))`,
        }}
      >
        <Bottle hue={product.hue} size="sm" />
      </div>
    );
  }

  return (
    <div
      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border"
      style={{
        borderColor: "var(--rule)",
        background: `linear-gradient(165deg, color-mix(in oklab, ${product.hue} 24%, var(--color-cream)), var(--color-cream))`,
      }}
    >
      <Image
        src={src}
        alt={product.name}
        fill
        sizes="80px"
        className="object-contain p-1"
        onError={() => setBroken(true)}
      />
    </div>
  );
}