# cupy coffee bar — landing page

Single-page, bilingual (English / Georgian) landing page for cupy coffee bar, Tbilisi.
Built with [Astro](https://astro.build) as a fully static site: **no framework JavaScript**, one ~2 KB inline
script, images optimized at build time, deployable to Vercel with zero configuration.

## Commands

| Command           | What it does                                                    |
| ----------------- | --------------------------------------------------------------- |
| `npm install`     | Install dependencies (Node ≥ 22.23.4)                           |
| `npm run dev`     | Dev server at http://localhost:4321                             |
| `npm run check`   | Type-check all `.astro` / `.ts` files (`astro check`)           |
| `npm test`        | Unit tests for the open/closed logic (Node's built-in runner)   |
| `npm run build`   | Production build into `dist/` (optimizes images, ~1–3 min cold) |
| `npm run preview` | Serve the production build locally                              |

## Project structure

```
src/
  pages/            index.astro (the page), robots.txt.ts, sitemap.xml.ts
  layouts/          BaseLayout.astro — <head>, SEO / Open Graph, font preloads, page frame
  components/
    layout/         Header, Footer, BackgroundWall
    sections/       Hero, OneSpace, Menu, Team, Contact   (one folder each: .astro + .module.css)
    ui/             Section, SectionHeader, Eyebrow, Button, Dialog, Icon (+ icons.ts)
    seo/            StructuredData.astro (schema.org JSON-LD generated from the content below)
  content/          site.ts (contact details, hours, socials), menu.ts, team.ts, story.ts
  i18n/             languages.ts, messages.ts (all UI copy, English + Georgian)
  scripts/          language.ts, carousel.ts, dialogs.ts, openingStatus.ts (+ openingHours.ts)  (one small bundled module)
  styles/           global.css — @font-face, design tokens, reset
  assets/           banner/ space/ menu/ team/ placeholders/ fonts/ og/ cupywall.svg
public/             favicon.svg, apple-touch-icon.png
design-assets/      full New Hero font family (source files; not part of the build)
vercel.json         security headers + immutable caching for hashed assets
```

## Editing content

* **Menu** — `src/content/menu.ts`. Add/remove items and categories; each item has English + Georgian names, an
  optional price (GEL) and an image. Photos live in `src/assets/menu/` and are exported by name from
  `src/assets/menu/index.ts` (a missing file fails the build instead of showing a broken image).
* **Opening hours, phone, e-mail, address, socials, map** — `src/content/site.ts`. The JSON-LD structured data is
  generated from the same file.
* **Team / story** — `src/content/team.ts`, `src/content/story.ts`.
* **All other text** (headings, labels, accessibility strings) — `src/i18n/messages.ts`. Both languages live side by
  side; TypeScript refuses to build if the Georgian dictionary is missing a key.
* **Page title / description** — `src/content/site.ts` (`title`, `description`).

### How the Open / Closed badge works

The badge in the Opening Hours card is live. In the browser, `src/scripts/openingStatus.ts` checks `site.hours`
against the current time in `site.timeZone` (`Asia/Tbilisi`) — never the visitor's own clock or timezone — and
switches the colour and which of the two labels ("Open Now" / "Closed Now") is shown. It re-checks at every wall-clock
minute (so it flips at exactly 10:00 / 11:00 and 21:00), pauses while the tab is hidden and catches up when it is
shown again. The time logic itself is in `src/scripts/openingHours.ts`, a pure module with no DOM. Change the hours in
`src/content/site.ts` and the table, the badge and the JSON-LD all follow. Each entry covers one calendar day
(`opens` inclusive, `closes` exclusive); hours that run past midnight are not supported.

### How the language toggle works

The page is rendered in English. Every translatable element also carries its Georgian text in a `data-ka` attribute
(`data-ka-aria-label`, `data-ka-alt`, `data-ka-title` for attributes), and `src/scripts/language.ts` swaps them when
the visitor clicks EN / GE — instant, no reload, scroll position and open dialogs untouched. Because the markup is
generated from `messages.ts`, you never write those attributes by hand.

### Images

Source images stay in `src/assets/`. At build time Astro's `<Picture>` generates AVIF + WebP at several widths and the
browser picks the right one (`widths` / `sizes` in the section components). Replace a file, keep its name, rebuild.
The three stock placeholder photos in `src/assets/placeholders/` (Social Space, Ice-Cream Coffee, Churchkhela) were
hot-linked from picsum.photos in the original page; swap them for real photography when available.

## Gotchas worth knowing

* **`backdrop-filter` order.** The glass panels write `-webkit-backdrop-filter` *before* `backdrop-filter`. The CSS
  toolchain treats the two as one property and keeps the *later* declaration, so the reverse order silently drops the
  standard property (and the blur disappears in Chrome/Firefox). `astro.config.mjs` also widens the CSS target so the
  prefix is still emitted for older Safari.
* **Whitespace.** `compressHTML: true` in `astro.config.mjs` is deliberate: Astro 7's default (`'jsx'`) removes the
  space between adjacent inline elements.
* **Dialogs** are native `<dialog>` elements placed *outside* the sections that use `backdrop-filter` (such an element
  would become the containing block of the dialog's `position: fixed` overlay).
* **No `overflow: hidden` scroll lock.** Setting it on the page makes browsers re-evaluate `vw` units, which shifts the
  hero height and section padding (the page visibly jumps behind the dialog). `src/scripts/dialogs.ts` instead cancels
  wheel / touch / keyboard scrolling that would reach the page.

## Deploying to Vercel

1. Push the repository to GitHub / GitLab / Bitbucket.
2. In Vercel: **Add New → Project**, import the repository. Vercel detects Astro automatically — keep the defaults
   (build command `astro build`, output directory `dist`, install command `npm install`).
3. *(Recommended)* Under **Settings → Environment Variables** add `SITE_URL` = your final public origin, for example
   `https://cupy.coffee`. It is used for the canonical URL, Open Graph image URLs, `sitemap.xml` and `robots.txt`.
   If unset, the build falls back to the Vercel project's production domain, so previews still work.
4. Deploy. Add your custom domain under **Settings → Domains**, then set / confirm `SITE_URL` and redeploy.

No server, adapter or API keys are needed. The only external dependency at runtime is the Google Maps embed in the
Contact section.

## Known limitations

* Without JavaScript the Open / Closed badge stays on its server-rendered default ("Open Now"); the live status needs
  the script.
* The Georgian version is a client-side toggle, so search engines index the English page. A separate `/ka/` page would
  be the way to get Georgian search traffic.
* On screens ≤ 780 px the header navigation links are hidden, as in the original design.
* The Georgian accessibility labels that did not exist in the original (`a11y` block in `messages.ts`) should be
  reviewed by a native speaker.
* The brand palette gives some text low contrast (white on the orange `#ff7900` buttons is 2.6:1; the footer text and
  inactive GE label are 3.8:1). Fixing that is a design decision, so it was left as is.
