import Link from "next/link";
import Bottle from "@/components/Bottle";
import Glyph from "@/components/Glyph";
import ShopGrid from "@/components/ShopGrid";
import ScentQuiz from "@/components/ScentQuiz";
import MoodSection from "@/components/MoodSection";
import { CATALOGUE } from "@/lib/products";
import ProductImage from "@/components/ProductImage";

const HERO_BOTTLES = ["#d9b8b0", "#8fa58f", "#e9d3cd"];

/* The hero bottle is a real product, so the first impression is the
   product rather than an illustration. Falls back to the CSS bottle if
   the photograph is not on disk yet. */
const HERO_SLUG = "niko";

/* The hero. The bottle sits deliberately off-centre with soft botanical
   marks around it — an editorial layout, not a centred shop banner. */
function Hero() {
  const heroProduct =
    CATALOGUE.find((p) => p.slug === HERO_SLUG) ?? CATALOGUE[0];

  return (
    <section className="relative overflow-hidden">
      {/* sage wash bleeding in from the right */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block"
        style={{
          background:
            "linear-gradient(200deg, var(--color-sage) 0%, transparent 72%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
        <div className="rise" style={{ animationDelay: "60ms" }}>
          <p className="eyebrow">Aaya Perfume</p>
          <h1 className="mt-5 font-display text-[clamp(2.9rem,7vw,5.4rem)] leading-[1.02]">
            A scent that
            <br />
            feels like you.
          </h1>
          <p className="mt-6 measure text-[1.05rem] leading-relaxed text-taupe">
            Discover fragrances made for every mood, moment, and version of you.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="#fragrances" className="btn btn-primary">
              Shop Fragrances
            </Link>
            <Link href="#quiz" className="btn btn-ghost">
              Find Your Scent
            </Link>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
            {[
              ["37", "roll-on scents"],
              ["24ml", "travel-friendly"],
              ["₦12,500", "every bottle"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl text-sage-deep">{value}</dt>
                <dd className="text-[0.8rem] text-taupe">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* bottle composition */}
        <div className="relative flex items-center justify-center">
          <div className="settle flex items-end justify-center gap-4 sm:gap-6">
            <span className="drift hidden sm:block" aria-hidden="true">
              <Bottle hue={HERO_BOTTLES[0]} size="md" />
            </span>
            <ProductImage product={heroProduct} size="lg" fit="contain" priority />
            <span className="drift hidden sm:block" style={{ animationDelay: "1.2s" }} aria-hidden="true">
              <Bottle hue={HERO_BOTTLES[2]} size="md" />
            </span>
          </div>

          {/* botanical marks */}
          <span
            className="absolute left-4 top-6 text-sage-mid sm:left-10 sm:top-10"
            aria-hidden="true"
          >
            <Glyph name="leaf" className="h-10 w-10" />
          </span>
          <span
            className="absolute bottom-8 right-4 text-rose sm:bottom-12 sm:right-8"
            aria-hidden="true"
          >
            <Glyph name="bloom" className="h-9 w-9" />
          </span>
          <span
            className="absolute right-14 top-16 hidden text-peach sm:block"
            aria-hidden="true"
          >
            <Glyph name="drop" className="h-7 w-7" />
          </span>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="fragrances" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The collection</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">
              Find your signature scent.
            </h2>
            <p className="mt-3 measure text-taupe">
              Small bottles. Beautiful scents. Big personality.
            </p>
          </div>
          <p className="measure-tight text-[0.88rem] text-taupe">
            Hover a bottle to read its notes.
          </p>
        </div>
        <div className="mt-12">
          <ShopGrid products={CATALOGUE} />
        </div>
      </section>

      <section id="quiz" className="scroll-mt-24 bg-sage">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Find Your Scent</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">
                Five questions. One bottle.
              </h2>
            </div>
            <p className="measure-tight text-[0.9rem] text-taupe">
              No sign-up, no email gate. We show you why each match fits.
            </p>
          </div>
          <div className="mt-12">
            <ScentQuiz />
          </div>
        </div>
      </section>

      <section id="mood" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
        <div>
          <p className="eyebrow">Browse by mood</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            What&apos;s your mood today?
          </h2>
        </div>
        <div className="mt-10">
          <MoodSection products={CATALOGUE} />
        </div>
      </section>
__TAIL2__
      <section id="about" className="scroll-mt-24 bg-sage">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
          <div
            className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[--radius-card]"
            style={{
              background:
                "linear-gradient(150deg, var(--color-peach), var(--color-rose-soft) 55%, var(--color-sage))",
            }}
          >
            <div className="flex items-end gap-5">
              <Bottle hue="#d9b8b0" size="md" />
              <Bottle hue="#8fa58f" size="lg" label="Two Aaya roll-ons side by side" />
              <Bottle hue="#e9d3cd" size="md" />
            </div>
            <span className="absolute right-8 top-8 text-espresso/25" aria-hidden="true">
              <Glyph name="bloom" className="h-14 w-14" />
            </span>
            <span className="absolute bottom-8 left-8 text-espresso/20" aria-hidden="true">
              <Glyph name="leaf" className="h-12 w-12" />
            </span>
          </div>

          <div>
            <p className="eyebrow">About Aaya</p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Fragrance is more than a scent. It&apos;s a feeling.
            </h2>
            <p className="mt-6 measure text-[1.02rem] leading-relaxed text-cocoa">
              Aaya is a modern fragrance destination built around one idea: the
              right scent should match your personality, your mood and the moment
              you are actually in.
            </p>
            <p className="mt-4 measure text-[1.02rem] leading-relaxed text-cocoa">
              Every bottle is a 24ml roll-on you can carry, try and finish. We
              would rather you wore three and loved one than bought one and never
              opened it.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#quiz" className="btn btn-primary">Find Your Scent</Link>
              <Link href="#fragrances" className="btn btn-ghost bg-cream">Browse all</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Free delivery", detail: "On orders over ₦40,000" },
            { title: "Two samples", detail: "With every order" },
            { title: "Easy returns", detail: "30 days, unopened" },
            { title: "Secure payment", detail: "Encrypted checkout" },
          ].map((item) => (
            <li key={item.title} className="rounded-[--radius-card] bg-sage p-6">
              <p className="font-display text-xl">{item.title}</p>
              <p className="mt-1 text-[0.85rem] text-taupe">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
