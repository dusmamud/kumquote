// KumQuote service worker: installable-PWA baseline.
// Network-first for pages (the site adds quotes daily), cache-first
// for same-origin static assets, tiny offline page for navigations
// when both the network and the cache fail.
const CACHE = 'kumquote-v1';
const SHELL = ['/', '/manifest.webmanifest', '/favicon.svg', '/apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const OFFLINE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Offline — KumQuote</title><style>body{font-family:Georgia,serif;background:#FBF8F1;color:#101C36;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px;text-align:center}h1{font-size:28px}p{color:#6B645A;line-height:1.6}a{color:#8A6D2B}</style></head><body><main><h1>You are offline</h1><p>KumQuote needs an internet connection for new quotes.<br>Check your connection and try again.</p><p><a href="/">Try again</a></p></main></body></html>`;

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then(
              (cached) =>
                cached ||
                new Response(OFFLINE_HTML, { headers: { 'content-type': 'text/html; charset=utf-8' } }),
            ),
        ),
    );
    return;
  }
  // Static assets: cache-first.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        }),
    ),
  );
});
