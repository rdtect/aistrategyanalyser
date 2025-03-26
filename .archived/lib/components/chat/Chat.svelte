<script lang="ts">
  import { AI_MODELS } from "$lib/config/aiModels";
  import BotIcon from "lucide-svelte/icons/bot-message-square";
  import ArrowDown from "lucide-svelte/icons/arrow-down";
  import { fade, fly } from "svelte/transition";
  import type { Chat, Message } from "$lib/types/chat";
  import { getContext } from "svelte";
  import type { ChatStore } from "$lib/stores/chatStore.svelte";
  import ChatInput from "./ChatInput.svelte";
  import ChatHeader from "./ChatHeader.svelte";
  import ChatMessage from "./ChatMessage.svelte";
  import { onMount } from "svelte";
  
  // Props
  let { chats } = $props<{ chats: Chat[] }>();

  // Get chatStore from context
  const chatStore = getContext('chatStore') as ChatStore;
  
  // DOM references and state
  let elemChat: HTMLElement | null = $state(null);
  let showScrollButton = $state(false);
  let isLoading = $state(false);
  
  // Create local reactive references to avoid constant assignment issues
  const currentMessages = $derived.by(() => {
    try {
      if (chatStore && chatStore.currentChat) {
        return [...(chatStore.currentChat.messages || [])];
      }
      return [];
    } catch (error) {
      console.error('Error accessing messages:', error);
      return [];
    }
  });
  
  // Update local state when chat store changes
  $effect(() => {
    try {
      if (chatStore) {
        isLoading = chatStore.isLoading;
      }
    } catch (err) {
      console.error("Error updating loading state:", err);
      isLoading = false;
    }
  });

  // Initialize the chat store with the provided chats
  onMount(() => {
    console.log("Chat component mounted, initializing with chats:", chats);
    if (chatStore && chatStore.ensureInitialized) {
      chatStore.ensureInitialized(chats);
      console.log("Chat initialized with", chats.length, "chats");
      
      if (chatStore.currentChat) {
        console.log("Current chat:", chatStore.currentChat.name || "None");
        console.log("Messages count:", chatStore.currentChat.messages?.length || 0);
      }
    } else {
      console.error("Chat store not available or ensureInitialized method missing");
    }
  });

  // Utility functions
  function scrollChatBottom(behavior: ScrollBehavior = "auto") {
    if (elemChat) {
      elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
    }
  }

  function handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (!target) return;
    
    // Calculate if we're near the bottom
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    showScrollButton = scrollBottom > 200;
  }

  // Auto-scroll when new messages arrive
  $effect(() => {
    if (currentMessages.length > 0 && elemChat) {
      // Store the message count to track changes
      const messageCount = currentMessages.length;
      
      // Don't auto-scroll if user has scrolled up, unless new message arrived
      if (!showScrollButton || prevMessageCount !== messageCount) {
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          scrollChatBottom();
        });
      }
      
      // Update previous count
      prevMessageCount = messageCount;
    }
  });

  // Track previous message count to only scroll on new messages
  let prevMessageCount = $state(0);

  // Event handlers
  async function handleMessageSubmit(message: string) {
    console.log("Sending message:", message);
    if (chatStore) {
      await chatStore.handleMessageSubmit(message);
    }
  }
</script>

<div
  class="border-surface-500 bg-surface-900 flex h-[calc(100vh-13rem)] flex-col rounded-2xl border"
>
  <ChatHeader />

  <div class="flex flex-1 overflow-hidden">
    <div class="flex h-full flex-col">
      {#if currentMessages.length === 0}
        <div class="flex h-full items-center justify-center">
          <div class="text-center">
            <h2 class="h2 mb-4">Start a new conversation</h2>
            <p class="text-surface-600">Type a message below to get started.</p>
          </div>
        </div>
      {:else}
        <div class="relative flex h-full flex-1 flex-col">
          <div
            bind:this={elemChat}
            class="flex-1 space-y-4 overflow-y-auto p-4"
            onscroll={handleScroll}
          >
            {#each currentMessages as message}
              <div in:fly={{ y: 20, duration: 300 }}>
                <ChatMessage message={message} />
              </div>
            {/each}

            {#if isLoading}
              <div in:fade={{ duration: 200 }}>
                <div class="flex items-center gap-2 p-4 bg-surface-800/50 w-3/4 shadow-xl shadow-blue-500/5 rounded-3xl rounded-tl-none">
                  <div class="flex space-x-2">
                    <div class="bg-primary-300 h-3 w-3 animate-pulse rounded-full"></div>
                    <div 
                      class="bg-primary-300 h-3 w-3 animate-pulse rounded-full"
                      style="animation-delay: 0.2s"
                    ></div>
                    <div
                      class="bg-primary-300 h-3 w-3 animate-pulse rounded-full"
                      style="animation-delay: 0.4s"
                    ></div>
                  </div>
                  <span class="text-sm text-white">Generating response...</span>
                </div>
              </div>
            {/if}

            {#if showScrollButton}
              <button
                class="bg-primary-500 absolute bottom-20 z-10 mx-auto rounded-full p-2 text-white shadow-lg"
                onclick={() => scrollChatBottom("smooth")}
                aria-label="Scroll to bottom"
              >
                <ArrowDown />
              </button>
            {/if}
          </div>

          <div class="border-surface-500 border-t p-2" in:fade={{ duration: 300 }}>
            <ChatInput 
              chatId={chatStore?.currentChatId?.toString() || ""} 
              onMessageSubmit={handleMessageSubmit}
              disabled={isLoading}
            />
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
