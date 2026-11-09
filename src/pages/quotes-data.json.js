import { publishedQuotes, quoteSlug, quoteUrl, authorSlug } from '../lib/quotes.js';

// Lightweight JSON feed for the /random/ page (client-side pick).
// Only the fields the random page needs — not the meaning body.
export async function GET() {
  const quotes = await publishedQuotes();
  const data = quotes
    .map((q) => ({
      slug: quoteSlug(q),
      text: q.data.text,
      author: q.data.author,
      authorSlug: authorSlug(q.data.author),
      category: q.data.category,
      url: quoteUrl(q),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
