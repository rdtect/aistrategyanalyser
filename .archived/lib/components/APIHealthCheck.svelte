<script lang="ts">
  import { browser } from '$app/environment';
  import { createHealthCheck } from './chat/healthCheck.svelte.ts';

  // Props
  let { compact = false } = $props<{
    compact?: boolean;
  }>();

  // Initialize health check service
  const healthService = createHealthCheck();
  
  // Refresh health check
  function refreshStatus() {
    if (browser) {
      healthService.checkHealth();
    }
  }
</script>

{#if compact}
  <div class="indicator">
    <span class="indicator-item badge p-2 {healthService.status.openai?.connected ? 'bg-green-500' : 'bg-red-500'}"></span>
    <button 
      class="btn btn-sm variant-soft"
      onclick={refreshStatus}
      title="API Connection Status"
    >
      API Status
    </button>
  </div>
{:else}
  <div class="card variant-glass-surface p-4">
    <h3 class="h3 mb-4">API Connection Status</h3>
    
    {#if healthService.isChecking}
      <div class="flex justify-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    {:else if healthService.status.error}
      <div class="alert variant-filled-error">
        <span>Error checking API status: {healthService.status.error}</span>
      </div>
    {:else}
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span>OpenAI:</span>
          {#if healthService.status.openai?.connected}
            <span class="badge variant-filled-success">Connected</span>
          {:else}
            <span class="badge variant-filled-error">Disconnected</span>
          {/if}
        </div>
        
        {#if healthService.status.openai?.model}
          <div>
            <span class="text-sm opacity-75">Model: {healthService.status.openai.model}</span>
          </div>
        {/if}
        
        {#if healthService.status.openai?.error}
          <div class="alert variant-ghost-error">
            <span>{healthService.status.openai.error}</span>
          </div>
        {/if}
        
        <div class="text-xs opacity-50">
          Last checked: {new Date(healthService.status.lastChecked).toLocaleTimeString()}
        </div>
      </div>
      
      <div class="mt-4">
        <button class="btn btn-sm variant-filled" onclick={refreshStatus}>
          Refresh Status
        </button>
      </div>
    {/if}
  </div>
{/if}
