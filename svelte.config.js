import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
  },
  vitePlugin: { 
	inspector: {
		toggleKeyCombo :'meta-x'
	} },

  preprocess: [vitePreprocess(), mdsvex()],
  extensions: [".svelte", ".svx"],
};

export default config;
