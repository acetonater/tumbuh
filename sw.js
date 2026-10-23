/* Serumah — service worker untuk mode offline.
   Menyimpan berkas tampilan aplikasi agar tetap bisa dibuka tanpa internet.
   Permintaan ke /api/ TIDAK pernah disimpan: data keluarga selalu diambil langsung dari server. */
const CACHE = 'tumbuh-shell-v2';
const SHELL = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('tumbuh-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Jangan sentuh API, fungsi Netlify, atau halaman tautan lihat-saja.
  if (url.origin === self.location.origin &&
      (url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/'))) return;
  if (url.searchParams.has('share')) return;

  // Font Google: pakai salinan tersimpan bila ada, perbarui di latar belakang.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request).then((response) => {
          if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone());
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Berkas aplikasi: utamakan versi terbaru dari jaringan, jatuh ke cache saat offline.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request, { ignoreSearch: request.mode === 'navigate' });
        if (cached) return cached;
        if (request.mode === 'navigate') return caches.match('index.html');
        return Response.error();
      })
  );
});
