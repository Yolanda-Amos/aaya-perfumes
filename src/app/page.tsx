import Link from "next/link";
import Glyph from "@/components/Glyph";
import ShopGrid from "@/components/ShopGrid";
import ScentQuiz from "@/components/ScentQuiz";
import MoodSection from "@/components/MoodSection";
import ArchPhoto from "@/components/ArchPhoto";
import { CATALOGUE } from "@/lib/products";
import type { Product } from "@/lib/types";

function pick(slug: string): Product {
  return CATALOGUE.find((p) => p.slug === slug) ?? CATALOGUE[0];
}

/* The hero. A deep espresso frame, inset from the page edge, holding
   three real bottles in rising arches. The arches are the signature;
   everything else stays quiet. */
function Hero() {
  const trio = [pick("amani"), pick("juliet"), pick("niko")];

  return (
    <section className="px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[1.75rem] text-ivory"
        style={{
          background:
            "radial-gradient(120% 90% at 85% 10%, var(--color-night-soft) 0%, var(--color-night) 60%)",
        }}
      >
        <div className="grid items-center gap-12 px-6 pb-14 pt-14 sm:px-12 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:px-16 lg:pb-20 lg:pt-20">
          <div className="rise relative z-10">
            <h1 className="font-display text-[clamp(3.1rem,7.4vw,6.4rem)] leading-[0.95] tracking-[-0.02em]">
              A scent that
              <br />
              feels like you.
            </h1>
            <span className="mt-8 block h-px w-24 bg-brass" aria-hidden="true" />
            <p className="mt-8 max-w-[34ch] text-[1.05rem] leading-relaxed text-ivory/75">
              Discover fragrances made for every mood, moment, and version of you.
              Thirty-seven Arabic roll-ons, 24ml each.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="#fragrances" className="btn btn-brass">
                Shop fragrances
              </Link>
              <Link href="#quiz" className="btn btn-ivory-ghost">
                Find your scent
              </Link>
            </div>
          </div>

          {/* three rising arches */}
          <div className="relative mx-auto flex w-full max-w-xl items-end justify-center gap-3 sm:gap-5">
            <ArchPhoto
              product={trio[0]}
              className="arch-rise aspect-[3/5] w-[28%]"
              style={{ animationDelay: "250ms" }}
              sizes="(max-width: 1024px) 28vw, 160px"
              link
            />
            <ArchPhoto
              product={trio[1]}
              className="arch-rise aspect-[3/5] w-[38%] -translate-y-6"
              style={{ animationDelay: "80ms" }}
              outline
              priority
              sizes="(max-width: 1024px) 38vw, 220px"
              link
            />
            <ArchPhoto
              product={trio[2]}
              className="arch-rise aspect-[3/5] w-[28%]"
              style={{ animationDelay: "420ms" }}
              sizes="(max-width: 1024px) 28vw, 160px"
              link
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const PROMISES = [
  { glyph: "drop", title: "Oil-based, long lasting", detail: "A roll-on sits close to skin and wears for hours" },
  { glyph: "leaf", title: "Alcohol-free", detail: "Gentle enough for everyday wear" },
  { glyph: "sun", title: "Free delivery", detail: "On orders over ₦40,000" },
  { glyph: "bloom", title: "Two samples", detail: "Tucked into every order" },
];

function Promises() {
  return (
    <section className="mx-auto max-w-[88rem] px-3 sm:px-5">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-b-[1.75rem] border-x border-b bg-line lg:grid-cols-4" style={{ borderColor: "var(--rule)" }}>
        {PROMISES.map((item) => (
          <li key={item.title} className="flex items-start gap-3.5 bg-cream px-5 py-6 sm:px-7">
            <span className="mt-0.5 text-brass" aria-hidden="true">
              <Glyph name={item.glyph} className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[0.9rem] font-semibold">{item.title}</p>
              <p className="mt-0.5 text-[0.8rem] leading-relaxed text-taupe">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* The quiz gets its own dark band, high on the page, so nobody misses it.
   The question card itself stays light for easy reading. */
function QuizBand() {
  const side = [pick("lovely"), pick("jazi")];
  return (
    <section id="quiz" className="scroll-mt-20 px-3 py-16 sm:px-5 sm:py-20">
      <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[1.75rem] bg-night text-ivory">
        <div className="grid gap-12 px-5 py-14 sm:px-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-16 lg:py-20">
          <div className="flex flex-col">
            <h2 className="font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-[0.98]">
              Not sure where
              <br />
              to start?
            </h2>
            <p className="mt-6 max-w-[38ch] leading-relaxed text-ivory/75">
              Answer five quick questions about your mood and style. We&apos;ll match
              you to three bottles from the collection and tell you why each one fits.
            </p>
            <ul className="mt-8 space-y-3 text-[0.92rem] text-ivory/85">
              {["Takes under a minute", "No sign-up needed", "Matches from all 37 scents"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="h-px w-5 bg-brass" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto hidden items-end gap-4 pt-12 lg:flex" aria-hidden="true">
              <ArchPhoto product={side[0]} className="aspect-[3/5] w-28 opacity-90" sizes="112px" />
              <ArchPhoto product={side[1]} className="aspect-[3/5] w-20 opacity-70" sizes="80px" outline />
            </div>
          </div>

          <div className="rounded-[1.4rem] bg-ivory p-5 text-espresso shadow-[0_30px_60px_-30px_rgb(0_0_0/.5)] sm:p-9">
            <ScentQuiz />
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const feature = pick("daliya");
  return (
    <section id="about" className="scroll-mt-20 bg-sage">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
        <div className="mx-auto w-full max-w-sm">
          <ArchPhoto product={feature} className="aspect-[4/5] w-full" outline sizes="(max-width: 1024px) 80vw, 380px" link />
        </div>

        <div>
          <h2 className="font-display text-[clamp(2.4rem,4.6vw,3.8rem)] leading-[1.02]">
            Fragrance is more than a scent. It&apos;s a feeling.
          </h2>
          <p className="mt-7 measure text-[1.02rem] leading-relaxed text-cocoa">
            Aaya is a modern fragrance destination built around one idea: the right
            scent should match your personality, your mood and the moment you are in.
          </p>
          <p className="mt-4 measure text-[1.02rem] leading-relaxed text-cocoa">
            Every bottle is a 24ml roll-on you can carry, try and finish. We would
            rather you wore three and loved one than bought one and never opened it.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="#quiz" className="btn btn-primary">Take the scent quiz</Link>
            <Link href="#fragrances" className="btn btn-ghost bg-cream">Browse all 37</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Promises />

      <QuizBand />

      <section id="fragrances" className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,4.6vw,3.8rem)]">
              Find your signature scent.
            </h2>
            <p className="mt-3 measure text-taupe">
              Small bottles. Beautiful scents. Big personality.
            </p>
          </div>
          <p className="measure-tight text-[0.88rem] text-taupe">
            Every bottle is ₦12,500
          </p>
        </div>
        <div className="mt-12">
          <ShopGrid products={CATALOGUE} />
        </div>
      </section>

      <section id="mood" className="scroll-mt-20 border-t" style={{ borderColor: "var(--rule)" }}>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="font-display text-[clamp(2.4rem,4.6vw,3.8rem)]">
            What&apos;s your mood today?
          </h2>
          <div className="mt-10">
            <MoodSection products={CATALOGUE} />
          </div>
        </div>
      </section>

      <About />
    </>
  );
}
