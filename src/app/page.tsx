import Link from "next/link";
import Bottle from "@/components/Bottle";
import Icon from "@/components/Icon";
import ShopGrid from "@/components/ShopGrid";
import ScentQuiz from "@/components/ScentQuiz";
import { CATALOGUE } from "@/lib/products";

const PROMISES = [
  { icon: "truck", title: "Free shipping", detail: "On every order" },
  { icon: "vial", title: "Two samples", detail: "With every order" },
  { icon: "refresh", title: "Easy returns", detail: "30 days, unopened" },
  { icon: "lock", title: "Secure payment", detail: "Encrypted checkout" },
];

const SHORTCUTS = [
  "All roll-ons",
  "Oud & attars",
  "New this month",
  "Gift sets",
  "For her",
  "For him",
];

/* The hero. One large bottle on a warm dark field — the product *is* the
   image, and the wordmark sits behind it rather than shouting over it. */
function Hero() {
  const star = CATALOGUE.find((p) => p.slug === "oud-bushra")!;

  return (
    <section className="on-dark relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="rise" style={{ animationDelay: "60ms" }}>
          <p className="font-script text-2xl text-gold-soft">Aaya</p>
          <h1 className="mt-4 font-display text-[clamp(2.75rem,6vw,5rem)] leading-[1.05]">
            Scents that leave
            <br />
            a lasting
            <br />
            impression.
          </h1>
          <p className="mt-6 measure text-[1.05rem] text-ivory/70">
            Thirty-seven Arabic roll-ons, each 24ml and priced the same. Wear one
            for a week, not a moment — the small bottles are the honest ones.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="#fragrances" className="btn btn-primary">
              Explore the collection
            </Link>
            <Link href="#quiz" className="btn btn-ghost">
              Find your scent
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div
            className="swirl flex items-end justify-center gap-4"
            style={{ animationDelay: "240ms" }}
          >
            <div className="hidden opacity-40 sm:block" aria-hidden="true">
              <Bottle hue="#8c6a4e" size="md" />
            </div>
            <Bottle hue={star.hue} size="lg" label={`${star.name}, a 24ml roll-on`} />
            <div className="hidden opacity-60 sm:block" aria-hidden="true">
              <Bottle hue="#d8b26a" size="md" />
            </div>
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

      {/* ---- shortcut rail: structure, so the shelf is browsable ---- */}
      <nav
        aria-label="Shop by category"
        className="border-b bg-porcelain"
        style={{ borderColor: "var(--rule)" }}
      >
        <ul className="mx-auto grid max-w-7xl grid-cols-3 sm:grid-cols-6">
          {SHORTCUTS.map((label) => (
            <li
              key={label}
              className="flex flex-col items-center gap-2 border-r px-2 py-6 text-center last:border-r-0"
              style={{ borderColor: "var(--rule)" }}
            >
              <Icon name="bottle" className="h-5 w-5 text-gold-ink" />
              <span className="text-[0.78rem] leading-tight">{label}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* ---- the collection ---- */}
      <section id="fragrances" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-script text-xl text-gold-ink">The collection</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">
              Thirty-seven, all the same price
            </h2>
          </div>
          <p className="measure text-[0.9rem] text-taupe">
            Hover or focus a bottle to read its notes.
          </p>
        </div>

        <div className="mt-10">
          <ShopGrid products={CATALOGUE} />
        </div>
      </section>

      {/* ---- the quiz: the one interactive moment on the page ---- */}
      <section id="quiz" className="on-dark scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-script text-xl text-gold-soft">Find your signature</p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">
                Five questions. Three bottles.
              </h2>
            </div>
            <p className="measure text-[0.9rem] text-ivory/70">
              No sign-up, no email gate. We show you why each one matched.
            </p>
          </div>

          <div className="mt-12">
            <ScentQuiz />
          </div>
        </div>
      </section>

      {/* ---- discovery set + gifting ---- */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="on-dark flex flex-col justify-center p-10">
            <p className="font-script text-xl text-gold-soft">Discovery set</p>
            <h3 className="mt-2 font-display text-3xl">
              Ten 3ml vials, chosen for you
            </h3>
            <p className="mt-4 measure text-ivory/70">
              Take the quiz, get a set built from your answers. Ten samples in a
              lined case — enough to find the one, and cheaper than a single full
              bottle.
            </p>
            <Link href="#quiz" className="btn btn-primary mt-8 self-start">
              Build my set
            </Link>
          </div>

          <div
            className="flex flex-col justify-center border p-10"
            style={{ borderColor: "var(--rule)", background: "var(--color-sand)" }}
          >
            <p className="font-script text-xl text-gold-ink">Gifting</p>
            <h3 className="mt-2 font-display text-3xl">
              Wrapped, with a note in your words
            </h3>
            <p className="mt-4 measure text-cocoa">
              Recycled paper, a wax seal, and a handwritten card. Add your message
              at checkout and we write it out exactly as you typed it.
            </p>
            <Link href="#fragrances" className="btn btn-ghost mt-8 self-start">
              Browse to gift
            </Link>
          </div>
        </div>
      </section>

      {/* ---- promises ---- */}
      <section className="border-t" style={{ borderColor: "var(--rule)" }}>
        <dl className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((promise, i) => (
            <div
              key={promise.title}
              className={`flex items-center gap-4 px-6 py-8 ${
                i > 0 ? "border-t sm:border-t-0 sm:border-l" : ""
              }`}
              style={{ borderColor: "var(--rule)" }}
            >
              <Icon
                name={promise.icon}
                className="h-6 w-6 shrink-0 text-gold-ink"
              />
              <div>
                <dt className="text-[0.95rem] font-medium">{promise.title}</dt>
                <dd className="text-[0.85rem] text-taupe">{promise.detail}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
