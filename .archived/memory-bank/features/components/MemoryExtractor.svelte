<script lang="ts">
  import { memoryStore } from '../stores/MemoryStore.svelte';
  import { memoryExtractionService } from '../services/MemoryExtractionService';
  import type { Chat } from '$lib/types/chat';
  
  // Props
  let { chat, onComplete } = $props<{ 
    chat: Chat;
    onComplete?: (memoryIds: string[]) => void;
  }>();
  
  // Local state
  let isExtracting = $state(false);
  let extractedCount = $state(0);
  let error = $state<string | null>(null);
  
  // Extract memories from the chat
  async function extractMemories() {
    if (!chat) return;
    
    try {
      isExtracting = true;
      error = null;
      
      // Extract memories using the extraction service
      const extractedMemories = await memoryExtractionService.extractFromChat(chat);
      
      if (extractedMemories.length === 0) {
        error = "No memories could be extracted from this chat.";
        isExtracting = false;
        return;
      }
      
      // Get a reference to the storage manager from the store instance
      // Save the extracted memories using the public API
      for (const memory of extractedMemories) {
        await memoryStore.createMemory(
          memory.content,
          memory.category,
          memory.source,
          memory.tags
        );
      }
      
      // Update the count
      extractedCount = extractedMemories.length;
      
      // Call the completion callback if provided
      if (onComplete) {
        onComplete(extractedMemories.map(m => m.id));
      }
    } catch (err) {
      console.error('Error extracting memories:', err);
      error = "Failed to extract memories. Please try again.";
    } finally {
      isExtracting = false;
    }
  }
  
  // Extract a single message as a memory
  async function extractMessage(message: any) {
    if (!chat || !message) return;
    
    try {
      isExtracting = true;
      error = null;
      
      // Create a memory from the message
      const memoryId = await memoryStore.createMemory(
        message.content,
        'insight', // Default category
        'chat',
        ['manual-extract']
      );
      
      // Update the count
      extractedCount = 1;
      
      // Call the completion callback if provided
      if (onComplete) {
        onComplete([memoryId]);
      }
    } catch (err) {
      console.error('Error extracting message as memory:', err);
      error = "Failed to extract message. Please try again.";
    } finally {
      isExtracting = false;
    }
  }
  
  // Clear the extraction state
  function reset() {
    extractedCount = 0;
    error = null;
  }
</script>

<div class="memory-extractor">
  {#if isExtracting}
    <div class="flex items-center gap-2">
      <div class="loading loading-spinner loading-sm"></div>
      <span>Extracting memories...</span>
    </div>
  {:else if extractedCount > 0}
    <div class="alert alert-success">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Successfully extracted {extractedCount} {extractedCount === 1 ? 'memory' : 'memories'}</span>
      <button class="btn btn-sm" onclick={reset}>Dismiss</button>
    </div>
  {:else if error}
    <div class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
      <button class="btn btn-sm" onclick={() => error = null}>Dismiss</button>
    </div>
  {:else}
    <div class="flex gap-2">
      <button 
        class="btn btn-sm btn-primary" 
        onclick={extractMemories}
        disabled={!chat || chat.messages.length === 0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Extract Memories
      </button>
      <div class="dropdown dropdown-end">
        <button class="btn btn-sm btn-ghost" aria-label="Additional memory extraction options">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li><button onclick={extractMemories}>Extract All</button></li>
          <li>
            <button onclick={() => {
              if (chat && chat.messages.length > 0) {
                extractMessage(chat.messages[chat.messages.length - 1]);
              }
            }}>
              Extract Last Message
            </button>
          </li>
        </ul>
      </div>
    </div>
  {/if}
</div>

<style>
  .memory-extractor {
    margin-bottom: 1rem;
  }
</style>