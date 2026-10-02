import type { Product } from "@/lib/types";

/**
 * The roll-on bottle, drawn in CSS.
 *
 * These are the real products from the Naseem 24ml collection — no
 * photographs are stored in the project, so the illustration is tinted
 * per fragrance using each product's own `hue` rather than substituting
 * an unrelated placeholder bottle.
 */
export default function Bottle({
  hue,
  size = "md",
  label,
}: {
  hue: string;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
}) {
  const dims = {
    sm: { wrap: "h-20 w-8", cap: "h-3 w-4 top-0", collar: "h-1.5 w-5 top-3", body: "top-[1.4rem]", tag: "text-[6px] top-4" },
    md: { wrap: "h-32 w-12", cap: "h-5 w-6 top-0", collar: "h-2 w-7 top-5", body: "top-[1.75rem]", tag: "text-[7px] top-7" },
    lg: { wrap: "h-56 w-20", cap: "h-8 w-9 top-0", collar: "h-3 w-11 top-8", body: "top-[2.75rem]", tag: "text-[8px] top-11" },
    xl: { wrap: "h-80 w-28", cap: "h-11 w-12 top-0", collar: "h-4 w-15 top-11", body: "top-[3.75rem]", tag: "text-[9px] top-14" },
  }[size];

  return (
    <div
      className={`relative ${dims.wrap}`}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* cap */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 rounded-t-[3px] rounded-b-sm ${dims.cap}`}
        style={{ background: "linear-gradient(180deg,#4a423b,#2c2622)" }}
      />
      {/* collar */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 ${dims.collar}`}
        style={{ background: "linear-gradient(180deg,#cfd9cb,var(--color-sage-deep))" }}
      />
      {/* glass body */}
      <div
        className={`absolute inset-x-0 bottom-0 rounded-b-[6px] rounded-t-sm border ${dims.body}`}
        style={{
          background: `linear-gradient(172deg,
            color-mix(in oklab, ${hue} 62%, #fff),
            ${hue} 78%,
            color-mix(in oklab, ${hue} 72%, #4a4038))`,
          borderColor: "color-mix(in oklab, var(--color-espresso) 10%, transparent)",
          boxShadow:
            "inset 0.35rem 0 0.55rem rgba(255,255,255,.5), 0 10px 22px -10px rgb(48 40 36 / .35)",
        }}
      >
        {/* liquid */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: `color-mix(in oklab, ${hue} 70%, #000)`, opacity: 0.2 }}
        />
        {/* label */}
        <div
          className={`absolute inset-x-2 border-b border-espresso/10 text-center font-display leading-none text-espresso/75 ${dims.tag}`}
        >
          Aaya
        </div>
      </div>
    </div>
  );
}

/** Small square thumbnail used in the cart and order summary. */
export function ProductThumb({ product }: { product: Product }) {
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
