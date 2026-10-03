import "react-native-url-polyfill/auto";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SITE_URL } from "./theme";

let client: SupabaseClient | null = null;

/**
 * The same Supabase project as the website. The public URL and anon key are
 * fetched from the website's /api/config, so the app needs no keys of its own.
 * Sessions persist in AsyncStorage.
 */
export async function getSupabase(): Promise<SupabaseClient> {
  if (client) return client;
  const res = await fetch(`${SITE_URL}/api/config`);
  const { supabaseUrl, supabaseAnonKey } = (await res.json()) as {
    supabaseUrl: string;
    supabaseAnonKey: string;
  };
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("The website has no Supabase settings yet.");
  }
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: "pkce",
    },
  });

  // Refresh tokens only while the app is in the foreground.
  AppState.addEventListener("change", (state) => {
    if (!client) return;
    if (state === "active") client.auth.startAutoRefresh();
    else client.auth.stopAutoRefresh();
  });
  client.auth.startAutoRefresh();
  return client;
}
