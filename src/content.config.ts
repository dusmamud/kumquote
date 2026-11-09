import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One quote = one Markdown file. The slug is the file name, so the
// file name IS the URL — keep it lowercase, hyphenated, short.
// English only (locked 2026-11-09): no locale field, no translationOf.
export const CATEGORIES = [
  'motivation',
  'success',
  'life',
  'love',
  'friendship',
  'discipline',
  'happiness',
  'wisdom',
  'leadership',
  'time',
  'courage',
  'gratitude',
] as const;

const quotes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/quotes' }),
  schema: z.object({
    // The exact quote text. Never paraphrased, never reworded.
    // 10–500 chars: longer than that is an excerpt, not a quote.
    text: z.string().min(10).max(500),
    // Display name of the author.
    author: z.string().min(2).max(80),
    // Short role, e.g. "Former President of India".
    authorRole: z.string().max(80).optional(),
    // Canonical category — only the 12 values above. Free text here
    // breaks the /category/<slug>/ pages.
    category: z.enum(CATEGORIES),
    tags: z.array(z.string()).max(5).default([]),
    // Where it comes from — book / speech / interview. Leave it out
    // when unknown; never guess a source.
    source: z.string().max(120).optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    // Per-quote OG image path (e.g. '/og/<slug>-en.png'). When absent,
    // SEO falls back to the site-wide /og.png.
    ogImage: z.string().optional(),
  }),
});

export const collections = { quotes };
