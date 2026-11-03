/* SmartCount offline cache.
   The whole counter is one HTML file, so "work offline" means caching exactly
   that file and serving it first. The site visit happens inside a concrete
   building with no signal; anything that needs the network at demo time is a
   demo that does not happen. */
/* Bump CACHE on every deploy. Cache-first means a phone will otherwise keep
   running the build it installed first, forever — and the version on the
   phone is the version at the customer site. */
const CACHE = 'smartcount-v5-v2live';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    // reload: bypass the HTTP cache, or install re-stores the same stale copy
    .then(c => c.addAll(ASSETS.map(u => new Request(u, {cache: 'reload'}))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
    /* Then reload any open window. The page that is running right now came
       out of the OLD cache, so it does not contain whatever update handler
       the new build added — the fix has to live here, in the worker, or the
       phone stays one launch behind every single deploy. Verified: without
       this, a browser holding the previous version loaded it again even
       though the new worker had already installed. activate runs once per
       worker version, so this cannot loop. */
    .then(() => self.clients.matchAll({type: 'window'}))
    .then(cs => Promise.all(cs.map(c => c.navigate && c.navigate(c.url).catch(() => {})))));
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
