import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

// Determine if we're in production
const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],

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
