// Scroll reveals (motion v3): elements with [data-reveal] fade + rise
// once when they enter the viewport. Stagger is computed per parent
// (index % 8 * 60ms) so grids cascade without template changes.
// The .js class gates the hidden state in CSS — if this script never
// runs, content is never hidden.
document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

if (reduceMotion) {
  targets.forEach((el) => el.classList.add('is-visible'));
} else if (targets.length > 0) {
  // Stagger siblings: same parent → index-based delay, capped at 8.
  const byParent = new Map<Element, HTMLElement[]>();
  for (const el of targets) {
    const parent = el.parentElement ?? document.body;
    const list = byParent.get(parent) ?? [];
    list.push(el);
    byParent.set(parent, list);
  }
  for (const list of byParent.values()) {
    list.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${(i % 8) * 60}ms`);
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );
  targets.forEach((el) => io.observe(el));
}
