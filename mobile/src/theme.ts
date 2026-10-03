/** Aaya design tokens, matching the website (src/app/globals.css). */
export const color = {
  ivory: "#faf7f2",
  cream: "#fffefb",
  sage: "#eef3ed",
  sageMid: "#8fa58f",
  sageDeep: "#5f7362",
  rose: "#d9b8b0",
  peach: "#f3ddd0",
  espresso: "#302824",
  night: "#2b231f",
  brass: "#b89462",
  brassSoft: "#d8c19c",
  taupe: "#80756d",
  line: "#e8e1d8",
};

/** The website the app shares its API and accounts with. */
export const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL ?? "https://aaya-perfume.vercel.app";

/** Kobo → "₦12,500". */
export function naira(minor: number): string {
  return "₦" + Math.round(minor / 100).toLocaleString("en-NG");
}
