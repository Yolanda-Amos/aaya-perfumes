import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useCart, useProducts } from "./src/hooks";
import { color, naira, SITE_URL } from "./src/theme";
import type { Product } from "./src/types";

const serif = { fontFamily: "serif" } as const;

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Root />
    </SafeAreaProvider>
  );
}

function Root() {
  const auth = useAuth();

  if (!auth.ready) {
    return (
      <View style={[s.fill, s.center]}>
        <ActivityIndicator color={color.brass} />
      </View>
    );
  }
  if (!auth.session) return <SignIn onGoogle={auth.signInWithGoogle} error={auth.error} />;
  return <Shop auth={auth} />;
}

/* ---------------- sign in ---------------- */

function SignIn({ onGoogle, error }: { onGoogle: () => void; error: string | null }) {
  const [busy, setBusy] = useState(false);
  return (
    <SafeAreaView style={[s.fill, { backgroundColor: color.night }]}>
      <View style={s.signIn}>
        <Text style={s.wordmarkLight}>AAYA</Text>
        <View>
          <Text style={[serif, s.signInTitle]}>A scent that{"\n"}feels like you.</Text>
          <View style={s.brassRule} />
          <Text style={s.signInBody}>
            Sign in with the same Google account you use on the Aaya website. Your bag follows you
            between your phone and the web.
          </Text>
        </View>
        <View>
          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={async () => {
              setBusy(true);
              try {
                await onGoogle();
              } finally {
                setBusy(false);
              }
            }}
            style={({ pressed }) => [s.googleBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={s.googleG}>G</Text>
            <Text style={s.googleText}>{busy ? "Opening Google…" : "Continue with Google"}</Text>
          </Pressable>
          {error && <Text style={s.error}>{error}</Text>}
          <Text style={s.signInFoot}>New here? Signing in creates your account.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- shop + bag ---------------- */

type Auth = ReturnType<typeof useAuth>;

function Shop({ auth }: { auth: Auth }) {
  const user = auth.session!.user;
  const { products, loading, reload } = useProducts();
  const cart = useCart(auth.supabase, user.id);
  const [tab, setTab] = useState<"shop" | "bag">("shop");

  const bySlug = useMemo(() => new Map(products.map((p) => [p.slug, p])), [products]);
  const count = cart.items.reduce((n, i) => n + i.qty, 0);
  const lines = cart.items
    .map((i) => ({ product: bySlug.get(i.slug), qty: i.qty }))
    .filter((l): l is { product: Product; qty: number } => Boolean(l.product));
  const subtotal = lines.reduce((n, l) => n + l.product.price_minor * l.qty, 0);

  const meta = user.user_metadata ?? {};
  const name: string = meta.full_name ?? meta.name ?? user.email ?? "";
  const avatar: string | undefined = meta.avatar_url ?? meta.picture;

  return (
    <SafeAreaView style={s.fill} edges={["top"]}>
      {/* header */}
      <View style={s.header}>
        <Text style={s.wordmark}>AAYA</Text>
        <View style={s.headerRight}>
          <View style={[s.liveDot, { backgroundColor: cart.live ? color.sageMid : color.line }]} />
          <Text style={s.liveText}>{cart.live ? "Live" : "Connecting"}</Text>
          {avatar ? (
            <Image source={{ uri: avatar }} style={s.avatar} />
          ) : (
            <View style={[s.avatar, s.avatarFallback]}>
              <Text style={[serif, { color: color.night }]}>{name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </View>
      </View>

      {/* tabs */}
      <View style={s.tabs}>
        {(["shop", "bag"] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t }}
            style={[s.tab, tab === t && s.tabActive]}
          >
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>
              {t === "shop" ? "Shop" : `Bag${count ? ` (${count})` : ""}`}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "shop" ? (
        <FlatList
          key="shop-grid"
          data={products}
          keyExtractor={(p) => p.slug}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
          ListHeaderComponent={
            <View style={{ marginBottom: 6 }}>
              <Text style={[serif, s.h1]}>Hello, {name.split(" ")[0]}</Text>
              <Text style={s.muted}>Find your signature scent. Every bottle {naira(1250000)}.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const inBag = cart.items.find((i) => i.slug === item.slug)?.qty ?? 0;
            return (
              <View style={s.card}>
                <View style={[s.arch, { borderColor: tint(item.hue) }]}>
                  {item.image && <Image source={{ uri: item.image }} style={s.archImg} resizeMode="contain" />}
                </View>
                <Text style={[serif, s.cardName]}>{item.name}</Text>
                <Text style={s.cardBlurb} numberOfLines={2}>{item.blurb}</Text>
                <Text style={s.price}>{naira(item.price_minor)}</Text>
                <Pressable
                  onPress={() => cart.add(item.slug)}
                  style={({ pressed }) => [s.addBtn, pressed && { opacity: 0.85 }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${item.name} to bag`}
                >
                  <Text style={s.addText}>{inBag ? `In bag · ${inBag}  +` : "Add to bag"}</Text>
                </Pressable>
              </View>
            );
          }}
        />
      ) : (
        <FlatList
          key="bag-list"
          data={lines}
          keyExtractor={(l) => l.product.slug}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40, flexGrow: 1 }}
          ListEmptyComponent={
            <View style={[s.center, { flex: 1, padding: 24 }]}>
              <Text style={[serif, s.h1, { textAlign: "center" }]}>Your bag is empty</Text>
              <Text style={[s.muted, { textAlign: "center", marginTop: 8 }]}>
                Add a bottle here or on the website. It appears on both straight away.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={s.line}>
              <View style={[s.thumb, { borderColor: tint(item.product.hue) }]}>
                {item.product.image && (
                  <Image source={{ uri: item.product.image }} style={s.thumbImg} resizeMode="contain" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[serif, s.cardName]}>{item.product.name}</Text>
                <Text style={s.muted}>{naira(item.product.price_minor)}</Text>
                <View style={s.stepper}>
                  <Step label="−" onPress={() => cart.setQty(item.product.slug, item.qty - 1)} />
                  <Text style={s.qty}>{item.qty}</Text>
                  <Step label="+" onPress={() => cart.setQty(item.product.slug, item.qty + 1)} />
                  <Pressable onPress={() => cart.setQty(item.product.slug, 0)} style={{ marginLeft: "auto" }}>
                    <Text style={s.remove}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
            lines.length ? (
              <View style={s.totalBox}>
                <View style={s.totalRow}>
                  <Text style={s.muted}>Subtotal</Text>
                  <Text style={[serif, { fontSize: 24, color: color.espresso }]}>{naira(subtotal)}</Text>
                </View>
                <Text style={[s.muted, { marginTop: 6 }]}>
                  Check out on {SITE_URL.replace("https://", "")}. Your bag is already there.
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <Pressable onPress={auth.signOut} style={s.signOut}>
        <Text style={s.remove}>Sign out of {user.email}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function Step({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={s.stepBtn} accessibilityRole="button" accessibilityLabel={label === "+" ? "Increase" : "Decrease"}>
      <Text style={{ fontSize: 18, color: color.espresso }}>{label}</Text>
    </Pressable>
  );
}

/** The product's tint, softened, for the frame outline. */
function tint(hex: string): string {
  return hex + "66";
}

const s = StyleSheet.create({
  fill: { flex: 1, backgroundColor: color.ivory },
  center: { alignItems: "center", justifyContent: "center" },

  signIn: { flex: 1, padding: 28, justifyContent: "space-between" },
  wordmarkLight: { color: color.ivory, letterSpacing: 6, fontSize: 16, fontWeight: "500" },
  signInTitle: { color: color.ivory, fontSize: 46, lineHeight: 50 },
  brassRule: { height: 1, width: 80, backgroundColor: color.brass, marginVertical: 24 },
  signInBody: { color: "rgba(250,247,242,0.75)", fontSize: 16, lineHeight: 24 },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: color.ivory,
    borderRadius: 999,
    minHeight: 54,
  },
  googleG: { fontWeight: "700", fontSize: 18, color: "#4285F4" },
  googleText: { fontSize: 16, fontWeight: "600", color: color.espresso },
  error: { color: color.rose, marginTop: 12, textAlign: "center" },
  signInFoot: { color: "rgba(250,247,242,0.55)", textAlign: "center", marginTop: 14, fontSize: 13 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  wordmark: { letterSpacing: 6, fontSize: 16, fontWeight: "500", color: color.espresso },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveText: { fontSize: 12, color: color.taupe, marginRight: 8 },
  avatar: { width: 34, height: 34, borderRadius: 17 },
  avatarFallback: { backgroundColor: color.brass, alignItems: "center", justifyContent: "center" },

  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: color.sage,
    borderRadius: 999,
    padding: 4,
  },
  tab: { flex: 1, minHeight: 42, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  tabActive: { backgroundColor: color.night },
  tabText: { fontSize: 15, color: color.espresso, fontWeight: "500" },
  tabTextActive: { color: color.ivory },

  h1: { fontSize: 30, color: color.espresso },
  muted: { color: color.taupe, fontSize: 14, lineHeight: 20 },

  card: {
    flex: 1,
    backgroundColor: color.cream,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.line,
    padding: 10,
  },
  arch: {
    aspectRatio: 3 / 4,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#ffffff",
    borderWidth: 2,
  },
  archImg: { width: "100%", height: "86%" },
  cardName: { fontSize: 20, color: color.espresso, marginTop: 10 },
  cardBlurb: { fontSize: 12, color: color.taupe, marginTop: 2, minHeight: 32 },
  price: { fontSize: 14, color: color.espresso, fontWeight: "600", marginTop: 6 },
  addBtn: {
    marginTop: 10,
    minHeight: 44,
    borderRadius: 999,
    backgroundColor: color.night,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { color: color.ivory, fontWeight: "600", fontSize: 13 },

  line: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: color.cream,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.line,
    padding: 12,
  },
  thumb: {
    width: 72,
    height: 92,
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 2,
  },
  thumbImg: { width: "92%", height: "92%" },
  stepper: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: "center",
    justifyContent: "center",
  },
  qty: { minWidth: 20, textAlign: "center", fontSize: 16, color: color.espresso },
  remove: { color: color.taupe, fontSize: 13, textDecorationLine: "underline" },

  totalBox: { marginTop: 8, padding: 18, borderRadius: 20, backgroundColor: color.sage },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  signOut: { alignItems: "center", paddingVertical: 12 },
});
