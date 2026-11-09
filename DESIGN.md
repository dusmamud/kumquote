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

## Fluid type scale (research-locked 2026-11-09, Exa ×3 + Firecrawl ×1)
Display sizes are `clamp()` tokens in `global.css` (`--text-display-*`),
rem bounds so user font settings and 200% zoom keep working (WCAG 1.4.4;
vw alone would break zoom). No stepped `text-3xl/4xl/5xl` sizes remain
for display type. Measured px across 320 → 768 → 1440:

| Token | clamp() | px | Used for |
|---|---|---|---|
| `--text-display-hero` | clamp(2.5rem, 1.375rem + 4.5vw, 4rem), lh 1.1 | 40 → 58 → 68 | home hero quote |
| `--text-display-quote` | clamp(2rem, 1.25rem + 3vw, 3.5rem), lh 1.15 | 32 → 44 → 59 | quote page, Random panel |
| `--text-display-card` | clamp(1.5rem, 1.25rem + 1vw, 1.875rem), lh 1.25 | 24 → 29 → 32 | poster cards |
| `--text-display-h1` | clamp(2rem, 1.5rem + 2vw, 3rem), lh 1.1 | 32 → 41 → 51 | page titles |
| `--text-display-h2` | clamp(1.75rem, 1.5rem + 1vw, 2.25rem), lh 1.2 | 28 → 33 → 38 | section titles |

Widths in `ch`, never px: hero quote `max-w-[26ch]` (verified: 26ch =
1144px at 68px Playfair Bold), body/prose `max-w-[65ch]` (45–75ch ideal,
66ch ideal per Bringhurst). All quote blockquotes use
`text-wrap: balance`. Body stays 16px mobile / 17px desktop, never below
16px. Buttons/meta 15px, eyebrow 13px caps, footer 20px, wordmark 22px,
menu links 32px — all inside research ranges, unchanged.

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
  (System/Light/Dark) in the bar on desktop only — on mobile the toggle
  lives inside the hamburger menu (bottom row, next to RSS); both buttons
  share one state. Search button = navy fill. No utility bar, no italic
  tagline. Mobile menu = full-screen dialog, big Playfair links, focus
  trapped.
- **Home hero:** Quote of the Day as a full navy poster panel
  (rounded-2xl): gold eyebrow, Playfair Bold fluid 40–68px ivory quote
  (max-w 26ch), gold author line, gold "Browse all quotes" button,
  ivory-outline "Random".
- **Quote lists:** 2-col grid of poster cards (white surface, 4px gold
  top rule, Playfair Bold fluid 24–32px quote, author in caps, category
  + date).
- **Quote page:** centred poster — gold rule, Playfair Bold fluid 32–59px,
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
