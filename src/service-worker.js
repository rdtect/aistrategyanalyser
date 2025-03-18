// Import the Workbox library from CDN
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

// Use the workbox library if it loaded correctly
if (workbox) {
  console.log("Workbox loaded successfully!");

  // Set the cache name prefix and maximum age for cached resources
  workbox.core.setCacheNameDetails({
    prefix: "strategy-ai-app-cache",
    suffix: "v1",
  });

  // Cache the Google Fonts
  workbox.routing.registerRoute(
    new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
    new workbox.strategies.CacheFirst({
      cacheName: "google-fonts",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // Cache the application shell (CSS, JS, logo, etc.)
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === "style" ||
      request.destination === "script" ||
      request.destination === "image",
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "static-resources",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        }),
      ],
    })
  );

  // Cache the API responses
  workbox.routing.registerRoute(
    new RegExp("/api/(?!ai/).*"), // Cache API requests except AI endpoints
    new workbox.strategies.NetworkFirst({
      cacheName: "api-responses",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        }),
      ],
    })
  );

  // Precache the app shell and offline page
  workbox.precaching.precacheAndRoute([
    { url: '/offline.html', revision: '1' },
    ...(self.__WB_MANIFEST || [])
  ]);

  // Register a navigation route for offline fallback
  const navigationRoute = new workbox.routing.NavigationRoute(
    new workbox.strategies.NetworkFirst({
      cacheName: 'navigations',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    }),
    {
      // Return offline page for navigation requests that fail
      catchHandler: ({ event }) => {
        return caches.match('/offline.html');
      },
    }
  );
  workbox.routing.registerRoute(navigationRoute);

  // Skip the 'waiting' phase and immediately activate new service worker
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });
} else {
  console.log("Workbox failed to load");
  
  // Fallback fetch handler for when workbox isn't available
  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request)
          .catch(() => {
            return caches.match('/offline.html');
          })
      );
    }
  });
}

// Handle the installation of the service worker
self.addEventListener("install", (event) => {
  // Cache the offline page during installation
  event.waitUntil(
    caches.open('offline-cache').then((cache) => {
      return cache.add('/offline.html');
    })
  );
});

// Handle the activation of the service worker
self.addEventListener("activate", (event) => {
  // Clean up old caches, if needed
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete old caches here
            return (
              cacheName.startsWith("strategy-ai-app-cache") &&
              cacheName !== "strategy-ai-app-cache-v1"
            );
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});
