import type { Metadata } from "next";
import Link from "next/link";
import GoogleSignIn from "@/components/GoogleSignIn";
import SignOutButton from "@/components/SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { money, type Order } from "@/lib/orders";
import { Avatar } from "@/components/HeaderActions";
import ArchPhoto from "@/components/ArchPhoto";
import { CATALOGUE } from "@/lib/products";

export const metadata: Metadata = { title: "Your account — Aaya Perfume" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  let user: {
    id: string;
    email?: string;
    created_at?: string;
    last_sign_in_at?: string;
    user_metadata?: Record<string, unknown>;
  } | null = null;
  let orders: Order[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user) {
      const { data: rows } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      orders = (rows as Order[]) ?? [];
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-4xl">Accounts are not switched on yet</h1>
        <p className="mt-4 measure text-taupe">
          Add your Supabase project keys to <code>.env.local</code> and this page
          will hold your order history. The README walks through it step by step.
        </p>
        <Link href="/" className="btn btn-ghost mt-9">
          Back to the fragrances
        </Link>
      </div>
    );
  }

  if (!user) {
    const feature = CATALOGUE.find((p) => p.slug === "juliet") ?? CATALOGUE[0];
    return (
      <div className="mx-auto grid max-w-5xl items-center gap-14 px-5 py-16 sm:px-8 md:grid-cols-[1fr_0.8fr] md:py-24">
        <div>
          <h1 className="font-display text-[clamp(2.8rem,6vw,4.4rem)] leading-[0.98]">
            Welcome to Aaya
          </h1>
          <span className="mt-7 block h-px w-20 bg-brass" aria-hidden="true" />
          <p className="mt-7 measure text-[1.02rem] leading-relaxed text-taupe">
            Sign in to save your favourite scents and keep track of your orders.
            We use your Google account, so there&apos;s no password to remember.
          </p>
          <div className="mt-9 max-w-sm">
            <GoogleSignIn next="/account" />
          </div>
          <p className="mt-4 text-[0.8rem] text-taupe">
            New here? Signing in creates your account automatically.
          </p>
        </div>
        <div className="mx-auto hidden w-full max-w-xs md:block">
          <ArchPhoto product={feature} className="aspect-[3/4.6] w-full" outline sizes="320px" />
        </div>
      </div>
    );
  }

  const meta = user.user_metadata ?? {};
  const fullName =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    "";
  const first = fullName.trim().split(/\s+/)[0] || "there";
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "";
  const spent = orders.reduce((sum, o) => sum + (o.total_minor ?? 0), 0);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      {/* profile card */}
      <section
        className="relative overflow-hidden rounded-[1.75rem] bg-night px-6 py-9 text-ivory sm:px-10 sm:py-11"
        aria-labelledby="profile-heading"
      >
        <div className="flex flex-wrap items-center gap-5 sm:gap-7">
          <div className="rounded-full p-1 ring-1" style={{ ["--tw-ring-color" as string]: "var(--color-brass)" }}>
            <Avatar user={user} size={76} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 id="profile-heading" className="font-display text-[clamp(2.2rem,5vw,3.2rem)] leading-none">
              Hello, {first}
            </h1>
            {fullName && <p className="mt-2 text-[0.95rem] text-ivory/80">{fullName}</p>}
            <p className="mt-0.5 truncate text-[0.88rem] text-ivory/60">{user.email}</p>
          </div>
          <SignOutButton variant="dark" />
        </div>

        <dl className="mt-9 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-ivory/10 text-center">
          {[
            ["Orders", String(orders.length)],
            ["Total spent", money(spent)],
            ["Member since", memberSince || "Today"],
          ].map(([label, value]) => (
            <div key={label} className="bg-night px-3 py-5">
              <dt className="text-[0.75rem] text-ivory/60">{label}</dt>
              <dd className="mt-1 font-display text-xl text-brass-soft sm:text-2xl">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-[0.8rem] text-ivory/55">Signed in with Google</p>
      </section>

      <h2 className="mt-14 border-b pb-3 font-display text-3xl" style={{ borderColor: "var(--rule)" }}>
        Your orders
      </h2>

      {orders.length === 0 ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-[--radius-card] bg-sage p-6">
          <p className="measure text-cocoa">
            No orders yet. Your orders will appear here with their details once you check out.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/#quiz" className="btn btn-primary">Take the scent quiz</Link>
            <Link href="/#fragrances" className="btn btn-ghost bg-cream">Browse fragrances</Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y" style={{ borderColor: "var(--rule)" }}>
          {orders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-baseline justify-between gap-4 py-6">
              <div>
                <p className="font-display text-xl">{order.reference}</p>
                <p className="text-[0.85rem] text-taupe">
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="text-[0.9rem]">{money(order.total_minor)}</p>
              <Link
                href={`/orders/${order.reference}`}
                className="text-[0.9rem] text-sage-deep underline-offset-4 hover:underline"
              >
                View order
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
