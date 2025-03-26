<script lang="ts">
  import { ErrorType } from '$lib/core/utils/errorHandling';
  
  let { 
    error = null,
    resetButtonText = 'Try Again',
    showDetails = false,
    onReset = () => window.location.reload(),
  } = $props<{
    error: Error | null | { type?: ErrorType; message: string; details?: unknown; friendlyMessage?: string };
    resetButtonText?: string;
    showDetails?: boolean;
    onReset?: () => void;
  }>();
  
  // Determine error message
  const friendlyMessage = $derived.by(() => {
    if (!error) return null;
    
    if (typeof error === 'object' && 'friendlyMessage' in error && error.friendlyMessage) {
      return error.friendlyMessage;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'object' && 'message' in error) {
      return error.message;
    }
    
    return 'An unknown error occurred';
  });
  
  // Determine error type - using $state for reactivity
  let errorType = $state<ErrorType | null>(null);
  $effect(() => {
    if (!error) {
      errorType = null;
      return;
    }
    
    if (typeof error === 'object' && 'type' in error && error.type) {
      errorType = error.type;
    } else {
      errorType = ErrorType.UNKNOWN;
    }
  });
  
  // Get technical details for developers
  const technicalDetails = $derived.by(() => {
    if (!error) return null;
    
    if (error instanceof Error) {
      return error.stack;
    }
    
    if (typeof error === 'object' && 'details' in error) {
      return JSON.stringify(error.details, null, 2);
    }
    
    return JSON.stringify(error, null, 2);
  });
</script>

{#if error}
  <div class="error-boundary p-4 rounded-lg bg-error-100 border border-error-300 text-error-700 dark:bg-error-900 dark:text-error-100 dark:border-error-700">
    <h2 class="text-lg font-bold mb-2">
      {#if errorType === ErrorType.NETWORK}
        Connection Error
      {:else if errorType === ErrorType.AUTHENTICATION}
        Authentication Error
      {:else if errorType === ErrorType.VALIDATION}
        Validation Error
      {:else}
        Error
      {/if}
    </h2>
    
    <p class="mb-4">{friendlyMessage}</p>
    
    <div class="flex gap-2">
      <button
        class="px-4 py-2 bg-error-200 hover:bg-error-300 rounded-md dark:bg-error-800 dark:hover:bg-error-700 transition-colors"
        onclick={onReset}
      >
        {resetButtonText}
      </button>
      
      {#if showDetails && technicalDetails}
        <button
          class="px-4 py-2 bg-surface-300 hover:bg-surface-400 rounded-md dark:bg-surface-700 dark:hover:bg-surface-600 transition-colors"
          onclick={() => alert(technicalDetails)}
        >
          Show Details
        </button>
      {/if}
    </div>
  </div>
{/if} 