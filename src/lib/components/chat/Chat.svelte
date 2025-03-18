<script lang="ts">
  import { AI_MODELS, type AIModel } from "$lib/config/aiModels";
  import BotIcon from "lucide-svelte/icons/bot-message-square";
  import { Avatar } from "@skeletonlabs/skeleton-svelte";
  import ArrowDown from "lucide-svelte/icons/arrow-down";
  import { marked } from "marked";
  import { fade, fly, scale } from "svelte/transition";
  import type { Chat, Message } from "$lib/types/chat"; // Updated import path
  import { chatStore } from "./Chat.svelte.ts";
  import NewAnalysisModal from "./NewAnalysisModal/index.svelte";
  import ChatInput from "./ChatInput.svelte";
  import ChatSidebar from "./ChatSidebar.svelte";
  import ChatHeader from "./ChatHeader.svelte";
  import ChatMessage from "./ChatMessage.svelte";

  // Props
  let { chats } = $props<{ chats: Chat[] }>();

  // Initialize the chat store with the provided chats
  $effect(() => {
    chatStore.init(chats);
  });

  // Constants
  const userName = "RD";
  const modelEntries: [string, { name: string }][] = Object.entries(AI_MODELS);

  // DOM references and state
  let elemChat: HTMLElement | null = $state(null);
  let showScrollButton = $state(false);
  let showNewChatModal = $state(false);

  // Utility functions
  function scrollChatBottom(behavior: ScrollBehavior = "auto") {
    if (elemChat) {
      elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
    }
  }

  function handleScroll(event: Event) {
    if (!elemChat) return;
    const isScrolledUp =
      elemChat.scrollHeight - elemChat.scrollTop > elemChat.clientHeight + 200;
    showScrollButton = isScrolledUp;
  }

  // Event handlers
  async function handleMessageSubmit(message: string) {
    await chatStore.handleMessageSubmit(message);
    setTimeout(() => scrollChatBottom("smooth"), 100);
  }

  function openNewChatModal() {
    console.log('Opening modal...'); // Debug log
    showNewChatModal = true;
  }

  function handleCloseModal() {
    console.log('Closing modal...'); // Debug log
    showNewChatModal = false;
  }
</script>

<div
  class="border-surface-500 bg-surface-900 flex h-[calc(100vh-13rem)] flex-col rounded-2xl border"
>
  <ChatHeader />

  <div class="flex flex-1 overflow-hidden">
    <div class="border-surface-500 hidden border-r md:block w-80">
      <ChatSidebar 
        {showNewChatModal}
        {openNewChatModal}
        {handleCloseModal}
      />
    </div>
    
    <div class="relative flex h-full flex-1 flex-col">
      <div
        bind:this={elemChat}
        class="flex-1 space-y-4 overflow-y-auto p-4"
        onscroll={handleScroll}
      >
        {#each chatStore.messages as message, index}
          <div in:fly={{ y: 20, duration: 300, delay: index * 100 }}>
            <ChatMessage {message} />
          </div>
        {/each}

        {#if chatStore.isLoading}
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
          chatId={chatStore.currentChatId?.toString() || ""} 
          onMessageSubmit={handleMessageSubmit} 
        />
      </div>
    </div>
  </div>
</div>