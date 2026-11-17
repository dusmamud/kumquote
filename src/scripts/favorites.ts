// Favorites: saved quote slugs in localStorage, no account. Every
// [data-fav-slug] button toggles its quote; the /favorites/ page
// renders the saved quotes from /quotes-data.json. All text is
// inserted via textContent, never innerHTML.
const KEY = 'kumquote-favorites';

interface FeedQuote {
  slug: string;
  text: string;
  author: string;
  authorSlug: string;
  category: string;
  url: string;
}

function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

function save(list: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* private mode: favorites last for this session only */
  }
}

function updateBadge(count: number) {
  const badge = document.getElementById('fav-count');
  if (!badge) return;
  badge.textContent = String(count);
  badge.classList.toggle('hidden', count === 0);
  badge.classList.toggle('flex', count > 0);
}

function syncButtons(saved: Set<string>) {
  document.querySelectorAll<HTMLElement>('[data-fav-slug]').forEach((btn) => {
    const slug = btn.getAttribute('data-fav-slug') ?? '';
    const active = saved.has(slug);
    btn.setAttribute('aria-pressed', String(active));
    const label = btn.querySelector('.fav-label');
    if (label) label.textContent = active ? 'Saved ✓' : 'Save to favorites';
  });
}

function toggle(slug: string, btn: HTMLElement) {
  const saved = load();
  const i = saved.indexOf(slug);
  if (i === -1) saved.push(slug);
  else saved.splice(i, 1);
  save(saved);
  const set = new Set(saved);
  syncButtons(set);
  updateBadge(saved.length);
  btn.classList.remove('fav-pop');
  void btn.offsetWidth; // restart the pop animation
  btn.classList.add('fav-pop');
  if (document.getElementById('favorites-list')) renderFavorites(set);
}

document.addEventListener('click', (event) => {
  const btn = (event.target as HTMLElement | null)?.closest?.('[data-fav-slug]') as HTMLElement | null;
  if (!btn) return;
  const slug = btn.getAttribute('data-fav-slug') ?? '';
  if (!slug) return;
  toggle(slug, btn);
});

function quoteCard(q: FeedQuote): HTMLElement {
  const article = document.createElement('article');
  article.className = 'poster-card flex flex-col rounded-xl border border-border bg-surface p-5 dark:border-border-dark dark:bg-surface-dark';
  const rule = document.createElement('span');
  rule.setAttribute('aria-hidden', 'true');
  rule.className = 'h-1 w-10 rounded-full bg-gold';
  const quote = document.createElement('blockquote');
  quote.className = 'mt-4 font-display text-display-card font-bold tracking-[-0.01em] text-ink dark:text-text-dark';
  const link = document.createElement('a');
  link.href = q.url;
  link.className = 'transition-colors duration-150 hover:text-brand dark:hover:text-brand-dark';
  link.textContent = `“${q.text}”`;
  quote.appendChild(link);
  const meta = document.createElement('p');
  meta.className = 'mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] text-muted dark:text-text-dark-3';
  const author = document.createElement('a');
  author.href = `/author/${q.authorSlug}/`;
  author.className = 'font-semibold uppercase tracking-[0.08em] text-brand dark:text-brand-dark';
  author.textContent = q.author;
  const dot = document.createElement('span');
  dot.setAttribute('aria-hidden', 'true');
  dot.textContent = '·';
  const cat = document.createElement('a');
  cat.href = `/category/${q.category}/`;
  cat.className = 'capitalize underline decoration-border underline-offset-4 hover:text-brand dark:decoration-border-dark-2 dark:hover:text-brand-dark';
  cat.textContent = q.category;
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.setAttribute('data-fav-slug', q.slug);
  remove.setAttribute('aria-pressed', 'true');
  remove.className = 'ms-auto text-sm font-medium text-muted underline decoration-border underline-offset-4 hover:text-brand dark:text-text-dark-3 dark:hover:text-brand-dark';
  remove.textContent = 'Remove';
  meta.append(author, dot, cat, remove);
  article.append(rule, quote, meta);
  return article;
}

// /favorites/ page: render saved quotes as poster cards.
async function renderFavorites(saved: Set<string>) {
  const list = document.getElementById('favorites-list');
  const empty = document.getElementById('favorites-empty');
  if (!list) return;
  let quotes: FeedQuote[] = [];
  try {
    const res = await fetch('/quotes-data.json');
    quotes = await res.json();
  } catch {
    quotes = [];
  }
  const bySlug = new Map(quotes.map((q) => [q.slug, q]));
  // Newest-saved first.
  const ordered = load()
    .filter((s) => saved.has(s))
    .reverse();
  list.replaceChildren();
  for (const slug of ordered) {
    const q = bySlug.get(slug);
    if (!q) continue;
    list.appendChild(quoteCard(q));
  }
  if (empty) empty.hidden = ordered.length > 0;
}

// Init.
const initial = new Set(load());
syncButtons(initial);
updateBadge(initial.size);
if (document.getElementById('favorites-list')) renderFavorites(initial);
