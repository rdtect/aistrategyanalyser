<script lang="ts">
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import IconX from '@lucide/svelte/icons/x';
  import IconEye from '@lucide/svelte/icons/eye';
  import IconEyeOff from '@lucide/svelte/icons/eye-off';
  import IconRotateCcw from '@lucide/svelte/icons/rotate-ccw';
  import { toaster } from '$lib/components/toaster-svelte';
  import { chatManager } from '../chats/(lib)/ChatManager.svelte.ts';
  import { idbService } from '$lib/services/IDBService';
  import { onMount } from "svelte";

  // Settings state
  let showApiKey = $state(false);
  let globalSystemPrompt = $state("");
  let openaiApiKey = $state("");

  // Load persisted settings on mount
  onMount(() => {
    // Coalesce null to empty string to satisfy string type
    globalSystemPrompt = chatManager.systemPrompt ?? "";
    idbService?.getSetting('openaiApiKey').then(v => { if (v) openaiApiKey = v; });
  });


  async function saveSettings() {
    if (!browser) return;
    try {
      chatManager.systemPrompt = globalSystemPrompt;
      await idbService?.setSetting?.('systemPrompt', globalSystemPrompt);
      await idbService?.setSetting?.('openaiApiKey', openaiApiKey);
      toaster.success({ description: 'Settings saved successfully.', duration: 1500 });
      setTimeout(() => { goto('/chats'); }, 1600);
    } catch (error) {
      console.error("Failed to save settings:", error);
      toaster.error({ description: `Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`, duration: 5000 });
    }
  }

  function goBack() { goto('/chats'); }
</script>

<svelte:head>
  <title>Settings - AI Strategy Analyzer</title>
</svelte:head>

<div class="container mx-auto p-6">
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold">Settings</h1>
      <button onclick={goBack} class="text-surface-300 hover:text-surface-100 transition-colors" title="Go back" aria-label="Go back to home page">
        <IconX class="h-6 w-6" />
      </button>
    </div>
    <form class="space-y-6">
      <!-- OpenAI API Key -->
      <div>
        <label class="block text-sm font-medium mb-2" for="apiKey">OpenAI API Key</label>
        <div class="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            id="apiKey"
            bind:value={openaiApiKey}
            class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder:text-surface-400"
            placeholder="sk-..."
          />
          <button type="button" onclick={() => showApiKey = !showApiKey} class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-300" aria-label={showApiKey ? "Hide API key" : "Show API key"}>
            {#if showApiKey}
              <IconEyeOff class="h-5 w-5" />
            {:else}
              <IconEye class="h-5 w-5" />
            {/if}
          </button>
        </div>
        <p class="mt-1 text-sm text-surface-400">Your API key will be stored locally and never sent to our servers.</p>
      </div>
      <!-- System Prompt -->
      <div>
        <label class="block text-sm font-medium mb-2" for="systemPromptSettings">System Prompt (Global)</label>
        <textarea
          id="systemPromptSettings"
          class="w-full rounded p-2 text-xs bg-surface-800 text-white border border-surface-700 mt-1 focus:bg-surface-900 focus:text-primary-100 placeholder:text-surface-400"
          rows="6"
          bind:value={globalSystemPrompt}
          placeholder="Set the default system prompt for all new chats and analyses."
        ></textarea>
        <p class="mt-1 text-xs text-surface-400">This prompt will be used as the default for all new chats and analyses.</p>
      </div>
      <div class="flex justify-end">
        <button type="button" onclick={saveSettings} class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save Settings</button>
      </div>
    </form>
  </div>
</div>