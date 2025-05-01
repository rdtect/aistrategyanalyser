import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-cloudflare";
import { svelte } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // See below for an explanation of these options
      routes: {
        include: ["/*"],
        exclude: ["<all>"],
      },
   
    }),
    serviceWorker: {
      register: false,
    },
  },
  vitePlugin: {
    inspector: {
      toggleKeyCombo: "meta-x",
    },
  },

  preprocess: [mdsvex(), svelte()],
  extensions: [".svelte", ".svx"],
};

export default config;
