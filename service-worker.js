const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/Gsterz502E/',
  '/Gsterz502E/index.html',
  '/Gsterz502E/script.js',
  '/Gsterz502E/manifest.json',
  '/Gsterz502E/icon-192.jpg',
  '/Gsterz502E/icon-512.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});