import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},

	preprocess: [
		vitePreprocess({
			inspector: {
				// Default toggle combination is 'control-shift' on windows/linux and 'meta-shift' on macOS
				toggleKeyCombo: 'meta-shift',
				// Hold and release key to toggle inspector
				holdMode: true,
				// Show details of components when hovering
				showToggleButton: 'always',
				// Position of toggle button
				toggleButtonPos: 'bottom-right'
			}
		}),
		mdsvex()
	],
	extensions: ['.svelte', '.svx']
};

export default config;
