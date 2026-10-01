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

/** Free delivery over Dhs 75; otherwise a flat Dhs 10. */
export const FREE_SHIPPING_THRESHOLD_MINOR = 7500;
export const FLAT_SHIPPING_MINOR = 1000;

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

export function money(minor: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
  }).format(minor / 100);
}
