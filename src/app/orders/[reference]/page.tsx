import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { money, type Order } from "@/lib/orders";

export const metadata: Metadata = { title: "Your order — Aaya Perfume" };
export const dynamic = "force-dynamic";

/** The page the confirmation email links to. Guests can open it with
 *  just their reference; signed-in customers must own the order. */
export default async function OrderPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  if (!isSupabaseConfigured) notFound();

  /* The six-character reference (AAYA-XXXXXX) is the access credential.
     Signed-in customers are also checked against their user_id. Guests can
     only reach this page with the link from their confirmation email.

     This has to read with the service-role key: the anon key cannot see
     guest rows, because the row-level security policy compares
     auth.uid() to user_id, and a guest order has no user_id. */
  const admin = createAdminClient();
  const { data: row } = await admin
    .from("orders")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();

  if (!row) notFound();
  const order = row as Order;

  // A signed-in customer may only open their own order.
  if (order.user_id) {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (order.user_id !== userData.user?.id) notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="tag">Order</p>
      <h1 className="mt-1 font-display text-5xl">{order.reference}</h1>
      <p className="mt-3 measure text-taupe">
        Placed{" "}
        {new Date(order.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        {" · "}
        {order.status === "paid"
          ? "Being wrapped"
          : order.status === "processing"
            ? "On its way"
            : "Delivered"}
      </p>

      <ul className="mt-10 divide-y border-y" style={{ borderColor: "var(--rule)" }}>
        {order.items.map((item) => (
          <li key={item.slug} className="flex justify-between gap-4 py-5">
            <div>
              <p className="font-display text-xl">{item.name}</p>
              <p className="text-[0.8rem] text-taupe">
                {item.size_ml}ml · quantity {item.qty}
              </p>
            </div>
            <p className="text-[0.9rem]">{money(item.unit_minor * item.qty)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 text-[0.9rem]">
        <div className="flex justify-between">
          <dt className="text-taupe">Subtotal</dt>
          <dd>{money(order.subtotal_minor)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-taupe">Delivery</dt>
          <dd>{order.shipping_minor === 0 ? "Free" : money(order.shipping_minor)}</dd>
        </div>
        <div className="flex justify-between border-t pt-3 text-[1.05rem]" style={{ borderColor: "var(--rule)" }}>
          <dt>Total paid</dt>
          <dd>{money(order.total_minor)}</dd>
        </div>
      </dl>

      <p className="mt-10 measure text-[0.9rem] text-taupe">
        Delivering to {order.shipping_address}
      </p>

      <Link href="/" className="btn btn-ghost mt-10">
        Back to the fragrances
      </Link>
    </div>
  );
}
