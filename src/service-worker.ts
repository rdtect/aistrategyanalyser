/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="es2020" />
/// <reference lib="WebWorker" />

import { build, files, version } from "$service-worker";

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

// Add resources to pre-cache
const ASSETS = [
  ...build, // JavaScript & CSS
  ...files, // Static files in the static directory
].map((file) => (file.startsWith("/") ? file : `/${file}`));

// Additional resources to cache on install
const ADDITIONAL_ASSETS = [
  "/",
  "/chats",
  "/settings",
  "/offline",
  "/api/v1/health",
];

// Install handler - precache all static assets
self.addEventListener("install", (event) => {
  // Use faster skipWaiting to avoid waiting for clients to close
  self.skipWaiting();

  // Cache our assets when the service worker installs
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll([...ASSETS, ...ADDITIONAL_ASSETS]);
    console.log("Service worker installed and assets cached");
  }

  event.waitUntil(addFilesToCache());
});

// Activate handler - clean up old caches
self.addEventListener("activate", (event) => {
  // Take control immediately, don't wait for reload
  self.clients.claim();

  // Delete old caches
  async function deleteOldCaches() {
    const keys = await caches.keys();
    const oldCaches = keys.filter((key) => key !== CACHE);
    await Promise.all(oldCaches.map((key) => caches.delete(key)));
    console.log("Old caches deleted");
  }

  event.waitUntil(deleteOldCaches());
});

// Fetch handler - provide offline support
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // For API requests, try network first, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    async function apiNetworkFirst() {
      try {
        // Try network first
        const response = await fetch(event.request);

        // Cache successful responses
        if (response.ok) {
          const cache = await caches.open(CACHE);
          cache.put(event.request, response.clone());
        }

        return response;
      } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(event.request);

        // If we have a cached response, use it
        if (cachedResponse) return cachedResponse;

        // Otherwise return a default offline API response
        return new Response(
          JSON.stringify({
            error: "You are offline and this request is not cached.",
            offline: true,
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    event.respondWith(apiNetworkFirst());
    return;
  }

  // For page navigations (HTML requests), use network first with offline fallback
  if (event.request.mode === "navigate") {
    async function navigationNetworkFirst() {
      try {
        // Try to get from network first
        const response = await fetch(event.request);

        // Cache successful responses for next time
        if (response.ok) {
          const cache = await caches.open(CACHE);
          cache.put(event.request, response.clone());
        }

        return response;
      } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;

        // If no cached response, try the offline page
        return caches.match("/offline");
      }
    }

    event.respondWith(navigationNetworkFirst());
    return;
  }

  // For other requests (assets, images, etc.), use cache-first strategy
  async function cacheFirst() {
    // Check cache first
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) return cachedResponse;

    // If not in cache, go to network
    try {
      const networkResponse = await fetch(event.request);

      // Cache successful responses for static assets
      if (networkResponse.ok) {
        // Only cache static assets, not dynamic content
        if (
          url.pathname.match(
            /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/,
          ) ||
          ASSETS.includes(url.pathname) ||
          ADDITIONAL_ASSETS.includes(url.pathname)
        ) {
          const cache = await caches.open(CACHE);
          cache.put(event.request, networkResponse.clone());
        }
      }

      return networkResponse;
    } catch (error) {
      // If both cache and network fail, return a simple offline message
      // Only for non-critical assets
      return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      });
    }
  }

  event.respondWith(cacheFirst());
});
