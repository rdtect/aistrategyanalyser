// Service Worker for AI Strategy Analyzer
const CACHE_NAME = "ai-strategy-analyzer-v1";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/favicon.png",
  "/logo.svg",
  "/logo-dark.svg",
  "/manifest.json",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip API requests
  if (event.request.url.includes("/api/")) return;

  // Skip chrome-extension URLs
  if (event.request.url.startsWith("chrome-extension://")) return;

  // Only handle http and https URLs
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if valid response
        if (!response || response.status !== 200) {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the response for future
        caches.open(CACHE_NAME).then((cache) => {
          try {
            // Only cache http/https URLs
            if (event.request.url.startsWith("http")) {
              cache.put(event.request, responseToCache);
            }
          } catch (error) {
            console.error("Caching error:", error);
          }
        });

        return response;
      })
      .catch(() => {
        // Try to get from cache first
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If offline and requesting a page, show offline page
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }

          // For other resources, just fail
          return new Response("Network error", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          });
        });
      }),
  );
});

// Listen for messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
