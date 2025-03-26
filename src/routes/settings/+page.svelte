<script lang="ts">
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { onMount } from 'svelte';
  
  // State for settings
  let apiKey = $state('');
  let model = $state('gpt-4-turbo-preview');
  let temperature = $state(0.7);
  let maxTokens = $state(4000);
  let isSaving = $state(false);
  let showApiKey = $state(false);
  
  // Load settings on mount
  onMount(() => {
    if (browser) {
      const savedSettings = localStorage.getItem('openai_settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        apiKey = settings.apiKey || '';
        model = settings.model || 'gpt-4-turbo-preview';
        temperature = settings.temperature || 0.7;
        maxTokens = settings.maxTokens || 4000;
      }
    }
  });
  
  // Save settings
  async function saveSettings(e: Event) {
    e.preventDefault();
    if (!browser) return;
    
    isSaving = true;
    try {
      const settings = {
        apiKey,
        model,
        temperature,
        maxTokens
      };
      localStorage.setItem('openai_settings', JSON.stringify(settings));
      
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg';
      toast.textContent = 'Settings saved successfully';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      
      // Show error message
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg';
      toast.textContent = 'Failed to save settings';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      
    } finally {
      isSaving = false;
    }
  }
  
  // Go back to home
  function goBack() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Settings - AI Strategy Analyzer</title>
</svelte:head>

<div class="container mx-auto p-6">
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold">Settings</h1>
      <button
        onclick={goBack}
        class="text-surface-300 hover:text-surface-100 transition-colors"
        title="Go back"
        aria-label="Go back to home page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Settings form -->
    <form onsubmit={saveSettings} class="space-y-6">
      <!-- API Key -->
      <div>
        <label class="block text-sm font-medium mb-2" for="apiKey">
          OpenAI API Key
        </label>
        <div class="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            id="apiKey"
            bind:value={apiKey}
            class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="sk-..."
          />
          <button
            type="button"
            onclick={() => showApiKey = !showApiKey}
            class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-300"
            aria-label={showApiKey ? "Hide API key" : "Show API key"}
          >
            {#if showApiKey}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            {/if}
          </button>
        </div>
        <p class="mt-1 text-sm text-surface-400">
          Your API key will be stored locally and never sent to our servers.
        </p>
      </div>
      
      <!-- Model -->
      <div>
        <label class="block text-sm font-medium mb-2" for="model">
          Model
        </label>
        <select
          id="model"
          bind:value={model}
          class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
      </div>
      
      <!-- Temperature -->
      <div>
        <label class="block text-sm font-medium mb-2" for="temperature">
          Temperature: {temperature}
        </label>
        <input
          type="range"
          id="temperature"
          bind:value={temperature}
          min="0"
          max="2"
          step="0.1"
          class="w-full"
        />
        <div class="flex justify-between text-xs text-surface-400 mt-1">
          <span>More Focused</span>
          <span>More Creative</span>
        </div>
      </div>
      
      <!-- Max Tokens -->
      <div>
        <label class="block text-sm font-medium mb-2" for="maxTokens">
          Max Tokens: {maxTokens}
        </label>
        <input
          type="range"
          id="maxTokens"
          bind:value={maxTokens}
          min="1000"
          max="8000"
          step="1000"
          class="w-full"
        />
        <div class="flex justify-between text-xs text-surface-400 mt-1">
          <span>Shorter</span>
          <span>Longer</span>
        </div>
      </div>
      
      <!-- Save button -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving}
        >
          {#if isSaving}
            <span class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Saving...
            </span>
          {:else}
            Save Settings
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>