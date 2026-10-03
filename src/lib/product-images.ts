/**
 * Product photography.
 *
 * The official Naseem 24ml roll-on photographs, served from Naseem's own
 * Shopify CDN (https://www.naseemperfume.com/collections/roll-on-24ml), so the
 * shop shows the bottle the customer actually receives.
 *
 * The host is allowed in `next.config.ts` (images.remotePatterns). Any product
 * without an entry, or whose image fails to load, renders the tinted CSS
 * bottle instead, so the shop never shows a broken image.
 */
const CDN = "https://cdn.shopify.com/s/files/1/0644/1422/0345/files/";

export const PRODUCT_IMAGES: Record<string, string> = {
  "afzal": `${CDN}AFZAL.jpg?v=1727353614`,
  "al-aqmar": `${CDN}ALAQMAR.jpg?v=1727353617`,
  "amani": `${CDN}AMANI_d6b0149c-3a12-44c5-b870-454470d70842.jpg?v=1727353540`,
  "azhar": `${CDN}AZHAR.jpg?v=1727353619`,
  "be-sugar": `${CDN}Be-Sugar.jpg?v=1752304222`,
  "black-oud": `${CDN}BLACKOUD.jpg?v=1727353537`,
  "bukhoor": `${CDN}bukhoor24MLRO-Recovered-Recovered.jpg?v=1727353599`,
  "burhan": `${CDN}BURHAN-withoutbg.jpg?v=1727353611`,
  "bushra": `${CDN}BUSHRA_d2112fea-26de-4e0a-bd77-37f61a8dc4a9.jpg?v=1727353543`,
  "candy": `${CDN}CANDY24MLRO-Recovered-Recovered.jpg?v=1727353596`,
  "daliya": `${CDN}DALIYA_fda3d2fd-9fd3-44c2-bf4c-787dabac3a79.jpg?v=1727353534`,
  "dani": `${CDN}DANI.jpg?v=1727353546`,
  "jameelah-green": `${CDN}JAMELLAH.jpg?v=1727353549`,
  "jameelah-red": `${CDN}JAMELLAH-RED.jpg?v=1727353552`,
  "jazi": `${CDN}JAZI_c3cc7084-ea8a-4f38-986f-8ec2b8a0c81e.jpg?v=1727353555`,
  "joey": `${CDN}24MLRO-Recovered-Recovered.jpg?v=1727353588`,
  "juliet": `${CDN}JULIET.jpg?v=1727353525`,
  "laeqa": `${CDN}LAEQA_1ec59db1-9c45-401c-9b86-90fd3ac24400.jpg?v=1727353558`,
  "lamsa": `${CDN}LAMSA_89bccd6d-c20c-4e98-b5d8-e8913bd2954e.jpg?v=1727353561`,
  "lovely": `${CDN}LOVELY.jpg?v=1727353564`,
  "mufaddal-oud": `${CDN}MUFADDAL-NEW.jpg?v=1727353528`,
  "mufaddal": `${CDN}MUFADDAL_86a93f8b-b503-4044-8bcd-c9c6faafdeb8.jpg?v=1727353585`,
  "mukhallat": `${CDN}MUKHALLAT.jpg?v=1727353622`,
  "musk-bushra": `${CDN}MUSKBUSHRA_2de3a4d9-b026-4523-a9d9-92ccd4e606ad.jpg?v=1727353591`,
  "musk-tahara": `${CDN}MUSKTAHARAH_0a75799f-2919-488e-b06e-2a3f5a479ae1.jpg?v=1727353602`,
  "nada": `${CDN}NADAFORINDIA.png?v=1727353605`,
  "niko": `${CDN}NIKO24MLFORINDIA.jpg?v=1727353593`,
  "oud-bushra": `${CDN}OUDBUSHRAROLLONFORINDIA.jpg?v=1727353608`,
  "red-coral": `${CDN}REDCORAL.jpg?v=1727353531`,
  "romeo": `${CDN}ROMEO.jpg?v=1727353522`,
  "sadaat": `${CDN}SADAATROLLFORINDIA.jpg?v=1727353567`,
  "sakina": `${CDN}SAKINAROLLFORINDIA.jpg?v=1727353570`,
  "spark": `${CDN}spark-24-ml.jpg?v=1752304221`,
  "tayiba": `${CDN}TAYIBAROLLONFORINDIA.png?v=1727353573`,
  "thaljee": `${CDN}THALJEEROLLONFORINDIA.png?v=1727353576`,
  "yusra": `${CDN}YUSRAROLLONFORINDIA.jpg?v=1727353579`,
  "zahabia": `${CDN}ZAHABIAROLLONINDIA.jpg?v=1727353582`,
};

/** The product's photograph URL, or undefined if none is mapped. */
export function productImagePath(slug: string): string | undefined {
  return PRODUCT_IMAGES[slug];
}
