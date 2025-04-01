<!-- Main application layout -->
<script lang="ts">
  import '../app.css';
  // import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { initializeStoragePersistence } from '$lib/services/StorageManager';
  import IconWifiOff from '@lucide/svelte/icons/wifi-off'; // Import icon
  import { ToastProvider } from '@skeletonlabs/skeleton-svelte'; // Import ToastProvider
  
  // Props
  let { children } = $props();
  
  // Reactive state with Svelte 5 runes
  let isOnline = $state(true);
  
  // Initialize storage persistence and online status
  onMount(() => {
    if (!browser) return;

    // Register service worker (handled by SvelteKit for production builds)
    if ('serviceWorker' in navigator) {
      // Check if we're in development mode
      const isDev = import.meta.env.DEV;
      if (isDev) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          console.log(`Service workers registered: ${registrations.length}`);
        });
      }

      // In production, add event listeners for updates etc.
      else {
        // Listen for service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service worker updated and controlling the page');
        });

        // Check for service worker updates periodically if desired
        setInterval(() => {
          navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) registration.update();
          });
        }, 60 * 60 * 1000); // Check once per hour
      }
    }
    
    // Request persistent storage
    initializeStoragePersistence().then(persistResult => {
      console.log(`Storage persistence ${persistResult ? 'granted' : 'denied'}`);
    });
    
    // Update online status
    const updateOnlineStatus = () => {
      isOnline = navigator.onLine;
      if (isOnline) {
        document.documentElement.classList.remove('app-offline');
      } else {
        document.documentElement.classList.add('app-offline');
      }
    };
    
    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Set initial online status
    updateOnlineStatus();
    
    // Return cleanup function
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
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
      <!-- Wrap content with ToastProvider -->
      <ToastProvider>
        {@render children()}
      </ToastProvider>
    </div>
  </main>
  
  <!-- Online-only elements placeholder (if needed later) -->
  <!-- 
  <div class="app-online-only hidden">
     ... online-only content ...
  </div>
  -->

  <!-- Enhanced offline indicator -->
  {#if browser}
    <div class="offline-indicator" class:hidden={isOnline}>
      <div class="p-4 bg-surface-100-800-token border-t border-surface-500/20">
        <div class="max-w-2xl mx-auto">
          <div class="flex items-center gap-3">
            <div class="text-warning-500">
              <IconWifiOff class="h-5 w-5" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium">You're offline. Some features may be limited, but you can still:</p>
              <p class="text-sm text-surface-600-300-token mt-1">• Access your previously loaded chats</p>
              <p class="text-sm text-surface-600-300-token">• Use basic features and view cached content</p>
            </div>
            <button onclick={() => window.location.reload()} class="btn btn-sm variant-soft">
              Try to Reconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

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
  
</style>
