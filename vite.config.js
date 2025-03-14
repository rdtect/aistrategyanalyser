import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// import {inspector} from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()]
});
