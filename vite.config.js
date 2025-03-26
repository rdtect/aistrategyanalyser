import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";

// Determine if we're in production
const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    // Only include PWA plugin in production
    ...(isProd
      ? [
          SvelteKitPWA({
            strategies: "generateSW",
            registerType: "autoUpdate",
            workbox: {
              globPatterns: [
                "client/**/*.{js,css,ico,png,svg,webp,webmanifest}",
                "prerendered/**/*.{html,json}",
              ],
              cleanupOutdatedCaches: true,
              skipWaiting: true,
              clientsClaim: true,
              navigateFallback: "/offline",
              runtimeCaching: [
                {
                  urlPattern: ({ url }) =>
                    url.protocol === "http" || url.protocol === "https",
                  handler: "NetworkFirst",
                },
              ],
              // Exclude chrome-extension URLs from caching
              navigateFallbackDenylist: [/^chrome-extension:\/\//, /\/api\//],
              // Ignore URL parameter for caching
              ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
              // Don't precache sourcemaps and license files
              dontCacheBustURLsMatching: /\.\\w{8}\./,
              maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            },
            kit: {
              // Include kit's version.json in service worker precache manifest
              includeVersionFile: true,
            },
          }),
        ]
      : []),
  ],
  // Add server configuration to fix constant refreshing
  server: {
    watch: {
      usePolling: false,
      ignored: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
    },
    hmr: {
      overlay: true,
    },
  },
  define: {
    // Make environment variables available to client code
    // both prefixed and non-prefixed versions
    "import.meta.env.VITE_OPENAI_API_KEY": JSON.stringify(
      process.env.VITE_OPENAI_API_KEY,
    ),
    "import.meta.env.OPENAI_API_KEY": JSON.stringify(
      process.env.OPENAI_API_KEY,
    ),
  },
});
