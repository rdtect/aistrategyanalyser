<!--
  Chat List Component
  
  Displays a list of chats and allows selection.
-->
<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import chatListStore, { 
    type ChatHeader 
  } from '../stores/chatListStore.svelte.ts';
  import * as storageService from '../services/storageService';
  import { chatService } from '../services/chatService';
  
  // Create event dispatcher
  const dispatch = createEventDispatcher();
  
  // Props
  let { onChatSelect } = $props<{
    onChatSelect?: (id: string) => Promise<boolean>;
  }>();
  
  // Local state
  let sortedHeaders: ChatHeader[] = $state([]);
  let selectedChatId = $state<string | null>(null);
  let confirmDeleteId = $state<string | null>(null);
  let isCreatingChat = $state(false);
  let isLoading = $state(false);
  
  // Helper function to get headers from the store
  function getHeadersFromStore() {
    // Access the headers using the sortedHeaders function from the store
    return chatListStore.sortedHeaders();
  }
  
  // Load chats on mount
  onMount(async () => {
    isLoading = true;
    await chatListStore.loadChatHeaders();
    sortedHeaders = getHeadersFromStore();
    isLoading = false;
  });
  
  // Update local sortedHeaders whenever the store changes
  $effect(() => {
    sortedHeaders = getHeadersFromStore();
  });
  
  // Update local isLoading whenever the store changes
  $effect(() => {
    isLoading = chatListStore.isLoading;
  });
  
  // Handle chat selection with proper loading
  async function handleChatSelect(id: string) {
    try {
      // Set selected chat ID right away for UI feedback
      selectedChatId = id;
      
      // Load the chat data in the background
      storageService.getChat(id).catch(error => {
        console.error("Error loading chat data:", error);
      });
      
      // Emit a selection event that parent components can listen to
      dispatch('selectChat', { id });
      
      // Call the passed onChatSelect if provided (this handles navigation)
      if (onChatSelect) {
        await onChatSelect(id);
      }
    } catch (error) {
      console.error("Error selecting chat:", error);
    }
  }
  
  // Create a new chat
  async function handleCreateChat() {
    try {
      isCreatingChat = true;
      const newChat = await chatService.createChat({
        name: "New Analysis"
      });
      
      // Select the new chat
      handleChatSelect(newChat.id);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      isCreatingChat = false;
    }
  }
  
  // Handle chat deletion
  async function handleDeleteChat(id: string) {
    try {
      await chatService.deleteChat(id);
      confirmDeleteId = null;
      await chatListStore.loadChatHeaders(); // Refresh the list
      sortedHeaders = getHeadersFromStore();
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  }
  
  // Cancel chat deletion
  function cancelDeleteChat() {
    confirmDeleteId = null;
  }
</script>

<div class="chat-list">
  <div class="header">
    <h2>Your Analyses</h2>
    <button 
      class="create-button"
      onclick={handleCreateChat}
      disabled={isCreatingChat}
      aria-label="Create a new analysis"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      New Analysis
    </button>
  </div>
  
  {#if isLoading}
    <div class="loading-container flex justify-center items-center">
      <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-2">Loading conversations...</span>
    </div>
  {:else if sortedHeaders.length === 0}
    <div class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <p>No analyses yet</p>
      <button 
        onclick={handleCreateChat}
        class="create-button"
      >
        Create Your First Analysis
      </button>
    </div>
  {:else}
    <ul class="chat-list-items">
      {#each sortedHeaders as chat (chat.id)}
        <li class="chat-item {selectedChatId === chat.id ? 'active' : ''}">
          <button 
            class="chat-item-content"
            onclick={() => handleChatSelect(chat.id)}
            onkeydown={(e) => e.key === 'Enter' && handleChatSelect(chat.id)}
            aria-label={`Select chat: ${chat.name || 'Untitled conversation'}`}
          >
            <h3 class="chat-title">{chat.name || 'Untitled conversation'}</h3>
            <p class="chat-meta">
              {#if chat.context?.company}
                <span class="company">{chat.context.company}</span>
              {/if}
              <span class="date">{new Date(chat.updatedAt).toLocaleString()}</span>
            </p>
          </button>
            
          <div class="chat-actions">
            {#if confirmDeleteId === chat.id}
              <div class="delete-confirm">
                <span>Delete?</span>
                <button 
                  onclick={() => handleDeleteChat(chat.id)}
                  class="confirm-button"
                  aria-label="Confirm delete"
                >
                  Yes
                </button>
                <button 
                  onclick={cancelDeleteChat}
                  class="cancel-button"
                  aria-label="Cancel delete"
                >
                  No
                </button>
              </div>
            {:else}
              <button 
                onclick={(e) => {
                  e.stopPropagation();
                  confirmDeleteId = chat.id;
                }}
                class="delete-button"
                title="Delete chat"
                aria-label={`Delete chat: ${chat.name || 'Untitled conversation'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .chat-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--surface-900);
    color: var(--surface-50);
  }
  
  .header {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--surface-700);
  }
  
  .header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }
  
  .create-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--primary-600);
    color: white;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    text-align: left;
    background: none;
    font-family: inherit;
    color: inherit;
  }
  
  .create-button:hover {
    background-color: var(--primary-700);
  }
  
  .create-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .chat-list-items {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    flex: 1;
  }
  
  .chat-item {
    display: flex;
    border-bottom: 1px solid var(--surface-800);
    position: relative;
  }
  
  .chat-item.active {
    background-color: var(--surface-800);
  }
  
  .chat-item-content {
    flex: 1;
    cursor: pointer;
    overflow: hidden;
    text-align: left;
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
    color: inherit;
    width: 100%;
  }
  
  .chat-item:hover {
    background-color: var(--surface-800);
  }
  
  .chat-title {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0.5rem 1rem 0 1rem;
  }
  
  .chat-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--surface-400);
    margin: 0;
    padding: 0.25rem 1rem 0.5rem 1rem;
  }
  
  .company {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 50%;
  }
  
  .date {
    white-space: nowrap;
  }
  
  .chat-actions {
    display: flex;
    align-items: center;
    padding-right: 0.5rem;
  }
  
  .delete-button {
    background: none;
    border: none;
    color: var(--surface-500);
    padding: 0.25rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s, color 0.2s;
  }
  
  .chat-item:hover .delete-button {
    opacity: 1;
  }
  
  .delete-button:hover {
    color: var(--danger-500);
  }
  
  .delete-confirm {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
  }
  
  .confirm-button, .cancel-button {
    background: none;
    border: none;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }
  
  .confirm-button {
    background-color: var(--danger-600);
    color: white;
  }
  
  .cancel-button {
    background-color: var(--surface-700);
    color: white;
  }
  
  .empty-state, .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
    color: var(--surface-400);
    text-align: center;
  }
  
  .empty-state svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>