<script lang="ts">
  import { dev } from '$app/environment';
  
  let { 
    error = null,
    status = 500,
    message = ''
  } = $props<{
    error?: Error | null;
    status?: number;
    message?: string;
  }>();
  
  // Computed message using $derived
  const errorMessage = $derived(message || error?.message || 'An unexpected error occurred');
  
  function reload() {
    window.location.reload();
  }
</script>

<div class="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
  <h1 class="text-4xl font-bold mb-4">Error {status}</h1>
  <p class="mb-4 text-lg">{errorMessage}</p>
  
  {#if dev && error?.stack}
    <pre class="mt-4 p-4 bg-gray-100 rounded overflow-x-auto max-w-full">
      {error.stack}
    </pre>
  {/if}
  
  <div class="flex gap-4 mt-8">
    <button 
      onclick={() => history.back()}
      class="btn variant-filled-primary"
    >
      Go Back
    </button>
    <button 
      onclick={reload}
      class="btn variant-filled-secondary"
    >
      Reload Page
    </button>
  </div>
</div>
