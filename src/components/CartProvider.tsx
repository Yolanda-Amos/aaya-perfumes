"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CATALOGUE, type Product } from "@/lib/products";

/**
 * Client-side cart.
 *
 * The existing checkout flow is untouched — it still receives a
 * "slug:qty,slug:qty" string in the `cart` form field, which the server
 * action parses and re-prices. This store simply holds the same data in
 * localStorage so the drawer, quantity controls and badge can read it.
 *
 * Nothing here talks to the database; orders are created only by the
 * server action.
 */

export type CartItem = { slug: string; qty: number };

export type CartLine = { product: Product; qty: number };

type CartContextValue = {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  lastAdded: string | null;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "aaya-cart-v1";

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (i): i is CartItem =>
          Boolean(i) &&
          typeof (i as CartItem).slug === "string" &&
          Number.isFinite((i as CartItem).qty)
      )
      .map((i) => ({
        slug: i.slug,
        qty: Math.min(10, Math.max(1, Math.floor(i.qty))),
      }))
      .filter((i) => CATALOGUE.some((p) => p.slug === i.slug));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load after mount so the server-rendered HTML and the first client
  // render agree, avoiding a hydration mismatch.
  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const lines = useMemo(
    () =>
      items
        .map((i) => {
          const product = CATALOGUE.find((p) => p.slug === i.slug);
          return product ? { product, qty: i.qty } : null;
        })
        .filter((l): l is CartLine => l !== null),
    [items]
  );

  const add = useCallback((slug: string, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.slug === slug);
      if (found) {
        return prev.map((i) =>
          i.slug === slug ? { ...i, qty: Math.min(10, i.qty + qty) } : i
        );
      }
      return [...prev, { slug, qty: Math.min(10, Math.max(1, qty)) }];
    });
    setLastAdded(slug);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, qty: Math.min(10, qty) } : i))
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      lines,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.product.price_minor * l.qty, 0),
      lastAdded,
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }),
    [items, lines, lastAdded, open, add, setQty, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/** Serialises to the format the existing server action already parses. */
export function toCartValue(lines: CartLine[]) {
  return lines.map((l) => `${l.product.slug}:${l.qty}`).join(",");
}