<!--
  Chat Sidebar Component
  
  Displays a list of chats and provides controls for managing them.
-->
<script lang="ts">
  import type { Chat } from '../../types/chat';
  import { goto } from '$app/navigation';
  import { chatStore } from '../../stores/chatStore.svelte';
  import { onMount } from 'svelte';
  import  Search  from 'lucide-svelte/icons/search'
  
  // Props using Svelte 5 runes
  let { 
    chats = [],
    activeChatId = null,
    onCreateChat = () => chatStore.createChat(),
    onDeleteChat = (id: string) => chatStore.deleteChat(id),
    onSelectChat = (id: string) => chatStore.setActiveChat(id)
  } = $props<{
    chats?: Chat[];
    activeChatId?: string | null;
    onCreateChat?: () => Promise<string> | string;
    onDeleteChat?: (id: string) => boolean;
    onSelectChat?: (id: string) => boolean;
  }>();
  
  let componentMounted = $state(false);
  
  onMount(() => {
    componentMounted = true;
    console.log("ChatSidebar mounted, chats:", chats.length);
    
    // Force a log of all chat IDs
    if (chats.length > 0) {
      console.log("ChatSidebar chats on mount:", chats.map((c: Chat) => c.id));
    }
  });
  
  // Log when chats are received - using an effect to track changes
  $effect(() => {
    if (componentMounted) {
      console.log("ChatSidebar chats updated:", chats.length);
      if (chats.length > 0) {
        console.log("ChatSidebar chat IDs:", chats.map((c: Chat) => c.id));
        console.log("Sample chat from sidebar:", chats[0]);
      }
    }
  });
  
  // Local state
  let isCreatingChat = $state(false);
  let showConfirmDelete = $state<string | null>(null);
  let searchQuery = $state('');
  
  // Track received chats for debug purposes
  let receivedChatIds = $state<string[]>([]);
  
  // Update the tracking whenever chats change
  $effect(() => {
    if (chats && chats.length > 0) {
      receivedChatIds = chats.map((c: Chat) => c.id);
    } else {
      receivedChatIds = [];
    }
  });
  
  // Verify chats have proper structure - this is for debugging only
  function verifyChats(): boolean {
    if (!chats || !Array.isArray(chats)) {
      console.error("Chats is not an array:", chats);
      return false;
    }
    
    for (const chat of chats) {
      if (!chat.id) {
        console.error("Chat missing ID:", chat);
        return false;
      }
      
      if (!chat.context) {
        console.error("Chat missing context:", chat.id);
        return false;
      }
    }
    
    return true;
  }
  
  // Run verification when chats change
  $effect(() => {
    if (componentMounted && chats.length > 0) {
      verifyChats();
    }
  });
  
  // Derived values - fix filtering with more robust error handling
  const filteredChats = $derived.by(() => {
    console.log("Filtering chats:", chats?.length || 0);
    
    // Ensure chats is an array before filtering
    if (!Array.isArray(chats)) {
      console.error("Chats is not an array in filteredChats");
      return [];
    }
    
    if (!searchQuery.trim()) return chats;
    
    const query = searchQuery.toLowerCase().trim();
    return chats.filter((chat: Chat) => {
      try {
        // Make sure we access properties safely in case structure is different
        const name = chat?.name || '';
        const company = chat?.context?.company || '';
        const industry = chat?.context?.industry || '';
        
        const nameMatch = name.toLowerCase().includes(query);
        const companyMatch = company.toLowerCase().includes(query);
        const industryMatch = industry.toLowerCase().includes(query);
        
        return nameMatch || companyMatch || industryMatch;
      } catch (e) {
        console.error("Error filtering chat:", e, chat);
        return false;
      }
    });
  });
  
  // Handle chat creation
  async function handleCreateChat() {
    // Create a local copy to avoid warning
    const creatingState = isCreatingChat;
    if (creatingState) return;
    
    isCreatingChat = true;
    try {
      const newChatId = await Promise.resolve(onCreateChat());
      
      // Navigate to the new chat
      goto(`/chats/${newChatId}`);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      isCreatingChat = false;
    }
  }
  
  // Show delete confirmation for a chat
  function confirmDelete(chatId: string, event: Event) {
    // Prevent triggering chat selection
    event.stopPropagation();
    showConfirmDelete = chatId;
  }
  
  // Cancel delete confirmation
  function cancelDelete(event: Event) {
    event.stopPropagation();
    showConfirmDelete = null;
  }
  
  // Handle chat deletion
  function handleDeleteChat(chatId: string, event: Event) {
    event.stopPropagation();
    
    const success = onDeleteChat(chatId);
    showConfirmDelete = null;
    
    return success;
  }
  
  // Handle chat selection
  function handleSelectChat(chatId: string) {
    if (chatId === activeChatId) {
      console.log(`Chat ${chatId} is already active, navigating directly`);
      goto(`/chats/${chatId}`);
      return true;
    }
    
    console.log(`Selecting chat: ${chatId}`);
    const success = onSelectChat(chatId);
    
    console.log(`Chat selection result: ${success ? 'success' : 'failed'}`);
    
    // Always navigate to the chat page, even if selection in the store might have failed
    // This allows the chat page component to handle loading the chat directly
    const chatUrl = `/chats/${chatId}`;
    console.log(`Navigating to: ${chatUrl}`);
    goto(chatUrl);
    
    return success;
  }
  
  // Clear search query
  function clearSearch() {
    searchQuery = '';
  }
