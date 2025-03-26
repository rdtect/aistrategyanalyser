<!-- Main application layout -->
<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { initializeStoragePersistence } from '$lib/services/StorageManager';
  
  // Props
  let { children } = $props();
  
  // Reactive state with Svelte 5 runes
  let isDark = $state(true);
  
  // Set up dark mode on initial load - this is now just backup in case AppBar is not used
  $effect(() => {
    if (browser) {
      // Check for dark mode preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
        document.documentElement.classList.add('dark');
        isDark = true;
      } else {
        document.documentElement.classList.remove('dark');
        isDark = false;
      }
    }
  });

  // Initialize storage persistence on mount
  onMount(async () => {
    if (browser) {
      // Register service worker (handled by SvelteKit for production builds)
      if ('serviceWorker' in navigator) {
        // Check if we're in development mode
        const isDev = import.meta.env.DEV;
        
        // Only log service worker status in development
        if (isDev) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            console.log(`Service workers registered: ${registrations.length}`);
          });
        }
      }
      
      // Request persistent storage
      const persistResult = await initializeStoragePersistence();
      console.log(`Storage persistence ${persistResult ? 'granted' : 'denied'}`);
      
      // Listen for online/offline events
      window.addEventListener('online', () => {
        console.log('App is online');
        document.documentElement.classList.remove('app-offline');
      });
      
      window.addEventListener('offline', () => {
        console.log('App is offline');
        document.documentElement.classList.add('app-offline');
      });
      
      // Set initial online status
      if (!navigator.onLine) {
        document.documentElement.classList.add('app-offline');
      }
    }
  });
</script>

<svelte:head>
  <title>AI Strategy Analyzer</title>
  <meta name="description" content="Analyze business strategies with AI assistance" />
</svelte:head>

<div class="h-screen w-screen flex flex-col bg-surface-100-800-token overflow-hidden">
  <!-- Main content -->
  <main class="flex-1 overflow-hidden">
    <div class="h-full">
      {@render children()}
    </div>
  </main>
  
  <!-- Elements that appear online-only -->
  <div class="app-online-only hidden">
    <!-- This element will be disabled when offline -->
    <button class="bg-primary-500 text-white p-2 rounded">Online Only Action</button>
  </div>
</div>

<!-- Add offline indicator if needed -->
{#if browser}
  <div class="offline-indicator" class:hidden={navigator.onLine}>
    <div class="p-2 bg-warning-500 text-warning-900 text-sm text-center">
      You are currently offline. Some features may be limited.
    </div>
  </div>
{/if}

<style>  
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .offline-indicator {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    transition: transform 0.3s ease;
  }
  
  .hidden {
    transform: translateY(100%);
  }
  
  /* Add CSS for offline mode visuals */
  :global(.app-offline) .app-online-only {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
