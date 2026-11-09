# KumQuote — DESIGN.md (v2, 2026-11-09)

## Direction: "Ink & Gold Poster"
Complete rebuild from v1 (which reused dusaitool's editorial design).
Research-locked: Exa (4 searches) + Firecrawl (2 searches) + ui-ux-pro-max
design systems. Full research + sources: `~/workspace/kumquote-research/RESEARCH.md`.

The site is poster-first, not blog-first. One quote = one poster.

## Fonts (self-hosted via @fontsource, 0 Google Fonts requests)
- **Display — Playfair Display 400/700/900 + italic:** the quote itself,
  wordmark, big titles. Research consensus #1 quote font (high-contrast
  Didone serif, editorial authority, best large). Preload 1 file:
  latin 700 (hero quote).
- **UI/body — Inter 400/500/600/700:** nav, author, buttons, meaning, meta.
- Two families only. Quote tracking tightened (−1–2%) at display sizes.
  Display type 3–6× body size. Attribution in letterspaced caps.
- Removed in v2: @fontsource/instrument-serif.

## Palette — 60-30-10, one accent (gold)
| Role | Light | Dark |
|---|---|---|
| Page bg (60%) | ivory `#FBF8F1` | tinted navy `#0B1526` |
| Surface / card | white `#FFFFFF` | navy `#101C36` |
| Ink / text (30%) | deep navy `#101C36` | ivory `#F2EAD9` |
| Muted text | warm gray `#6B645A` | `#A8A294` |
| Hairline border | warm `#E5DED2` | `#24344F` |
| Accent gold (10%) | `#C19A4B` | lighter gold `#D8B56E` |
| Accent text-safe | deep bronze `#8A6D2B` | `#D8B56E` |

Rules: gold is marks, rules and fills ONLY — never body/link text in
light mode (2.4:1, fails WCAG). Links are ink with underline; the
text-safe bronze is for link/button text. Dark mode is designed on
purpose, never inverted. No gradients, no glows, no shadows on resting
cards, radii by size (buttons/cards rounded-lg, chips rounded-md), no
hover lift, hero entrance 8px / 50-100-150ms, 44px touch targets,
reduced-motion respected, focus ring never removed.

## Layout
- **Header:** one slim sticky bar (64px). Navy-square + gold “ logo,
  Playfair Bold wordmark, nav Home / Quotes / Random, theme toggle
  (System/Light/Dark) in the bar, Search button = navy fill. No utility
  bar, no italic tagline. Mobile menu = full-screen dialog, big Playfair
  links, focus trapped.
- **Home hero:** Quote of the Day as a full navy poster panel
  (rounded-2xl): gold eyebrow, Playfair Bold 48–64px ivory quote, gold
  author line, gold "Browse all quotes" button, ivory-outline "Random".
- **Quote lists:** 2-col grid of poster cards (white surface, 4px gold
  top rule, Playfair Bold 26px quote, author in caps, category + date).
- **Quote page:** centred poster — gold rule, Playfair Bold 40px,
  author caps, Copy / Share on X / WhatsApp, "What it means" (Inter),
  tags, related posters.
- **Random page:** same navy poster panel; press **N** for another quote.
- **Footer:** navy block in both modes (ivory text, light-gold links),
  grid + Back-to-top row + copyright row.
- **OG cards:** navy bg, ivory quote, gold eyebrow + author
  (`scripts/generate_og.py`).

## Locked (unchanged in v2)
English only · Node 24+ · pinned latest packages · System/Light/Dark
theme (localStorage `kumquote-theme`, inline script before paint,
`.dark` class) · quote storage format + schema · all routes/features
(search via Pagefind, random, copy/share, Quote of the Day, OG
self-healing in deploy.yml).

## Verification (v2)
Build exit 0 + dist/index.html, 13/13 local routes 200, screenshots
1440 + 390 in light + dark, no horizontal overflow. See push notes in
MEMORY.md.
