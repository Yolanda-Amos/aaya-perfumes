import Link from "next/link";

const SHOP = [
  { href: "/#fragrances", label: "Shop" },
  { href: "/#fragrances", label: "All fragrances" },
  { href: "/#mood", label: "Shop by mood" },
];

const HELP = [
  { href: "/#quiz", label: "Find Your Scent" },
  { href: "/#about", label: "About" },
  { href: "/account", label: "My Account" },
];

const CUSTOMER = [
  { href: "/account", label: "My Account" },
  { href: "/account", label: "Orders" },
  { href: "/#fragrances", label: "Cart" },
];

function Column({ title, links }: { title: string; links: typeof SHOP }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[0.9rem] text-taupe transition-colors hover:text-espresso"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SOCIAL = [
  {
    label: "Instagram",
    path: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zM17.4 6.8h.01",
  },
  {
    label: "TikTok",
    path: "M15 4v9.6a3 3 0 1 1-3-3M15 4c.6 2.3 2.2 3.6 4.5 3.8",
  },
  {
    label: "Facebook",
    path: "M14.5 8.5H17V6h-2.5A3.5 3.5 0 0 0 11 9.5V11H9v3h2v7h3v-7h2.5l.5-3H14V9.7c0-.7.2-1.2.5-1.2z",
  },
];

export default function SiteFooter() {
  return (
    <footer
      className="mt-28 border-t"
      style={{ borderColor: "var(--rule)", background: "var(--color-sage)" }}
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="wordmark text-2xl text-espresso">Aaya</p>
            <p className="mt-4 measure-tight font-display text-xl leading-snug text-espresso/85">
              Find a scent that feels like you.
            </p>

            <form
              action="#"
              method="post"
              className="mt-7 flex max-w-sm gap-2"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="field"
              />
              <button type="submit" className="btn btn-primary shrink-0">
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-[0.78rem] text-taupe">
              A little scent inspiration, straight to your inbox.
            </p>

            <ul className="mt-7 flex gap-2">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href="#"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream text-taupe transition-colors hover:border-sage-mid hover:text-espresso"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Column title="Shop" links={SHOP} />
          <Column title="About" links={HELP} />
          <Column title="Customer" links={CUSTOMER} />
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t pt-7 text-[0.8rem] text-taupe sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--rule)" }}>
          <p>© {new Date().getFullYear()} Aaya Perfume. All rights reserved.</p>
          <p>hello@aayaperfume.com · Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}