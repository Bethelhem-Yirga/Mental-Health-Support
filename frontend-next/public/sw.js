// Service Worker for MindSpace PWA
const CACHE_NAME = 'mindspace-v1';
const OFFLINE_URL = '/offline';

// Assets to cache immediately
const PRECACHE_URLS = [
  '/',
  '/chat',
  '/journal',
  '/assessment',
  '/therapists',
  '/mindfulness',
  '/resources',
  '/crisis',
  '/guidelines',
  '/manifest.json',
  '/offline'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests differently
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({
          error: 'You are offline. Please check your connection.',
          offline: true
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // For navigation requests, try network first, fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return caches.match('/offline');
            });
        })
    );
    return;
  }

  // For static assets, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
      })
  );
});

// Background sync for offline mood entries
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-moods') {
    event.waitUntil(syncMoods());
  }
});

async function syncMoods() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  for (const request of requests) {
    if (request.url.includes('/api/moods/entry')) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
        }
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }
}
