# Product photography — Aaya Perfume

Drop the Naseem 24ml roll-on photographs in this folder. The filenames below
are the ones the site looks for. **The exact name matters** — it must match
including the `.jpg` extension.

| File | Product | Page |
|------|---------|------|
| `oud-bushra.jpg` | Oud Bushra | `/fragrance/oud-bushra` |
| `black-oud.jpg` | Black Oud | `/fragrance/black-oud` |
| `bukhoor.jpg` | Bukhoor | `/fragrance/bukhoor` |
| `burhan.jpg` | Burhan | `/fragrance/burhan` |
| `bushra.jpg` | Bushra | `/fragrance/bushra` |
| `jazi.jpg` | Jazi | `/fragrance/jazi` |
| `nada.jpg` | Nada | `/fragrance/nada` |
| `niko.jpg` | Niko | `/fragrance/niko` |
| `spark.jpg` | Spark | `/fragrance/spark` |
| `yusra.jpg` | Yusra | `/fragrance/yusra` |
| `amani.jpg` | Amani | `/fragrance/amani` |
| `daliya.jpg` | Daliya | `/fragrance/daliya` |
| `jameelah-green.jpg` | Jameelah Green | `/fragrance/jameelah-green` |
| `lovely.jpg` | Lovely | `/fragrance/lovely` |
| `azhar.jpg` | Azhar | `/fragrance/azhar` |
| `be-sugar.jpg` | Be Sugar | `/fragrance/be-sugar` |
| `candy.jpg` | Candy | `/fragrance/candy` |
| `zahabia.jpg` | Zahabia | `/fragrance/zahabia` |
| `al-aqmar.jpg` | Al Aqmar | `/fragrance/al-aqmar` |
| `dani.jpg` | Dani | `/fragrance/dani` |
| `sadaat.jpg` | Sadaat | `/fragrance/sadaat` |
| `tayiba.jpg` | Tayiba | `/fragrance/tayiba` |
| `juliet.jpg` | Juliet | `/fragrance/juliet` |

## If a photo is missing

Nothing breaks. The shop falls back to the illustrated bottle tinted per
product, so you can add photos one at a time. Any file that 404s is caught
the same way.

## Tips for good results

- **Square or 4:5 portrait** works best — the cards are `aspect-[4/5]`.
- **Under ~150KB each** keeps the shop fast on mobile data, which matters a lot
  for your customers. Resize before adding.
- The slug-to-file list lives in `src/lib/product-images.ts` if you need to
  rename something.

## Products without a photo yet

These still show the illustrated bottle, and can have photos added later by
adding a line to `src/lib/product-images.ts`:

afzal, jameelah-red, joey, laeqa, lamsa, mufaddal, mufaddal-oud, mukhallat,
musk-bushra, musk-tahara, red-coral, romeo, sakina, thaljee