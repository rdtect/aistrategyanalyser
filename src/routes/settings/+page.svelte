<script lang="ts">
  import APIHealthCheck from '$lib/components/APIHealthCheck.svelte';
  import { chatStore } from '$lib/components/chat/Chat.svelte.ts';
  import { AI_MODELS } from '$lib/config/aiModels';
</script>

<div class="container mx-auto p-6">
  <h1 class="text-2xl font-bold mb-6">Settings</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <!-- API Connection Section -->
    <div>
      <h2 class="text-xl font-semibold mb-4">API Connection</h2>
      <APIHealthCheck />
    </div>

    <!-- Model Settings Section -->
    <div class="card p-4 variant-glass-surface">
      <h2 class="text-xl font-semibold mb-4">AI Model Settings</h2>
      
      <div class="form-group mb-4">
        <label for="model" class="mb-2 block">Default Model</label>
        <select 
          id="model" 
          class="select" 
          bind:value={chatStore.settings.model}
        >
          {#each Object.keys(AI_MODELS) as modelKey}
            <option value={modelKey}>{AI_MODELS[modelKey].name}</option>
          {/each}
        </select>
        <small class="text-xs opacity-70">Select the default AI model for new chats</small>
      </div>

      <div class="form-group">
        <label class="flex items-center gap-2">
          <input 
            type="checkbox" 
            class="checkbox" 
            bind:checked={chatStore.settings.webSearch}
          />
          <span>Enable Web Search</span>
        </label>
        <small class="text-xs opacity-70 block mt-1">Allow the AI to search the web for more up-to-date information</small>
      </div>

      {#if chatStore.settings.webSearch}
        <div class="form-group mt-4">
          <label for="webSearchSize" class="mb-2 block">Web Search Context Size</label>
          <select 
            id="webSearchSize" 
            class="select" 
            bind:value={chatStore.settings.webSearchContextSize}
          >
            <option value="small">Small (faster)</option>
            <option value="medium">Medium (balanced)</option>
            <option value="large">Large (more comprehensive)</option>
          </select>
        </div>
      {/if}
    </div>
  </div>
</div> 