import type { Metadata } from "next";
import Link from "next/link";
import GoogleSignIn from "@/components/GoogleSignIn";
import SignOutButton from "@/components/SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { money, type Order } from "@/lib/orders";

export const metadata: Metadata = { title: "Your account — Aaya Perfume" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  let user: { id: string; email?: string } | null = null;
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
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
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
    return (
      <div className="mx-auto max-w-md px-6 py-24">
        <h1 className="font-display text-4xl">Sign in</h1>
        <p className="mt-4 measure text-taupe">
          Sign in to see your orders and check out faster. We only use your Google
          account — no password to remember.
        </p>
        <div className="mt-8">
          <GoogleSignIn next="/account" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tag">Signed in as</p>
          <h1 className="mt-1 font-display text-4xl">{user.email}</h1>
        </div>
        <SignOutButton />
      </div>

      <h2 className="mt-14 border-b pb-3 tag" style={{ borderColor: "var(--rule)" }}>
        Your orders
      </h2>

      {orders.length === 0 ? (
        <p className="mt-6 measure text-taupe">
          You have not ordered from us yet. When you do, your orders will appear
          here with their tracking details.
        </p>
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
                className="text-[0.9rem] text-gold-soft underline-offset-4 hover:underline"
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
