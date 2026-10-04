import { useCallback, useEffect, useRef, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";
import { SITE_URL } from "./theme";
import type { CartItem, Product } from "./types";

WebBrowser.maybeCompleteAuthSession();

const MAX_QTY = 10;

/** Supabase client + the signed-in session, shared with the website. */
export function useAuth() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    getSupabase()
      .then(async (sb) => {
        setSupabase(sb);
        const { data } = await sb.auth.getSession();
        setSession(data.session);
        const { data: sub } = sb.auth.onAuthStateChange((event, s) => {
          setSession(s);
          // Welcome email for accounts created on the phone (sent once, ever).
          if (event === "SIGNED_IN" && s?.access_token) {
            fetch(`${SITE_URL}/api/account/welcome`, {
              method: "POST",
              headers: { Authorization: `Bearer ${s.access_token}` },
            }).catch(() => {});
          }
        });
        unsub = () => sub.subscription.unsubscribe();
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setReady(true));
    return () => unsub?.();
  }, []);

  /**
   * Google sign-in through Supabase, the same account as the website.
   * Opens the Google screen in an in-app browser, then exchanges the code
   * returned to our deep link for a session.
   */
  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    setError(null);
    const redirectTo = Linking.createURL("auth-callback");
    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (oauthError || !data?.url) {
      setError(oauthError?.message ?? "Could not start Google sign-in.");
      return;
    }
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== "success") return; // closed or cancelled

    const { queryParams } = Linking.parse(result.url);
    const code = typeof queryParams?.code === "string" ? queryParams.code : null;
    const desc = typeof queryParams?.error_description === "string" ? queryParams.error_description : null;
    if (!code) {
      setError(desc ?? "Sign-in did not complete. Please try again.");
      return;
    }
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) setError(exchangeError.message);
  }, [supabase]);

  const signOut = useCallback(async () => {
    // "local" signs out this phone only; the website stays signed in.
    // Clear the session ourselves too, so the screen switches immediately
    // even if the auth event is slow to arrive.
    setSession(null);
    try {
      await supabase?.auth.signOut({ scope: "local" });
    } catch {
      // Already signed out locally; nothing else to do.
    }
  }, [supabase]);

  return { supabase, session, ready, error, signInWithGoogle, signOut };
}

/** The catalogue, from the website's GET /api/products. */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SITE_URL}/api/products`);
      const json = (await res.json()) as { products: Product[] };
      setProducts(json.products ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { products, loading, reload: load };
}

/**
 * The shared cart in Supabase `cart_items`. Writes are optimistic; a
 * Realtime subscription reloads the cart whenever any device (the website
 * included) changes it, so it updates instantly.
 */
export function useCart(supabase: SupabaseClient | null, userId: string | null) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [live, setLive] = useState(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    if (!supabase || !userId) {
      setItems([]);
      setLive(false);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const load = async () => {
      const { data } = await supabase
        .from("cart_items")
        .select("slug, qty")
        .order("updated_at", { ascending: true });
      if (!cancelled) setItems((data as CartItem[] | null) ?? []);
    };
    load();

    const channel = supabase
      .channel(`cart:${userId}:mobile`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cart_items", filter: `user_id=eq.${userId}` },
        () => {
          clearTimeout(timer);
          timer = setTimeout(load, 120);
        }
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    return () => {
      cancelled = true;
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const setQty = useCallback(
    async (slug: string, qty: number) => {
      if (!supabase || !userId) return;
      const next = Math.min(MAX_QTY, qty);
      setItems((prev) =>
        next <= 0
          ? prev.filter((i) => i.slug !== slug)
          : prev.some((i) => i.slug === slug)
            ? prev.map((i) => (i.slug === slug ? { ...i, qty: next } : i))
            : [...prev, { slug, qty: next }]
      );
      if (next <= 0) {
        await supabase.from("cart_items").delete().eq("user_id", userId).eq("slug", slug);
      } else {
        await supabase
          .from("cart_items")
          .upsert({ user_id: userId, slug, qty: next }, { onConflict: "user_id,slug" });
      }
    },
    [supabase, userId]
  );

  const add = useCallback(
    (slug: string) => {
      const current = itemsRef.current.find((i) => i.slug === slug)?.qty ?? 0;
      return setQty(slug, current + 1);
    },
    [setQty]
  );

  return { items, live, add, setQty };
}
