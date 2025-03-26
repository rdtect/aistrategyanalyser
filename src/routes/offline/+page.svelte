<script>
  import { browser } from '$app/environment';
  import { goto } from "$app/navigation";
  
  // Check online status
  let isOnline = $state(true);
  
  $effect(() => {
    if (browser) {
      const updateOnlineStatus = () => {
        isOnline = navigator.onLine;
      };
      
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      
      updateOnlineStatus();
      
      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
      };
    }
  });
</script>

<svelte:head>
  <title>Offline - AI Strategy Analyzer</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center p-6 text-center">
  <div class="card p-8 max-w-md variant-ghost-tertiary">
    <header class="pb-4">
      <div class="w-16 h-16 mx-auto mb-4 text-tertiary-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.55 19.09L12 4.67l8.45 14.42M12 15.73v-3.67"></path>
        </svg>
      </div>
      <h2 class="h2 mb-2">You're Offline</h2>
    </header>
    
    <section class="space-y-4">
      <p>It looks like you're currently offline. Some features may be limited.</p>
      
      <div class="p-4 border border-surface-500/20 bg-surface-500/5 rounded-lg">
        <h3 class="font-semibold mb-2">Good news!</h3>
        <p class="text-sm">
          You can still access your previously loaded chats and use basic features
          while offline.
        </p>
      </div>
    </section>
    
    <footer class="pt-4 flex flex-col space-y-3">
      <button onclick={() => goto('/chats')} class="btn variant-filled-primary">
        Go to My Chats
      </button>
      
      <button onclick={() => window.location.reload()} class="btn variant-soft">
        Try to Reconnect
      </button>
    </footer>
  </div>
</div> 