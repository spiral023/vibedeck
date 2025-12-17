// VibeDeck Service Worker - Minimal skeleton
const CACHE_NAME = 'vibedeck-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Minimal fetch handler - no aggressive caching for now
self.addEventListener('fetch', (event) => {
  // Let the browser handle all requests normally
});
