export type OrderItem = {
  product_id: string;
  name: string;
  slug: string;
  size_ml: number;
  /** Minor units: 1575 = Dhs 15.75 */
  unit_minor: number;
  qty: number;
};

export type Order = {
  id: string;
  reference: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  items: OrderItem[];
  subtotal_minor: number;
  shipping_minor: number;
  total_minor: number;
  status: "paid" | "processing" | "shipped";
  created_at: string;
};

/** Free delivery over ₦40,000; otherwise a flat ₦2,000. */
export const FREE_SHIPPING_THRESHOLD_MINOR = 4000000;
export const FLAT_SHIPPING_MINOR = 200000;

/** Human-friendly order reference, e.g. AAYA-7QK4M2 */
export function makeReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `AAYA-${out}`;
}

export function shippingFor(subtotalMinor: number) {
  return subtotalMinor >= FREE_SHIPPING_THRESHOLD_MINOR
    ? 0
    : FLAT_SHIPPING_MINOR;
}

/** Naira for display: ₦12,500 — never AED or USD on the storefront. */
export function money(minor: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(minor / 100)
    .replace("NGN", "₦");
}
