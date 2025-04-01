<script lang="ts">
  import { Navigation, Accordion } from '@skeletonlabs/skeleton-svelte';
  import type { Chat, Message } from '$lib/types';
  import { goto } from '$app/navigation';
  
  // Icons
  import IconMenu from '@lucide/svelte/icons/menu';
  import IconPlus from '@lucide/svelte/icons/plus';
  import IconTrash from '@lucide/svelte/icons/trash-2';
  import IconMessageSquare from '@lucide/svelte/icons/message-square';
  import IconSettings from '@lucide/svelte/icons/settings';
  import IconHistory from '@lucide/svelte/icons/history';
  import IconSearch from '@lucide/svelte/icons/search';
  import IconLogOut from '@lucide/svelte/icons/log-out';
  
  // Props
  let { 
    chats = [], 
    activeChatId = '', 
    onDeleteChat, 
    onSelectChat 
  } = $props<{
    chats: Chat[];
    activeChatId?: string;
    onDeleteChat: (id: string) => Promise<void>;
    onSelectChat: (id: string) => Promise<void>;
  }>();
  
  // State
  let isCreating = $state(false);
  let confirmDeleteId = $state<string | null>(null);
  let searchQuery = $state('');
  
  // Define the type for our date groups
  type DateGroup = [string, Chat[]];
  
  // Group chats by date section
  let chatsByDate: DateGroup[] = $derived(
    (() => {
      const groups: Record<string, Chat[]> = {
        'Today': [],
        'Yesterday': [],
        'This Week': [],
        'Earlier': []
      };
      
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - 7);
      
      // Filter by search if needed
      const filteredChats = searchQuery 
        ? chats.filter((chat: Chat) => 
            chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (chat.messages.length > 0 && chat.messages.some((m: Message) => 
              typeof m.content === 'string' && 
              m.content.toLowerCase().includes(searchQuery.toLowerCase())
            ))
          )
        : chats;
      
      // Group by date
      filteredChats.forEach((chat: Chat) => {
        const chatDate = new Date(chat.updatedAt);
        
        if (chatDate.toDateString() === now.toDateString()) {
          groups['Today'].push(chat);
        } else if (chatDate.toDateString() === yesterday.toDateString()) {
          groups['Yesterday'].push(chat);
        } else if (chatDate > weekStart) {
          groups['This Week'].push(chat);
        } else {
          groups['Earlier'].push(chat);
        }
      });
      
      // Only return groups that have chats
      return Object.entries(groups)
        .filter(([_, groupChats]) => groupChats.length > 0) as DateGroup[];
    })()
  );
  
  // Format date for display
  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // If it's within the last 7 days, return day name
    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    }
    
    // Otherwise, return short date
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  }

  // Get chat snippet from messages
  function getChatSnippet(chat: Chat | undefined): string {
    if (!chat || !chat.messages || chat.messages.length === 0) {
      return 'No messages yet';
    }

    const lastMessage = chat.messages[chat.messages.length - 1];

    // Safely handle potentially undefined/null content
    const content = lastMessage?.content;
    if (typeof content === 'string' && content.trim() !== '') {
      const snippet = content.substring(0, 50);
      return snippet.length < content.length ? snippet + '...' : snippet;
    } else if (lastMessage?.role === 'assistant') {
      // Handle cases like tool usage where content might be missing
      return '[AI processing...]'; 
    } else {
      return '[Empty message]';
    }
  }
  
  // Simulate unread messages (for demo purposes)
  function hasUnread(chat: Chat): boolean {
    // In real implementation, you would track read status
    // For now, we'll say chats from today with IDs ending in odd numbers are unread
    if (new Date(chat.updatedAt).toDateString() === new Date().toDateString()) {
      const lastChar = chat.id.charAt(chat.id.length - 1);
      return '13579'.includes(lastChar);
    }
    return false;
  }
  
  // Handle selecting a chat
  async function handleSelectChat(id: string) {
    try {
      await onSelectChat(id);
    } catch (error) {
      console.error('Error selecting chat:', error);
    }
  }
  
  // Handle confirming chat deletion
  function confirmDelete(id: string, event: Event) {
    event.stopPropagation();
    confirmDeleteId = id;
  }
  
  // Handle canceling deletion
  function cancelDelete() {
    confirmDeleteId = null;
  }
  
  // Handle actual deletion
  async function handleDeleteChat(id: string) {
    try {
      await onDeleteChat(id);
      confirmDeleteId = null;
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  }
  
  // Go to settings
  function goToSettings() {
    window.location.href = '/settings';
  }

  // Make sure the derived value using this function handles potential undefined chat
  const chatSnippets = $derived(
    chats.map((chat: Chat | undefined) => chat ? getChatSnippet(chat) : 'Loading...')
  );
</script>

<div class="card h-full w-full border-surface-100-900 border-[1px] flex flex-col">
  <!-- Header with title and new chat button -->
  <header class="p-2 border-b border-surface-500/20 flex justify-between items-center">
    <div class="flex items-center gap-2">
      <IconHistory size={16} class="text-primary-500" />
      <h3 class="text-sm font-medium">Analysis History</h3>
    </div>
    
    <button
      onclick={() => goto('/chats/new')}
      class="btn btn-sm variant-ghost-primary"
      disabled={isCreating}
      title="Create New Analysis"
    >
      {#if isCreating}
        <div class="w-4 h-4 border-2 border-primary-300 border-t-primary-500 rounded-full animate-spin"></div>
      {:else}
        <IconPlus size={16} />
      {/if}
    </button>
  </header>
  
  <!-- Search input -->
  <div class="p-1 border-b border-surface-500/30">
    <div class="input-group input-group-divider grid-cols-[auto_1fr] rounded-container-token h-8">
      <div class="ig-cell preset-tonal flex items-center justify-center">
        <IconSearch size={14} />
      </div>
      <input
        type="text"
        class="ig-input bg-transparent text-xs"
        placeholder="Search analyses..."
        bind:value={searchQuery}
      />
    </div>
  </div>
  
 
  <!-- Chat list -->
  <div class="flex-1 overflow-hidden">
    {#if chats.length === 0}
      <div class="p-4 text-xs text-center text-surface-500">
        <p>No analyses yet.</p>
        <p class="mt-2">Click the + button to create your first analysis.</p>
      </div>
    {:else if chatsByDate.length === 0}
      <div class="p-4 text-xs text-center text-surface-500">
        <p>No analyses match your search.</p>
        <button 
          class="mt-2 text-primary-500 hover:underline" 
          onclick={() => searchQuery = ''}
        >
          Clear search
        </button>
      </div>
    {:else}
      <div class="py-2">
        {#each chatsByDate as [dateLabel, dateChats]}
          <div class="mb-2">
            <div class="px-4 py-1 text-[10px] font-medium uppercase tracking-wider text-surface-500">
              {dateLabel}
            </div>
            
            <div class="space-y-0.5">
              {#each dateChats as chat (chat.id)}
                {#if confirmDeleteId === chat.id}
                  <div class="p-2 bg-error-500/10 rounded-md border border-error-500/20 mx-2">
                    <p class="text-xs mb-2">Delete this analysis?</p>
                    <div class="flex gap-1">
                      <button
                        onclick={() => handleDeleteChat(chat.id)}
                        class="flex-1 py-1 bg-error-500 hover:bg-error-600 text-white text-xs rounded"
                      >
                        Delete
                      </button>
                      <button
                        onclick={cancelDelete}
                        class="flex-1 py-1 bg-surface-500/20 hover:bg-surface-500/30 text-xs rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                {:else}
                  <button
                    onclick={() => handleSelectChat(chat.id)}
                    class="group w-full text-left p-2 mx-1 rounded-lg transition-colors {chat.id === activeChatId ? 'bg-primary-500/10 hover:bg-primary-500/15' : 'hover:bg-surface-500/10'}"
                  >
                    <div class="flex items-center gap-2">
                      <div class="flex-none w-6 h-6 flex items-center justify-center rounded-full {chat.id === activeChatId ? 'bg-primary-500/20 text-primary-700 dark:text-primary-300' : 'bg-surface-500/20 text-surface-700 dark:text-surface-300'}">
                        <IconMessageSquare size={12} />
                      </div>
                      
                      <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-center mb-0.5">
                          <div class="flex items-center">
                            <h4 class="text-xs font-medium truncate mr-1 {chat.id === activeChatId ? 'text-primary-700 dark:text-primary-300' : ''}">{chat.name}</h4>
                            {#if hasUnread(chat)}
                              <div class="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                            {/if}
                          </div>
                          <span class="text-[10px] opacity-60 flex-none ml-1">{formatTime(chat.updatedAt)}</span>
                        </div>
                        <p class="text-[11px] truncate opacity-70">{getChatSnippet(chat)}</p>
                      </div>
                      
                      <div
                        onclick={(e) => confirmDelete(chat.id, e)}
                        onkeydown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            confirmDelete(chat.id, e);
                          }
                        }}
                        class="opacity-0 group-hover:opacity-70 hover:!opacity-100 p-1 rounded-full hover:bg-surface-500/20 cursor-pointer"
                        aria-label="Delete chat"
                        role="button"
                        tabindex="0"
                      >
                        <IconTrash size={12} />
                      </div>
                    </div>
                  </button>
                {/if}
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- Footer with settings -->
  <footer class="p-2 border-t border-surface-500/20">
    <button
      onclick={goToSettings}
      class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-surface-500/10 text-xs"
    >
      <IconSettings size={14} />
      <span>Settings</span>
    </button>
  </footer>
</div>

<style>
  /* Navigation styles */
  button:hover .opacity-0 {
    opacity: 0.7;
  }
</style> 