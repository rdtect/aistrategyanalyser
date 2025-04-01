<script lang="ts">
  import { page } from "$app/state";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { chatStore } from "./(components)/ChatStore.svelte";
  import ChatSidebar from "./(components)/ChatSidebar.svelte";
  import AppBar from "./(components)/AppBar.svelte";
  import ChatStoreSync from "./(components)/ChatStore.svelte";
  import type { Chat } from '$lib/types'; // Import Chat type

  // Props
  let { data, children } = $props();

  // Initialize state with runes
  let windowWidth = $state(browser ? window.innerWidth : 1024);
  let sidebarCollapsed = $state(false);
  const MOBILE_BREAKPOINT = 768;

  // Initialize chats from server-provided sample data
  $effect(() => {
    if (browser && data.sampleChats) {
      // Ensure sampleChats conform to Chat[] type before initializing
      const completeSampleChats: Chat[] = data.sampleChats.map((chat: any) => ({
        ...chat,
        messages: chat.messages || [], // Add default messages array
        updatedAt: chat.updatedAt || chat.createdAt || new Date().toISOString(), // Add default updatedAt
        // Ensure context has id and name if needed, though store might handle defaults now
        context: {
          id: chat.context?.id || `ctx-${chat.id}`,
          name: chat.context?.name || `Ctx ${chat.name}`,
          ...chat.context,
        },
      }));
      chatStore.initialize(completeSampleChats);
    }
  });

  // Reactive derivations with $derived
  const currentPath = $derived(page.url.pathname);
  const isRootChatPage = $derived(currentPath === '/chats');
  const isChatDetailPage = $derived(page.params.id !== undefined);
  const isNewChatPage = $derived(currentPath === '/chats/new');
  const shouldShowSidebar = $derived(!isNewChatPage);

  // Update sidebar collapsed state reactively
  $effect(() => {
    if (isNewChatPage) {
      sidebarCollapsed = true;
    } else if (isRootChatPage) {
      sidebarCollapsed = false;
    } else if (isChatDetailPage) {
      sidebarCollapsed = browser && windowWidth <= MOBILE_BREAKPOINT;
    }
  });

  // Handle window resize
  $effect(() => {
    if (!browser) return;

    const handleResize = () => {
      windowWidth = window.innerWidth;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  });

  // Toggle sidebar
  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
  }

  // Handler for creating a new chat
  async function handleCreateChat() {
    const chatId = await chatStore.createChat("New Analysis");
    if (chatId) {
      goto(`/chats/${chatId}`);
    }
    return chatId;
  }

  // Handler for selecting a chat
  async function handleSelectChat(id: string) {
    await chatStore.setActiveChat(id);
    goto(`/chats/${id}`);
  }

  // Handler for deleting a chat
  async function handleDeleteChat(id: string) {
    await chatStore.deleteChat(id);
    if (page.params.id === id) {
      goto('/chats');
    }
  }

  // Get chat title for the app bar
  const chatTitle = $derived(() => {
    const activeChat = chatStore.activeChat;
    if (isNewChatPage) return "New Analysis";
    if (isRootChatPage) return "Chat Home";
    return activeChat?.name || "AI Strategy Analysis";
  });
</script>

<div class="h-full w-full overflow-hidden flex flex-col mx-auto border border-surface-500/20 rounded-xl bg-surface-100-800-token/30">
  <!-- Invisible component that keeps chat store in sync -->
  <ChatStoreSync />
  
  <!-- Chat module app bar -->
  <div class="flex-none border-b border-surface-500/20">
    <AppBar title={chatTitle} />
  </div>

  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar -->
    {#if shouldShowSidebar}
      <div class="relative h-full {sidebarCollapsed ? 'w-0' : 'w-72'} transition-all duration-300">
        <aside class="h-full overflow-y-auto transition-all duration-300 border-r border-surface-500/20 {sidebarCollapsed ? 'w-0 opacity-0' : 'w-72 opacity-100'}">
          <ChatSidebar 
            chats={chatStore.chatList} 
            activeChatId={page.params.id}
            onDeleteChat={handleDeleteChat}
            onSelectChat={handleSelectChat}
          />
        </aside>

        <!-- Sidebar toggle -->
        <button
          onclick={toggleSidebar}
          class="absolute {sidebarCollapsed ? '-right-8' : '-right-6'} top-2 z-20 p-1.5 bg-primary-500/30 hover:bg-primary-500/20 text-primary-700 dark:text-primary-400 rounded-m transition-all duration-300 shadow-sm"
          aria-label={sidebarCollapsed ? "Show chat history" : "Hide chat history"}
          title={sidebarCollapsed ? "Show chat history" : "Hide chat history"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 {sidebarCollapsed ? 'rotate-180' : 'rotate-0'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>
    {/if}

    <!-- Main content -->
    <div class="flex-1 flex flex-col bg-surface-100-800-token/30 overflow-hidden">
      {@render children()}
    </div>
  </div>
</div>