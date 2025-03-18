<script lang="ts">
  import type { Chat as ChatType } from "$lib/types/chat";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  // Get data from page load function
  let { data } = $props<{ data: { chats: ChatType[] } }>();
  
  // Reactive local copy of chats that can be updated
  let chats = $state<ChatType[]>([]);
  
  // Initialize chats from data
  $effect(() => {
    chats = [...data.chats];
  });
  
  // Load user chats from localStorage
  function loadUserChats() {
    if (!browser) return;
    
    try {
      // Start with sample chats (the ones loaded from server)
      let sampleChatIds = data.chats.map((c: { id: Number; }) => c.id);
      let allChats = [...data.chats];
      
      // Get user chats from localStorage
      const userChatsJson = localStorage.getItem('userChats');
      if (userChatsJson) {
        const userChats = JSON.parse(userChatsJson);
        
        // Add user chats that don't exist in sample chats
        userChats.forEach((userChat: any) => {
          if (!sampleChatIds.includes(userChat.id)) {
            allChats.push(userChat);
          }
        });
      }
      
      // Sort chats by creation date, newest first
      allChats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Update local state
      chats = allChats;
    } catch (error) {
      console.error('Error loading user chats:', error);
    }
  }
  
  // Set up event listeners for localStorage changes
  onMount(() => {
    // Load chats on mount
    loadUserChats();
    
    if (browser) {
      // Listen for storage events (when localStorage changes in another tab)
      window.addEventListener('storage', (event) => {
        if (event.key === 'userChats') {
          loadUserChats();
        }
      });
      
      // Listen for custom event from our app
      window.addEventListener('userChatsUpdated', () => {
        loadUserChats();
      });
      
      return () => {
        // Clean up event listeners on unmount
        window.removeEventListener('storage', loadUserChats);
        window.removeEventListener('userChatsUpdated', loadUserChats);
      };
    }
  });
  
  // Navigate to individual chat page
  function goToChat(chatId: string) {
    goto(`/chats/${chatId}`);
  }

  // Handle keyboard navigation
  function handleKeydown(event: KeyboardEvent, chatId: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToChat(chatId);
    }
  }
</script>

<div class="container mx-auto p-6">
  <div
    class="mb-8 py-4 px-8 bg-primary-500/20 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 rounded-lg"
  >
    <h1 class="text-2xl font-bold">AI Strategy Bot</h1>
    <a
      href="/chats/new"
      class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
    >
      Create New Analysis
    </a>
  </div>
  
  <!-- Display the actual chats from our local state -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#if chats.length === 0}
      <div class="col-span-full text-center py-8">
        <p class="text-lg text-surface-500">No analyses yet. Create your first one!</p>
      </div>
    {:else}
      {#each chats as chat}
        <button
          aria-label={`Chat ${chat.name}`}
          class="text-left outline-1 bg-primary-800/20 rounded-lg p-4 hover:outline-primary-500 hover:shadow-lg transition-shadow cursor-pointer border-0"
          onclick={() => goToChat(chat.id)}
          onkeydown={(e) => handleKeydown(e, chat.id)}
        >
          <h2 class="text-xl font-semibold mb-2">{chat.name}</h2>
          <div class="text-sm text-surface-200 space-y-1">
            {#if chat.company}
              <div><span class="font-medium">Company:</span> {chat.company}</div>
            {/if}
            {#if chat.industry}
              <div>
                <span class="font-medium">Industry:</span>
                {chat.industry}
              </div>
            {/if}
            {#if chat.region}
              <div><span class="font-medium">Region:</span> {chat.region}</div>
            {/if}
          </div>
          <div class="mt-4 text-xs text-surface-400">
            Created: {new Date(chat.createdAt).toLocaleDateString()}
          </div>
        </button>
      {/each}
    {/if}
  </div>
</div>
