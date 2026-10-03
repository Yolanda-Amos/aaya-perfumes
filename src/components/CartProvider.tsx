"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CATALOGUE, type Product } from "@/lib/products";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";

/**
 * The cart.
 *
 * Guests: held in localStorage, exactly as before.
 *
 * Signed-in customers: held in the Supabase `cart_items` table, so the
 * website and the mobile app share one bag. Changes are written straight
 * through (optimistically) and every change from any device arrives over
 * Supabase Realtime, so adding a bottle on the phone shows up here
 * instantly and vice versa. On sign-in the guest cart is merged in.
 *
 * The checkout flow is untouched — it still receives a "slug:qty,slug:qty"
 * string, which the server action parses and re-prices.
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
const MAX_QTY = 10;

type Row = { slug: string; qty: number };

function cleanRows(rows: Row[] | null): CartItem[] {
  return (rows ?? [])
    .filter((r) => CATALOGUE.some((p) => p.slug === r.slug))
    .map((r) => ({ slug: r.slug, qty: Math.min(MAX_QTY, Math.max(1, r.qty)) }));
}

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
  const [userId, setUserId] = useState<string | null>(null);

  // Latest values for callbacks that write to the database.
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const userRef = useRef(userId);
  userRef.current = userId;

  // Load the guest cart after mount so server HTML and first render agree.
  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  // Guests persist to localStorage; signed-in carts live in Supabase.
  useEffect(() => {
    if (!hydrated || userId) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated, userId]);

  // Follow the auth session.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Signed in: merge the guest cart, load the shared cart, go live.
  useEffect(() => {
    if (!hydrated || !userId || !isSupabaseConfigured) return;
    const supabase = createClient();
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function load() {
      const { data } = await supabase
        .from("cart_items")
        .select("slug, qty")
        .order("updated_at", { ascending: true });
      if (!cancelled) setItems(cleanRows(data as Row[] | null));
    }

    async function start() {
      const guest = readStorage();
      if (guest.length) {
        const { data: existing } = await supabase.from("cart_items").select("slug, qty");
        const merged = guest.map((g) => {
          const have = (existing as Row[] | null)?.find((e) => e.slug === g.slug);
          return {
            user_id: userId,
            slug: g.slug,
            qty: Math.min(MAX_QTY, Math.max(g.qty, have?.qty ?? 0)),
          };
        });
        const { error } = await supabase
          .from("cart_items")
          .upsert(merged, { onConflict: "user_id,slug" });
        if (!error) window.localStorage.removeItem(STORAGE_KEY);
      }
      await load();
    }

    start();

    const channel = supabase
      .channel(`cart:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cart_items", filter: `user_id=eq.${userId}` },
        () => {
          // Coalesce bursts (e.g. quick +/- taps) into one reload.
          clearTimeout(timer);
          timer = setTimeout(load, 120);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [hydrated, userId]);

  /** Write one line's new quantity (0 = remove) to the shared cart. */
  const persist = useCallback(async (slug: string, qty: number) => {
    const uid = userRef.current;
    if (!uid || !isSupabaseConfigured) return;
    const supabase = createClient();
    if (qty <= 0) {
      await supabase.from("cart_items").delete().eq("user_id", uid).eq("slug", slug);
    } else {
      await supabase
        .from("cart_items")
        .upsert({ user_id: uid, slug, qty }, { onConflict: "user_id,slug" });
    }
  }, []);

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

  const add = useCallback(
    (slug: string, qty = 1) => {
      const current = itemsRef.current.find((i) => i.slug === slug)?.qty ?? 0;
      const next = Math.min(MAX_QTY, Math.max(1, current + qty));
      setItems((prev) =>
        prev.some((i) => i.slug === slug)
          ? prev.map((i) => (i.slug === slug ? { ...i, qty: next } : i))
          : [...prev, { slug, qty: next }]
      );
      setLastAdded(slug);
      void persist(slug, next);
    },
    [persist]
  );

  const setQty = useCallback(
    (slug: string, qty: number) => {
      const next = Math.min(MAX_QTY, qty);
      setItems((prev) =>
        next <= 0
          ? prev.filter((i) => i.slug !== slug)
          : prev.map((i) => (i.slug === slug ? { ...i, qty: next } : i))
      );
      void persist(slug, next);
    },
    [persist]
  );

  const remove = useCallback(
    (slug: string) => {
      setItems((prev) => prev.filter((i) => i.slug !== slug));
      void persist(slug, 0);
    },
    [persist]
  );

  const clear = useCallback(() => {
    setItems([]);
    const uid = userRef.current;
    if (uid && isSupabaseConfigured) {
      void createClient().from("cart_items").delete().eq("user_id", uid);
    }
  }, []);

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