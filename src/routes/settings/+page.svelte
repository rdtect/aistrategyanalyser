<script lang="ts">
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import IconX from '@lucide/svelte/icons/x';
  import IconEye from '@lucide/svelte/icons/eye';
  import IconEyeOff from '@lucide/svelte/icons/eye-off';
  import { appSettings, resetOpenAISettings } from '$lib/stores/config.svelte.ts';
  import { getContext } from 'svelte';
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte';
  
  // Define ToastSettings locally as it might not be exported directly
  interface ToastSettings {
    message: string;
    title?: string;
    type?: 'info' | 'success' | 'error'; // Corrected types based on error
    background?: string; // For custom classes
    autohide?: boolean;
    timeout?: number;
    // Add other possible fields from Skeleton docs if needed
  }
  
  // State for settings
  let showApiKey = $state(false);
  
  // Get toast context
  const toast: ToastContext | undefined = browser ? getContext('toast') : undefined;
  
  // Helper to trigger toasts safely (handles case where context might not be ready)
  function triggerToast(settings: ToastSettings) {
    if (toast) {
      toast.create(settings);
    } else if (browser) {
      // Fallback if context wasn't found (shouldn't happen with Provider in layout)
      console.warn('Toast context not found, using alert fallback.');
      alert(settings.message);
    }
  }
  
  // Go back to home
  function goBack() {
    goto('/chats');
  }

  // Function to manually save settings
  function saveSettings() {
    if (!browser) return;
    try {
      // Get the current state from the store
      const settingsToSave = JSON.stringify(appSettings);
      localStorage.setItem('app_settings', settingsToSave);
      triggerToast({ 
        message: 'Settings saved successfully.', 
        background: 'variant-filled-success',
        autohide: true,
        timeout: 1500
      });
      
      // Navigate back after a short delay
      setTimeout(() => {
        goto('/chats');
      }, 1600);
    } catch (error) {
      console.error("Failed to save settings:", error);
      triggerToast({ 
        message: `Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        background: 'variant-filled-error',
        autohide: true, 
        timeout: 5000 
      });
    }
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
        <IconX class="h-6 w-6" />
      </button>
    </div>
    
    <!-- Settings form -->
    <form class="space-y-6">
      <!-- API Key -->
      <div>
        <label class="block text-sm font-medium mb-2" for="apiKey">
          OpenAI API Key
        </label>
        <div class="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            id="apiKey"
            bind:value={appSettings.openai.apiKey}
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
              <IconEyeOff class="h-5 w-5" />
            {:else}
              <IconEye class="h-5 w-5" />
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
          bind:value={appSettings.openai.model}
          class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
      </div>
      
      <!-- Temperature -->
      <div>
        <label class="block text-sm font-medium mb-2" for="temperature">
          Temperature: {appSettings.openai.temperature}
        </label>
        <input
          type="range"
          id="temperature"
          bind:value={appSettings.openai.temperature}
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
          Max Tokens: {appSettings.openai.maxTokens}
        </label>
        <input
          type="range"
          id="maxTokens"
          bind:value={appSettings.openai.maxTokens}
          min="1000"
          max="8192"
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
          type="button"
          onclick={saveSettings}
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Settings
        </button>
      </div>
    </form>
  </div>
</div>