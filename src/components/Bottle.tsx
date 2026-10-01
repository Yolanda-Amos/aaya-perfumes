/* A roll-on bottle drawn in CSS. The glass tints per fragrance so the
   grid reads as a shelf of different perfumes rather than one product
   repeated. Decorative only — every caller supplies a text label. */
export default function Bottle({
  hue,
  size = "md",
  label,
}: {
  hue: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const dims = {
    sm: { wrap: "h-28 w-11", cap: "h-4 w-5 top-0", collar: "h-2 w-6 top-4", body: "top-6", tag: "text-[7px] px-1 py-0.5 top-6" },
    md: { wrap: "h-44 w-16", cap: "h-6 w-7 top-0", collar: "h-2.5 w-9 top-6", body: "top-9", tag: "text-[8px] px-1.5 py-1 top-9" },
    lg: { wrap: "h-64 w-24", cap: "h-9 w-10 top-0", collar: "h-3.5 w-12 top-9", body: "top-[3.1rem]", tag: "text-[9px] px-2 py-1.5 top-12" },
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
        className={`absolute left-1/2 -translate-x-1/2 rounded-t-sm ${dims.cap}`}
        style={{ background: "linear-gradient(180deg,#4a3f36,#221d19)" }}
      />
      {/* gold collar */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 ${dims.collar}`}
        style={{ background: "linear-gradient(180deg,var(--color-gold-soft),var(--color-gold))" }}
      />
      {/* glass body */}
      <div
        className={`absolute inset-x-0 bottom-0 rounded-b-md rounded-t-sm border ${dims.body}`}
        style={{
          background: `linear-gradient(178deg,
            color-mix(in oklab, ${hue} 78%, #fff),
            ${hue} 55%,
            color-mix(in oklab, ${hue} 78%, #000))`,
          borderColor: "color-mix(in oklab, var(--color-espresso) 16%, transparent)",
          boxShadow:
            "inset 0.3rem 0 0.5rem rgba(255,255,255,.45), 0 0.75rem 1.5rem rgba(30,26,23,.14)",
        }}
      >
        {/* label */}
        <div
          className={`absolute inset-x-1.5 border border-[#b08d57]/50 text-center ${dims.tag}`}
        >
          <span className="font-script leading-none text-espresso">Aaya</span>
        </div>
        {/* liquid */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: `color-mix(in oklab, ${hue} 65%, #000)`, opacity: 0.22 }}
        />
      </div>
    </div>
  );
}
