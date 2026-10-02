"use server";

import { revalidatePath } from "next/cache";
import { CATALOGUE, type Product } from "@/lib/products";
import {
  makeReference,
  shippingFor,
  type Order,
  type OrderItem,
} from "@/lib/orders";
import { sendOrderConfirmation } from "@/lib/mailgun";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, isMailgunConfigured } from "@/lib/env";

export type CheckoutState = {
  ok: boolean;
  reference?: string;
  error?: string;
  /** Per-field messages so the form can mark the right inputs. */
  fieldErrors?: Partial<Record<string, string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Record<string, string>) {
  const errors: NonNullable<CheckoutState["fieldErrors"]> = {};
  if (!v.name?.trim()) errors.name = "Tell us who the parcel is for.";
  if (!EMAIL_RE.test(v.email?.trim() ?? ""))
    errors.email = "Enter an email we can send the receipt to.";
  if (!v.address?.trim() || v.address.trim().length < 10)
    errors.address = "Add a full address, including city and postcode.";
  if (!v.card?.replace(/\s/g, "").match(/^\d{15,16}$/))
    errors.card = "Card numbers are 15 or 16 digits.";
  if (!/^\d{2}\s*\/\s*\d{2,4}$/.test(v.expiry?.trim() ?? ""))
    errors.expiry = "Use MM/YY.";
  if (!/^\d{3,4}$/.test(v.cvc?.trim() ?? ""))
    errors.cvc = "The code is 3 or 4 digits.";
  return errors;
}

/** Parses "slug:qty,slug:qty" from the hidden form field. */
function parseCart(raw: string) {
  const bySlug = new Map(CATALOGUE.map((p: Product) => [p.slug, p]));
  const items: OrderItem[] = [];
  for (const pair of (raw ?? "").split(",")) {
    const [slug, qtyRaw] = pair.split(":");
    const product = bySlug.get(slug?.trim());
    const qty = Math.max(0, Math.min(10, Number(qtyRaw) || 0));
    if (product && qty > 0) {
      items.push({
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        size_ml: product.size_ml,
        unit_minor: product.price_minor,
        qty,
      });
    }
  }
  return items;
}

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const values = Object.fromEntries(
    Object.keys(formData)
      .filter((k) => !k.startsWith("$"))
      .map((k) => [k, String(formData.get(k) ?? "")])
  ) as Record<string, string>;

  const fieldErrors = validate(values);
  if (Object.keys(fieldErrors).length) {
    return {
      ok: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const items = parseCart(values.cart ?? "");
  if (items.length === 0) {
    return { ok: false, error: "Your bag is empty. Add a fragrance first." };
  }

  // Prices are recomputed server-side from the catalogue, never trusted
  // from the browser.
  const subtotal = items.reduce((sum, i) => sum + i.unit_minor * i.qty, 0);
  const shipping = shippingFor(subtotal);
  const reference = makeReference();

  const order: Order = {
    id: reference,
    reference,
    user_id: null,
    customer_name: values.name.trim(),
    customer_email: values.email.trim().toLowerCase(),
    shipping_address: values.address.trim(),
    items,
    subtotal_minor: subtotal,
    shipping_minor: shipping,
    total_minor: subtotal + shipping,
    status: "paid",
    created_at: new Date().toISOString(),
  };

  // Attach the signed-in user, if any. Google sign-in is optional —
  // guest checkout still works.
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      order.user_id = data.user?.id ?? null;
    } catch {
      /* stay a guest order */
    }
  }

  if (isSupabaseConfigured) {
    // The anon key cannot INSERT — the orders table has RLS on with no
    // insert policy. Writes go through the service-role key, which is
    // only ever reachable from this server action.
    const admin = createAdminClient();
    const { error } = await admin.from("orders").insert({
      id: order.id,
      reference: order.reference,
      user_id: order.user_id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      shipping_address: order.shipping_address,
      items: order.items,
      subtotal_minor: order.subtotal_minor,
      shipping_minor: order.shipping_minor,
      total_minor: order.total_minor,
      status: order.status,
    });
    if (error) {
      console.error("[checkout] insert failed:", error.message);
      return {
        ok: false,
        error:
          "We could not save your order just now. Your card was not charged — please try again.",
      };
    }
  } else {
    console.info("[checkout] Supabase not configured — order not persisted:", reference);
  }

  await sendOrderConfirmation(order);
  revalidatePath("/account");
  return { ok: true, reference: order.reference };
}

export type TestEmailState = {
  ok: boolean;
  message: string;
};

/**
 * Sends a sample confirmation to an address without saving an order.
 *
 * Useful for checking the email design and confirming the Mailgun keys
 * work before anyone has to complete checkout. Builds an order object in
 * memory only — nothing is written to the database.
 */
export async function sendTestEmail(
  _prev: TestEmailState,
  formData: FormData
): Promise<TestEmailState> {
  if (!isMailgunConfigured) {
    return {
      ok: false,
      message:
        "Mailgun is not set up yet. Add MAILGUN_DOMAIN and MAILGUN_API_KEY to .env.local, then restart the server.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, message: "Enter an email address we can send to." };
  }

  const first = CATALOGUE[0];
  const second = CATALOGUE[1];
  const items: OrderItem[] = [
    {
      product_id: first.id,
      name: first.name,
      slug: first.slug,
      size_ml: first.size_ml,
      unit_minor: first.price_minor,
      qty: 2,
    },
    {
      product_id: second.id,
      name: second.name,
      slug: second.slug,
      size_ml: second.size_ml,
      unit_minor: second.price_minor,
      qty: 1,
    },
  ];
  const subtotal = items.reduce((s, i) => s + i.unit_minor * i.qty, 0);

  const result = await sendOrderConfirmation({
    id: "TEST",
    reference: makeReference(),
    user_id: null,
    customer_name: "Test Customer",
    customer_email: email,
    shipping_address: "12 Al Wasl Road, Dubai",
    items,
    subtotal_minor: subtotal,
    shipping_minor: shippingFor(subtotal),
    total_minor: subtotal + shippingFor(subtotal),
    status: "paid",
    created_at: new Date().toISOString(),
  });

  if (!result.sent) {
    return {
      ok: false,
      message:
        result.reason === "provider"
          ? "Mailgun rejected the message. Check that MAILGUN_DOMAIN and MAILGUN_FROM are on the same domain, and that the API key is active."
          : "Mailgun is not configured yet.",
    };
  }

  return {
    ok: true,
    message: `Sent to ${email}. This is a sample — no order was saved.`,
  };
}
