// Curated collections: hand-picked sets of quotes on one theme.
// Each collection is a fixed list of quote slugs — the quotes
// themselves live in src/content/quotes/ and are looked up by slug
// at build time, so a collection never shows a missing quote.
export interface Collection {
  slug: string;
  title: string;
  description: string;
  quotes: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'for-hard-days',
    title: 'For hard days',
    description: 'When life pushes back — six quotes on getting through it, not around it.',
    quotes: [
      'difficulties-intended-to-make-us-better-not-bitter',
      'in-the-middle-of-difficulty-lies-opportunity',
      'life-is-not-about-waiting-for-the-storm-to-pass',
      'learning-how-to-sail-my-ship',
      'do-not-pray-for-an-easy-life',
      'washington-success-measured-obstacles',
    ],
  },
  {
    slug: 'morning-quotes',
    title: 'Morning quotes',
    description: 'Fresh starts, first steps, and new days — six quotes to begin with.',
    quotes: [
      'every-moment-is-a-fresh-beginning',
      'lao-tzu-thousand-miles',
      'way-to-get-started-is-to-quit-talking',
      'devout-thanksgiving-for-my-friends',
      'lewis-wait-so-long-to-begin',
      'the-man-who-moves-a-mountain',
    ],
  },
  {
    slug: 'on-gratitude',
    title: 'On gratitude',
    description: 'Six quotes on noticing what you already have.',
    quotes: [
      'be-thankful-for-what-you-have',
      'when-you-are-grateful-fear-disappears',
      'highest-appreciation-is-not-to-utter-words',
      'appreciation-is-a-wonderful-thing',
      'gratitude-can-transform-common-days',
      'let-us-be-grateful-to-the-people',
    ],
  },
];

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
