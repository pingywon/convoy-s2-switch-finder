# Convoy S2+ Switch Finder

Interactive fitment guide: tells a Convoy S2+ owner whether their host **can take a tail-switch
swap**, then walks them to the right in-stock parts on gadgetconnections.com.

![Storefront](docs/storefront-live.png)

## Why this exists

About half the S2+ lineup ships with a **pressure-fit tail** that cannot be removed. The split
does not follow price or material — it runs *through* the Titanium line, which is the fact
customers most reliably get wrong.

| | Count | Finishes |
|---|---|---|
| **Accepts a swap** | 10 | Black · Gray · Golden · MAO (Stone White) · Cu (Copper) · Brass · Ti Glossy · Ti Stone Washed · Ti Gold Circuit · Ti Multi-Color Circuit |
| **Pressure-fit — cannot** | 10 | Blue · Green · Red · Orange · Purple · Tan · Silver · Cyan · Ti Multi-Color Spatter · Ti Green Circuit |
| **Undocumented** | 1 | Ti Purple Swirl |

Other hard rules encoded here:

- A compatible host takes **exactly one** of: Rubber Illuminated, Metal Illuminated, Forward Clicky.
- **Illuminated and Forward Clicky are mutually exclusive** — no illuminated forward clicky exists.
- Rubber shows more light than metal. Metal has a swappable centre button.
- Reverse clicky: full click on, tap to change modes, slight delay.
  Forward clicky: half-press momentary, full click to stay on.

## Files

| File | What it is |
|---|---|
| `index.html` | Standalone build — light **and** dark themes. Used for the Claude artifact and the LAN copy. |
| `storefront-page.html` | Shopify page-body build — **dark only**, scoped to `#s2fit`, matched to the GC theme. Not interchangeable with `index.html`. |
| `data.js` | Source-of-truth data: hosts, verdicts, parts, prices, stock, product handles. |
| `parts.json` | Original catalogue inventory scaffold. |

## Where it's deployed

| Surface | URL |
|---|---|
| Storefront (**unlinked test page**) | `/pages/convoy-s2-switch-finder` — Page id `gid://shopify/Page/157247963451` |
| LAN | `http://192.168.13.131/s2-switch-guide/` |
| Artifact | `https://claude.ai/code/artifact/103af8ab-b680-4861-82b1-c213e6787534` |

The original `/pages/convoy-s2-faq` is **untouched** and still linked in nav as
"S2+ FAQ - READ 1st!". Whether the finder replaces it is an open decision.

## Storefront gotchas (these cost real time — read before editing)

1. Shopify page bodies **do** execute `<script>` and `<style>`.
2. The theme rule `#section-…__main div { color:#d4d6db }` uses **ID specificity** and overrides
   class selectors. Everything is wrapped in `<div id="s2fit">` and every rule is prefixed
   `#s2fit .x` so ID+class outranks ID+element.
3. `.gc-static-page` is capped at **max-width:768px**. The breakout uses
   `margin-left:calc(50% - min(590px,47vw))` — **never** `transform:translateX()`, which creates a
   containing block and silently kills `position:sticky` on the build sheet.
4. `--sans:inherit` picks up the theme's display face.

## Known data gaps

- **Ti Purple Swirl** appears on neither compatibility list. Marked undocumented, not guessed.
- No published reason *why* pressure-fit hosts differ.
- Whether the 18350 short tube affects switch fit is undocumented.

## Catalogue discrepancies found

The published FAQ page **understates live inventory**:

- LED colours: page lists 5, store stocks **8** (Pink, White, Purple missing from the page).
- Metal centre buttons: page says Silver/Black, store sells **12** finishes (11 @ $0.99 + brass @ $1.99).

`data.js` is built from the live catalogue, so it is correct; the old page is not.

## Updating

Edit `storefront-page.html`, then `pageUpdate` against page id `157247963451`. Prices and stock in
`data.js` are a point-in-time snapshot from 2026-08-08 — the product page is authoritative.
