<!-- APIHealthCheck.svelte - Shows the API connection status -->
<script lang="ts">
  import { getChatStore } from "$lib/features/chat/stores";
  import { formatLastChecked } from "$lib/core/utils/dateUtils";
  import type { HealthStatus } from "$lib/types/chat";

  // Initialize chat store
  const chatStore = getChatStore();
  const status = $derived.by(() => chatStore.getStatus()) as HealthStatus;
  const lastCheckedDate = $derived.by(() => new Date(status.lastChecked));
</script>

<div class="flex items-center space-x-2">
  <div class="w-2 h-2 rounded-full {status.isActive ? 'bg-green-500' : 'bg-red-500'}"></div>
  <span class="text-sm">{status.isActive ? 'API Connected' : 'API Offline'}</span>
</div>

<div class="dropdown">
  <div class="dropdown-trigger">
    <button class="btn btn-sm">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 rounded-full {status.isActive ? 'bg-green-500' : 'bg-red-500'}"></div>
        <span>{status.isActive ? 'Connected' : 'Disconnected'}</span>
      </div>
    </button>
  </div>
  <div class="dropdown-content">
    {#if status.openai}
      <div class="p-4">
        <p>Model: {status.openai.model || 'Unknown'}</p>
        {#if status.openai.error}
          <p class="text-red-400 mt-1">Error: {status.openai.error}</p>
        {/if}
      </div>
    {/if}
    <div class="p-4 border-t">
      <p class="text-sm text-surface-400">
        Last checked: {formatLastChecked(lastCheckedDate)}
      </p>
    </div>
  </div>
</div>