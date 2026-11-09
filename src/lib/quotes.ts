import { getCollection, type CollectionEntry } from 'astro:content';

export type QuoteEntry = CollectionEntry<'quotes'>;

/** "A. P. J. Abdul Kalam" -> "a-p-j-abdul-kalam". Same rule for
    authors, tags and categories, so URLs never contain spaces or
    uppercase letters. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function quoteSlug(entry: QuoteEntry): string {
  // glob() ids are the file path relative to base, without extension,
  // e.g. "motivation/dream-before-dreams-apj-abdul-kalam".
  const parts = entry.id.split('/');
  return parts[parts.length - 1] ?? entry.id;
}

export function quoteUrl(entry: QuoteEntry): string {
  return `/quotes/${quoteSlug(entry)}/`;
}

export function authorSlug(author: string): string {
  return slugify(author);
}

export function authorUrl(author: string): string {
  return `/author/${authorSlug(author)}/`;
}

export function categoryUrl(category: string): string {
  return `/category/${slugify(category)}/`;
}

export function tagUrl(tag: string): string {
  return `/tag/${slugify(tag)}/`;
}

export async function publishedQuotes(): Promise<QuoteEntry[]> {
  const all = await getCollection('quotes', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function findQuote(slug: string): Promise<QuoteEntry | undefined> {
  const quotes = await publishedQuotes();
  return quotes.find((q) => quoteSlug(q) === slug);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Quote of the Day — deterministic, no server: the UTC day-of-year
    picks the quote, so every visitor sees the same quote on the same
    day, and it changes when the date changes. */
export function quoteOfTheDay(quotes: QuoteEntry[], on = new Date()): QuoteEntry | undefined {
  if (quotes.length === 0) return undefined;
  const start = Date.UTC(on.getUTCFullYear(), 0, 0);
  const day = Math.floor((on.getTime() - start) / 86400000);
  const sorted = [...quotes].sort((a, b) => quoteSlug(a).localeCompare(quoteSlug(b)));
  return sorted[day % sorted.length];
}

/** All categories present in the published quotes, with counts. */
export async function categoryCounts(): Promise<{ category: string; count: number }[]> {
  const quotes = await publishedQuotes();
  const map = new Map<string, number>();
  for (const q of quotes) map.set(q.data.category, (map.get(q.data.category) ?? 0) + 1);
  return [...map.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

/** All authors present in the published quotes, with counts. */
export async function authorCounts(): Promise<{ author: string; count: number }[]> {
  const quotes = await publishedQuotes();
  const map = new Map<string, number>();
  for (const q of quotes) map.set(q.data.author, (map.get(q.data.author) ?? 0) + 1);
  return [...map.entries()]
    .map(([author, count]) => ({ author, count }))
    .sort((a, b) => b.count - a.count || a.author.localeCompare(b.author));
}

/** All tags with their quote counts, computed at build time. */
export async function tagCounts(): Promise<{ tag: string; count: number }[]> {
  const quotes = await publishedQuotes();
  const map = new Map<string, number>();
  for (const q of quotes) {
    for (const tag of q.data.tags ?? []) map.set(tag, (map.get(tag) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Related quotes: same author first, then same category, then shared
    tags, newest first. */
export async function relatedQuotes(entry: QuoteEntry, limit = 3): Promise<QuoteEntry[]> {
  const quotes = (await publishedQuotes()).filter((q) => q.id !== entry.id);
  const score = (q: QuoteEntry) => {
    const sameAuthor = q.data.author === entry.data.author ? 3 : 0;
    const sameCategory = q.data.category === entry.data.category ? 2 : 0;
    const sharedTags = (q.data.tags ?? []).filter((tag) => (entry.data.tags ?? []).includes(tag)).length;
    return sameAuthor + sameCategory + sharedTags;
  };
  return quotes
    .sort((a, b) => score(b) - score(a) || b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, limit);
}

/** Short title for a quote page: first ~60 chars of the quote text. */
export function quoteTitle(entry: QuoteEntry): string {
  const text = entry.data.text.replace(/[""]/g, '');
  return text.length > 60 ? `${text.slice(0, 57).trimEnd()}…` : text;
}
