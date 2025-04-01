/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Add type declarations for service worker types
interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<any>): void;
}

interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): void;
}


// Properly cast self to ServiceWorkerGlobalScope
const sw: ServiceWorkerGlobalScope = self as unknown as ServiceWorkerGlobalScope;
import { build, files, version } from "$service-worker";

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

// Add resources to pre-cache
const ASSETS = [
  ...build, // JavaScript & CSS
  ...files, // Static files in the static directory
].map((file) => (file.startsWith("/") ? file : `/${file}`));

// Additional resources to cache on install
const ADDITIONAL_ASSETS = ["/", "/chats", "/settings", "/api/v1/health", "/offline"];

// Install handler - precache all static assets
sw.addEventListener("install", (event: ExtendableEvent) => {
  // Cache our assets when the service worker installs
  event.waitUntil(
    (async () => {
      try {
        // Skip waiting first
        const skipWaitingPromise = sw.skipWaiting();

        // Open cache and add assets in parallel
        const cache = await caches.open(CACHE);
        const cachePromise = cache.addAll([...ASSETS, ...ADDITIONAL_ASSETS]);

        // Wait for both operations to complete
        await Promise.all([skipWaitingPromise, cachePromise]);
        console.log("Service worker installed and assets cached");
      } catch (error) {
        console.error("Failed to cache assets:", error);
      }
    })()
  );
});

// Activate handler - clean up old caches
sw.addEventListener("activate", (event: ExtendableEvent) => {
  // Delete old caches
  event.waitUntil(
    (async () => {
      try {
        // Claim clients first
        const claimPromise = sw.clients.claim();

        // Delete old caches in parallel
        const keys = await caches.keys();
        const oldCaches = keys.filter((key) => key !== CACHE);
        const deleteCachesPromise = Promise.all(oldCaches.map((key) => caches.delete(key)));

        // Wait for both operations to complete
        await Promise.all([claimPromise, deleteCachesPromise]);
        console.log("Old caches deleted and clients claimed");
      } catch (error) {
        console.error("Failed to delete old caches:", error);
      }
    })()
  );
});

// Fetch handler - provide offline support
sw.addEventListener("fetch", (event: FetchEvent) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip cross-origin requests
  if (url.origin !== sw.location.origin) return;

  // For API requests, try network first, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      (async () => {
        try {
          // Try network first
          const response = await fetch(event.request);

          // Cache successful responses
          if (response.ok) {
            const cache = await caches.open(CACHE);
            await cache.put(event.request, response.clone());
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
      })()
    );
    return;
  }

  // For page navigations (HTML requests), use network first with offline fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Try to get from network first
          const response = await fetch(event.request);

          // Cache successful responses for next time
          if (response.ok) {
            const cache = await caches.open(CACHE);
            await cache.put(event.request, response.clone());
          }

          return response;
        } catch (error) {
          // Network failed, try cache
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) return cachedResponse;

          // If no cached response, try the offline page
          const offlineResponse = await caches.match("/offline");
          return offlineResponse || new Response("You are offline", {
            status: 503,
            headers: { "Content-Type": "text/plain" }
          });
        }
      })()
    );
    return;
  }

  // For other requests (assets, images, etc.), use cache-first strategy
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;

      try {
        const networkResponse = await fetch(event.request);

        // Cache successful responses for future use
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE);
          await cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        console.error("Failed to fetch resource:", error);
        return new Response("Failed to fetch resource", {
          status: 408,
          headers: { "Content-Type": "text/plain" }
        });
      }
    })()
  );
});