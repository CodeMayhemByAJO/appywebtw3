const CACHE_NAME = 'appyChap-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/whatwedo.html',
  '/whatwevedone.html',
  '/contact.html',
  '/integrity.html',
  '/dist/output.css',
  '/chat.js',
  '/images/nyloggaweb.webp',
  '/images/indexnew.webp',
  '/images/preview.webp',
  '/images/favicon.ico',
  '/images/site.webmanifest'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
