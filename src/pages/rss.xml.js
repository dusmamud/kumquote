import rss from '@astrojs/rss';
import { publishedQuotes, quoteUrl, quoteTitle } from '../lib/quotes.js';

// NOTE: this file must stay .js, not .ts — Astro 7 fails to transform
// rss.xml.ts (known dusaitool fix).
export async function GET(context) {
  const quotes = await publishedQuotes();
  return rss({
    title: 'KumQuote',
    description: 'Quotes worth remembering — with the meaning behind them.',
    site: context.site,
    items: quotes.map((q) => ({
      title: `“${quoteTitle(q)}” — ${q.data.author}`,
      description: q.data.text,
      pubDate: q.data.pubDate,
      link: quoteUrl(q),
    })),
  });
}
