<!--
  Chats Listing Page
  
  This page displays a grid of all chats and allows creating new ones.
  Optimized for Svelte 5.
-->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  // Redirect to new chat page
  function createNewAnalysis() {
    goto('/chats/new');
  }
</script>

<div class="flex items-center justify-center h-full p-8">
  <div class="max-w-lg w-full text-center">
    <h1 class="text-2xl font-bold mb-4">AI Strategy Analyzer</h1>
    
    <div class="p-8 rounded-lg bg-surface-100-800-token/50 border border-surface-500/20">
      <p class="mb-4 text-lg">Create a new analysis to get started</p>
      
      <button
        onclick={createNewAnalysis}
        class="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg flex items-center gap-2 mx-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Analysis
      </button>
    </div>
  </div>
</div>
