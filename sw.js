/* SmartCount offline cache.
   The whole counter is one HTML file, so "work offline" means caching exactly
   that file and serving it first. The site visit happens inside a concrete
   building with no signal; anything that needs the network at demo time is a
   demo that does not happen. */
const CACHE = 'smartcount-v1';
const ASSETS = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Cache first. On a dead network a stale counter beats a dinosaur.
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then(hit => hit ||
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
