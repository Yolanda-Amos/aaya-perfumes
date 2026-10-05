import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Product | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.family, p.blurb, p.notes.top, p.notes.heart, p.notes.base]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [products, query]);

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
      {/* header: wordmark, search, live status, profile */}
      <View style={s.header}>
        <Text style={s.wordmark}>AAYA</Text>
        <View style={s.headerRight}>
          <View style={[s.liveDot, { backgroundColor: cart.live ? color.sageMid : color.line }]} />
          <Text style={s.liveText}>{cart.live ? "Live" : "Connecting"}</Text>
          <Pressable
            onPress={() => {
              setSearchOpen((v) => !v);
              setTab("shop");
              if (searchOpen) setQuery("");
            }}
            style={s.iconBtn}
            accessibilityRole="button"
            accessibilityLabel={searchOpen ? "Close search" : "Search fragrances"}
          >
            {searchOpen ? <Text style={s.closeX}>×</Text> : <SearchIcon />}
          </Pressable>
          <Pressable onPress={() => setProfileOpen(true)} accessibilityRole="button" accessibilityLabel="Your profile">
            <Avatar uri={avatar} name={name} size={34} />
          </Pressable>
        </View>
      </View>

      {searchOpen && (
        <View style={s.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or note: rose, oud, musk"
            placeholderTextColor={color.taupe}
            autoFocus
            returnKeyType="search"
            style={s.searchInput}
          />
        </View>
      )}

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
          data={shown}
          keyExtractor={(p) => p.slug}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
          ListHeaderComponent={
            <View style={{ marginBottom: 6 }}>
              <Text style={[serif, s.h1]}>Hello, {name.split(" ")[0]}</Text>
              <Text style={s.muted}>
                {query.trim()
                  ? `${shown.length} match${shown.length === 1 ? "" : "es"} for "${query.trim()}"`
                  : "Find your signature scent. Tap a bottle for its notes."}
              </Text>
            </View>
          }
          ListEmptyComponent={
            loading ? null : (
              <Text style={[s.muted, { textAlign: "center", marginTop: 24 }]}>
                No fragrances match that. Try a note like rose, oud or vanilla.
              </Text>
            )
          }
          renderItem={({ item }) => {
            const inBag = cart.items.find((i) => i.slug === item.slug)?.qty ?? 0;
            return (
              <View style={s.card}>
                <Pressable
                  onPress={() => setDetail(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${item.name}`}
                >
                  <View style={[s.arch, { borderColor: tint(item.hue) }]}>
                    {item.image && <Image source={{ uri: item.image }} style={s.archImg} resizeMode="contain" />}
                  </View>
                  <Text style={[serif, s.cardName]}>{item.name}</Text>
                  <Text style={s.cardBlurb} numberOfLines={2}>{item.blurb}</Text>
                  <Text style={s.price}>{naira(item.price_minor)}</Text>
                </Pressable>
                <Pressable
                  disabled={item.stock === 0}
                  onPress={() => cart.add(item.slug)}
                  style={({ pressed }) => [s.addBtn, pressed && { opacity: 0.85 }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${item.name} to bag`}
                >
                  <Text style={s.addText}>
                    {item.stock === 0 ? "Sold out" : inBag ? `In bag · ${inBag}  +` : "Add to bag"}
                  </Text>
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
                <Text style={[serif, s.cardName]} onPress={() => setDetail(item.product)}>
                  {item.product.name}
                </Text>
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

      {detail && (
        <ProductSheet
          product={detail}
          inBag={cart.items.find((i) => i.slug === detail.slug)?.qty ?? 0}
          topInset={insets.top}
          bottomInset={insets.bottom}
          onClose={() => setDetail(null)}
          onAdd={(qty) => {
            const current = cart.items.find((i) => i.slug === detail.slug)?.qty ?? 0;
            cart.setQty(detail.slug, current + qty);
          }}
          onViewBag={() => {
            setDetail(null);
            setTab("bag");
          }}
        />
      )}

      <Modal
        visible={profileOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileOpen(false)}
      >
        <Pressable style={s.backdrop} onPress={() => setProfileOpen(false)}>
          <Pressable style={[s.profileSheet, { paddingBottom: 28 + insets.bottom }]} onPress={() => {}}>
            <Avatar uri={avatar} name={name} size={72} />
            <Text style={[serif, s.profileName]}>{name}</Text>
            <Text style={s.profileEmail}>{user.email}</Text>
            <Text style={s.profileNote}>Signed in with Google. Same account as the website.</Text>
            <View style={s.profileStats}>
              <Text style={s.profileStat}>{count} in bag</Text>
              <Text style={s.profileStat}>{naira(subtotal)}</Text>
            </View>
            <Pressable
              onPress={() => {
                setProfileOpen(false);
                auth.signOut();
              }}
              style={({ pressed }) => [s.signOutBtn, pressed && { opacity: 0.85 }]}
              accessibilityRole="button"
            >
              <Text style={s.signOutText}>Sign out</Text>
            </Pressable>
            <Pressable onPress={() => setProfileOpen(false)} style={{ marginTop: 14 }}>
              <Text style={s.remove}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------------- product detail ---------------- */

const FAMILY: Record<string, string> = {
  oud: "Oud",
  floral: "Floral",
  fresh: "Fresh",
  woody: "Woody",
  musk: "Musk",
  sweet: "Sweet",
  spicy: "Spicy",
  aquatic: "Aquatic",
};

function ProductSheet({
  product,
  inBag,
  topInset,
  bottomInset,
  onClose,
  onAdd,
  onViewBag,
}: {
  product: Product;
  inBag: number;
  topInset: number;
  bottomInset: number;
  onClose: () => void;
  onAdd: (qty: number) => void;
  onViewBag: () => void;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const out = product.stock === 0;
  const onSale = product.compare_minor > product.price_minor;
  const room = Math.max(0, 10 - inBag);

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={[s.fill, { paddingTop: topInset }]}>
        <View style={s.sheetBar}>
          <Pressable onPress={onClose} style={s.iconBtn} accessibilityRole="button" accessibilityLabel="Back to shop">
            <Text style={s.back}>‹</Text>
          </Pressable>
          <Text style={s.wordmark}>AAYA</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <View style={[s.detailArch, { borderColor: tint(product.hue) }]}>
            {product.image && (
              <Image source={{ uri: product.image }} style={s.detailImg} resizeMode="contain" />
            )}
          </View>

          <Text style={s.family}>{FAMILY[product.family] ?? product.family}</Text>
          <Text style={[serif, s.detailName]}>{product.name}</Text>
          <View style={s.priceRow}>
            {onSale && <Text style={s.compare}>{naira(product.compare_minor)}</Text>}
            <Text style={s.detailPrice}>{naira(product.price_minor)}</Text>
            <Text style={s.size}>{product.size_ml}ml roll-on</Text>
          </View>
          <Text style={s.detailBlurb}>{product.blurb}</Text>

          <View style={s.notes}>
            {([
              ["Top", product.notes.top],
              ["Heart", product.notes.heart],
              ["Base", product.notes.base],
            ] as const).map(([k, v]) => (
              <View key={k} style={s.noteRow}>
                <Text style={s.noteKey}>{k}</Text>
                <Text style={s.noteVal}>{v}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={[s.buyBar, { paddingBottom: 14 + bottomInset }]}>
          {out ? (
            <View style={[s.addBtn, { flex: 1, marginTop: 0, opacity: 0.5 }]}>
              <Text style={s.addText}>Sold out</Text>
            </View>
          ) : added ? (
            <>
              <Pressable onPress={onClose} style={[s.ghostBtn, { flex: 1 }]}>
                <Text style={s.ghostText}>Keep shopping</Text>
              </Pressable>
              <Pressable onPress={onViewBag} style={[s.addBtn, { flex: 1, marginTop: 0 }]}>
                <Text style={s.addText}>View bag ({inBag})</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={[s.stepper, { marginTop: 0 }]}>
                <Step label="−" onPress={() => setQty((q) => Math.max(1, q - 1))} />
                <Text style={s.qty}>{qty}</Text>
                <Step label="+" onPress={() => setQty((q) => Math.min(Math.max(1, room), q + 1))} />
              </View>
              <Pressable
                disabled={room === 0}
                onPress={() => {
                  onAdd(Math.min(qty, room));
                  setAdded(true);
                }}
                style={({ pressed }) => [s.addBtn, { flex: 1, marginTop: 0 }, (pressed || room === 0) && { opacity: 0.85 }]}
                accessibilityRole="button"
              >
                <Text style={s.addText}>
                  {room === 0 ? "Bag limit reached" : `Add to bag · ${naira(product.price_minor * qty)}`}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

function Avatar({ uri, name, size }: { uri?: string; name: string; size: number }) {
  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  return (
    <View style={[s.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[serif, { color: color.night, fontSize: size * 0.45 }]}>
        {(name || "A").charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

/** A small magnifying glass drawn with views, so no icon font is needed. */
function SearchIcon() {
  return (
    <View style={{ width: 18, height: 18 }}>
      <View style={{ width: 13, height: 13, borderRadius: 7, borderWidth: 1.8, borderColor: color.espresso }} />
      <View
        style={{
          position: "absolute",
          width: 7,
          height: 1.8,
          backgroundColor: color.espresso,
          right: -1,
          bottom: 2,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
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
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  closeX: { fontSize: 26, lineHeight: 28, color: color.espresso },
  searchRow: { paddingHorizontal: 16, paddingBottom: 10 },
  searchInput: {
    minHeight: 46,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.cream,
    paddingHorizontal: 18,
    fontSize: 15,
    color: color.espresso,
  },

  backdrop: { flex: 1, backgroundColor: "rgba(43,35,31,0.45)", justifyContent: "flex-end" },
  profileSheet: {
    backgroundColor: color.night,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    alignItems: "center",
  },
  profileName: { color: color.ivory, fontSize: 28, marginTop: 14 },
  profileEmail: { color: "rgba(250,247,242,0.7)", fontSize: 14, marginTop: 4 },
  profileNote: { color: "rgba(250,247,242,0.5)", fontSize: 12, marginTop: 10, textAlign: "center" },
  profileStats: { flexDirection: "row", gap: 24, marginTop: 18 },
  profileStat: { color: color.brassSoft, fontSize: 15 },
  signOutBtn: {
    marginTop: 22,
    minHeight: 48,
    alignSelf: "stretch",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(250,247,242,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: { color: color.ivory, fontSize: 15, fontWeight: "600" },

  sheetBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  back: { fontSize: 34, lineHeight: 36, color: color.espresso },
  detailArch: {
    alignSelf: "center",
    width: "78%",
    aspectRatio: 3 / 4,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 2,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  detailImg: { width: "100%", height: "86%" },
  family: { marginTop: 24, fontSize: 12, letterSpacing: 2, color: color.sageDeep, fontWeight: "600" },
  detailName: { fontSize: 38, color: color.espresso, marginTop: 4 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 10, marginTop: 8, flexWrap: "wrap" },
  compare: { fontSize: 14, color: color.taupe, textDecorationLine: "line-through" },
  detailPrice: { fontSize: 20, fontWeight: "600", color: color.espresso },
  size: { fontSize: 13, color: color.taupe },
  detailBlurb: { fontSize: 16, lineHeight: 25, color: "#4a423b", marginTop: 16 },
  notes: {
    marginTop: 22,
    borderRadius: 20,
    backgroundColor: color.sage,
    padding: 18,
    gap: 10,
  },
  noteRow: { flexDirection: "row", gap: 14 },
  noteKey: { width: 52, fontSize: 13, color: color.taupe },
  noteVal: { flex: 1, fontSize: 14, color: color.espresso },
  buyBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: color.line,
    backgroundColor: color.ivory,
  },
  ghostBtn: {
    minHeight: 46,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostText: { color: color.espresso, fontWeight: "600", fontSize: 14 },
});
