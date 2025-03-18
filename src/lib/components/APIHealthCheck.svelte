<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import type { HealthStatus } from './chat/healthCheck';

  // State variables
  let status = $state<HealthStatus | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // Function to check API health
  async function checkApiHealth() {
    if (!browser) return;
    
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }
      
      status = await response.json();
      loading = false;
    } catch (err) {
      console.error('API health check error:', err);
      error = err instanceof Error ? err.message : 'Unknown error occurred';
      loading = false;
    }
  }

  // Check API health on component mount
  onMount(() => {
    checkApiHealth();
  });
</script>

<div class="card variant-glass-surface p-4">
  <h3 class="h3 mb-4">API Connection Status</h3>
  
  {#if loading}
    <div class="flex justify-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  {:else if error}
    <div class="alert variant-filled-error">
      <span>Error checking API status: {error}</span>
    </div>
  {:else if status}
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span>OpenAI:</span>
        {#if status.openai?.connected}
          <span class="badge variant-filled-success">Connected</span>
        {:else}
          <span class="badge variant-filled-error">Disconnected</span>
        {/if}
      </div>
      
      {#if status.openai?.model}
        <div>
          <span class="text-sm opacity-75">Model: {status.openai.model}</span>
        </div>
      {/if}
      
      {#if status.openai?.error}
        <div class="alert variant-ghost-error">
          <span>{status.openai.error}</span>
        </div>
      {/if}
      
      <div class="text-xs opacity-50">
        Last checked: {new Date(status.lastChecked).toLocaleTimeString()}
      </div>
    </div>
    
    <div class="mt-4">
      <button class="btn btn-sm variant-filled" onclick={checkApiHealth}>
        Refresh Status
      </button>
    </div>
  {/if}
</div> 