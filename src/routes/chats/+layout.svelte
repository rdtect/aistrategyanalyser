<script lang="ts">
  // Copied and adapted from original root layout
  import { page } from "$app/state"; // Use state instead of store
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  // Use Skeleton's createToaster instead of getContext
  import { onMount } from "svelte";
  import { Toaster, createToaster } from "@skeletonlabs/skeleton-svelte";

  // Import chatManager instead of individual functions
  import { chatManager } from "./(lib)/ChatManager.svelte.ts";

  import ChatSidebar from "./(lib)/components/ChatSidebar.svelte";
  import AppBar from "./(lib)/components/AppBar.svelte";

  // Type Imports
  import type { Chat } from "$lib/types";

  import IconChevronLeft from "@lucide/svelte/icons/chevron-left"; // Assuming icon needed for toggle

  // Props (children and data from SvelteKit)
  let { children } = $props();

  // Create a toaster instance
  const toaster = createToaster();

  // Local UI State
  let windowWidth = $state(browser ? window.innerWidth : 1024);
  const MOBILE_BREAKPOINT = 768;

  // --- Use $state for sidebarCollapsed ---
  let sidebarCollapsed = $state(false);

  // --- Derived values for conditions ---
  const isChatDetailPage = $derived(page.params.id !== undefined);
  const isMobileWidth = $derived(windowWidth <= MOBILE_BREAKPOINT);

  // Use chatManager properties directly for states
  const isLoadingChats = $derived(chatManager.isLoading);
  const chatInitError = $derived(chatManager.error);
  const activeChat = $derived(chatManager.activeChat);
  const title = $derived(activeChat?.name || "Start a New Analysis");
  const chatList = $derived(chatManager.chatList);

  // --- Refined Effect for automatic collapse on mobile ---
  $effect(() => {
    const mobile = isMobileWidth; // Access directly
    const detail = isChatDetailPage; // Access directly

    if (mobile) {
      // Only manage state automatically if on mobile
      const newState = detail; // Collapse only if it's a detail page on mobile
      if (sidebarCollapsed !== newState) {
        console.log(
          `[Effect] Mobile detected (${mobile}), setting sidebarCollapsed to ${newState}`,
        );
        sidebarCollapsed = newState;
      }
    }
    // On desktop (mobile === false), this effect does nothing,
    // leaving sidebarCollapsed under manual control via toggleSidebar.
  });

  // Effects - Window resize handling
  $effect(() => {
    if (!browser) return;
    const handleResize = () => {
      windowWidth = window.innerWidth;
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  });

  // Event Handlers - Use chatManager methods directly
  async function handleCreateChat() {
    try {
      // FIX: Use correct method name 'createChat' (not createNewChat)
      const newChat = await chatManager.createChat("New Analysis");
      if (newChat) {
        goto(`/chats/${newChat.id}`);
      } else {
        toaster.error({
          description: chatManager.error || "Failed to create chat.",
        });
      }
    } catch (e) {
      console.error("Unexpected error creating chat:", e);
      toaster.error({
        description: `Error: ${e instanceof Error ? e.message : e}`,
      });
    }
  }

  async function handleSelectChat(id: string) {
    chatManager.selectChat(id);
    goto(`/chats/${id}`);
  }

  async function handleDeleteChat(id: string) {
    try {
      const success = await chatManager.deleteChat(id);
      if (success) {
        toaster.success({ description: "Analysis deleted successfully." });
        if (page.params.id === id) {
          goto("/chats");
        }
      } else {
        toaster.error({
          description: chatManager.error || "Failed to delete chat.",
        });
      }
    } catch (e) {
      console.error("Unexpected error deleting chat:", e);
      toaster.error({
        description: `Error: ${e instanceof Error ? e.message : e}`,
      });
    }
  }

  // ChatManager is initialized in its constructor, so we don't need onMount

  // Keep toggleSidebar as is (modifies the state directly):
  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    console.log("Toggle sidebar clicked. New state:", sidebarCollapsed);
  }
</script>

<!-- Add the Toaster component -->
<Toaster {toaster} />

<!-- Layout structure for the chat section -->
<div class="h-full w-full flex flex-col flex-1 min-h-0 max-h-screen overflow-hidden">
  <header class="shrink-0">
    <AppBar {title} />
  </header>

  <div class="flex flex-1 min-h-0 max-h-full overflow-hidden bg-transparent">
    <!-- Wrapper div for collapse transition -->
    <div
      class="relative h-full min-h-0 max-h-full flex flex-col {sidebarCollapsed
        ? 'lg:w-0'
        : 'lg:w-72'} transition-all duration-300 bg-transparent"
    >
      <aside
        class="h-full min-h-0 max-h-full flex flex-col overflow-y-auto transition-all duration-300 border-r border-surface-500/20 {sidebarCollapsed
          ? 'lg:w-0 lg:opacity-0'
          : 'lg:w-72 lg:opacity-100'} glass-surface"
        class:hidden={sidebarCollapsed && isMobileWidth}
        class:lg:flex={!sidebarCollapsed}
      >
        {#if isLoadingChats}
          <p class="p-4 text-xs text-center text-surface-500">
            Loading chats...
          </p>
        {:else if chatInitError}
          <p class="p-4 text-xs text-center text-error-500">
            Error loading chats: {chatInitError}
          </p>
        {:else}
          <ChatSidebar
            chats={chatList}
            activeChatId={page.params.id}
            onDeleteChat={handleDeleteChat}
            onSelectChat={handleSelectChat}
            onCreateChat={handleCreateChat}
          />
        {/if}
      </aside>
      <!-- Sidebar toggle button -->
      <button
        onclick={toggleSidebar}
        class="absolute {sidebarCollapsed
          ? 'lg:-right-8'
          : 'lg:-right-6'} top-2 z-20 p-1.5 glass-primary hover:bg-primary-500/20 rounded-lg transition-all duration-300 shadow-sm hidden lg:block"
        aria-label={sidebarCollapsed
          ? "Show chat history"
          : "Hide chat history"}
        title={sidebarCollapsed ? "Show chat history" : "Hide chat history"}
      >
        <IconChevronLeft
          class="w-3.5 h-3.5 {sidebarCollapsed
            ? 'rotate-180'
            : 'rotate-0'} transition-transform"
        />
      </button>
    </div>
    <main class="flex-1 flex flex-col overflow-hidden min-h-0 max-h-full bg-transparent">
      <div class="flex-1 overflow-y-auto min-h-0 max-h-full">
        {@render children()}
      </div>
    </main>
  </div>
</div>

<!--
  If you are passing props to a child component, ensure the prop types match.
  For example, if a prop expects a function of type (id: string) => void, make sure you do not pass a () => Chat[] or string.
  If the error is in a slot/snippet, check that the slot/snippet signature matches the expected shape.
-->
