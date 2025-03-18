<script lang="ts">
  import '../app.css';
  import { browser } from '$app/environment';
  import { theme } from '$lib/stores/theme.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { registerServiceWorker } from '$lib/utils/registerSW';
  
  let { children } = $props();
  
  // Update theme attribute on mount and changes
  $effect(() => {
    if (!browser) return;
    
    // Get the current theme value
    const currentTheme = typeof theme === 'function' ? theme() : theme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Register service worker for PWA support
    registerServiceWorker();
  });
</script>

<div class="flex flex-col min-h-screen h-screen">
  <header class="border-b border-surface-200-700 dark:border-surface-500 px-4 py-2 flex items-center justify-between shrink-0">
    <div class="flex items-center gap-2 m-2">
      <a href="/" class="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" class="w-8 h-8" />
        <span class="text-xl font-bold">AI Strategy Analyzer</span>
      </a>
    </div>
    <nav class="hidden sm:flex items-center gap-4">
      <a href="/" class="hover:underline">Home</a>
      <a href="/chats/new" class="hover:underline">New Analysis</a>
      <a href="/settings" class="hover:underline">Settings</a>
      <ThemeToggle />
    </nav>
  </header>
  
  <main class="flex-1 container mx-auto my-4 bg-surface-500/20 rounded-xl overflow-hidden flex flex-col">
    {@render children()}
  </main>
  
  <footer class="border-t border-surface-200-700 dark:border-surface-500 p-2 text-center text-sm shrink-0">
    <p>© {new Date().getFullYear()} AI Strategy Analyzer</p>
  </footer>
</div>
