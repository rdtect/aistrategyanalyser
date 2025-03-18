import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
// import {inspector} from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    sveltekit(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "service-worker.js",
      manifest: false, // We're using our own manifest file
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webp}"],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
});
