# KumQuote

Quotes in English, as a static Astro site. No server, no database, no monthly cost.

- **Stack (locked 2026-11-09, all latest):** Astro 7.4.7, Tailwind CSS 4.3.5, MDX 8.1.3, sitemap 3.7.4, RSS 4.0.19, Pagefind 1.6.0, Node >= 24.
- **Hosting:** Cloudflare Pages (free) — live URL `https://kumquote.pages.dev`. No domain yet.
- **Language:** English only (locked 2026-11-09).
- **Theme:** System / Light / Dark — default follows the OS, toggle cycles System → Light → Dark, choice saved in `localStorage` (`kumquote-theme`).

## Quotes — the storage format

One quote = one Markdown file in `src/content/quotes/<category>/<slug>.md`:

```md
---
text: "You have to dream before your dreams can come true."
author: "A. P. J. Abdul Kalam"
authorRole: "Former President of India"
category: "motivation"
tags: ["dreams", "morning", "students"]
source: "Wings of Fire"
pubDate: 2026-11-09
featured: true
draft: false
ogImage: '/og/dream-before-dreams-apj-abdul-kalam-en.png'
---

80–150 words of meaning / context / how to use it. The body is what
keeps a quote page from being thin content — never ship a quote page
with an empty body.
```

Schema lives in `src/content.config.ts` (Zod, `z` from `astro/zod`).
`category` must be one of the 12 canonical values — free text breaks
the `/category/<slug>/` pages. Slug = file name, lowercase, hyphens.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro build && pagefind --site dist
```

Check the build by its exit code and `dist/index.html` — never by
grepping for `error` alone (Astro prints `[ERROR]`).

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`): Checkout → generate
missing OG images (`scripts/generate_og.py all`, checkout only, no
commit-back) → `npm ci` → `npm run build` → `wrangler pages deploy
dist --project-name=kumquote`. Needs `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` secrets. Never force-push `main`.

## Bulk import

Write quotes as JSON (one object per quote, same fields as the
frontmatter plus `meaning` for the body), then run
`scripts/quotes_from_json.py` — it validates the category against the
canonical list, rejects duplicate slugs, and writes one `.md` per quote.