</script>

<div class="flex h-full flex-col bg-surface-900/30 backdrop-blur-2xl text-surface-50">
  <!-- Header with title and new button -->
  <div class="flex items-center justify-between  border-b border-surface-700">
    <!-- <h2 class="text-sm font-semibold m-0">Recents</h2> -->
    <!-- <button 
      onclick={handleCreateChat} 
      class="flex items-center gap-2 px-4 py-1 bg-primary-500/50 hover:bg-primary-600 text-white rounded-md font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
      disabled={isCreatingChat}
      aria-label="Create new analysis"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      <span>New</span>
    </button> -->
  </div>
  

  <!-- Search input -->
  <div class="p-1 relative border-b border-surface-700">
    <input 
      type="text" 
      placeholder="Search..." 
      class="w-full p-1 pr-8 rounded bg-surface-800/50 border border-surface-700 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 text-surface-50 text-sm"
      bind:value={searchQuery}
    />
    {#if searchQuery}
      <button 
        onclick={clearSearch} 
        class="absolute right-6 top-1/2 -translate-y-1/2 text-surface-400 p-1 hover:text-surface-200"
        aria-label="Clear search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      {:else}
      <icon class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-400 p-1 hover:text-surface-200"><Search/></icon>
    {/if}
  </div>
  
  <!-- Chat list -->
  <ul class="flex-1 overflow-y-auto p-3 space-y-3 list-none m-0">
    {#if filteredChats.length === 0}
      <li class="flex items-center justify-center h-full p-2 text-center text-surface-400 italic text-sm">
        {searchQuery 
          ? `No analyses found matching "${searchQuery}"`
          : "No analyses yet. Create your first one!"
        }
      </li>
    {:else}
      {#each filteredChats as chat (chat.id)}
        <li class="mb-2 relative group">
          <a 
            href={`/chats/${chat.id}`}
            class="flex flex-col card card-hover bg-primary-800/20 rounded-lg p-2 hover:outline-primary-500 hover:shadow-lg transition-all {activeChatId === chat.id ? 'bg-primary-900/70 outline-1 outline-primary-200' : ''}"
          >
            <h3 class="text-sm font-medium">{chat.name || 'Untitled Analysis'}</h3>
            
            <div class="flex flex-wrap gap-1 text-xs text-surface-400 mt-1">
              {#if chat.context?.company}
                <span>{chat.context.company}</span>
              {/if}
              {#if chat.context?.industry}
                <span>• {chat.context.industry}</span>
              {/if}
            </div>
            
            <div class="mt-auto pt-2 flex justify-between text-xs text-surface-400">
              <span>{chat.messages?.length || 0} messages</span>
              <span>Updated: {new Date(chat.updatedAt).toLocaleDateString()}</span>
            </div>
          </a>

          <!-- Delete button -->
          {#if showConfirmDelete === chat.id}
            <div class="absolute inset-0 bg-surface-900/90 flex items-center justify-center rounded-lg">
              <div class="text-center">
                <p class="mb-2">Delete this analysis?</p>
                <div class="flex gap-2 justify-center">
                  <button 
                    onclick={(e) => handleDeleteChat(chat.id, e)}
                    class="px-3 py-1 bg-error-600 hover:bg-error-700 text-white rounded"
                  >
                    Yes
                  </button>
                  <button 
                    onclick={cancelDelete}
                    class="px-3 py-1 bg-surface-700 hover:bg-surface-600 text-white rounded"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          {:else}
            <button 
              onclick={(e) => confirmDelete(chat.id, e)}
              class="absolute top-2 right-2 p-2 text-surface-400 opacity-0 group-hover:opacity-80 hover:opacity-100 hover:text-error-500 bg-surface-800/50 rounded-full"
              aria-label="Delete analysis"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          {/if}
        </li>
      {/each}
    {/if}
  </ul>
</div>
