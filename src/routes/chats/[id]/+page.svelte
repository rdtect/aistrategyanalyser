<script lang="ts">
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { chatStore } from '../(components)/ChatStore.svelte';
  import ChatMessage from '../(components)/ChatMessage.svelte';
  import ChatInput from '../(components)/ChatInput.svelte';
  import IconBrain from '@lucide/svelte/icons/brain';
  import { v4 as uuidv4 } from 'uuid';
  import { ChatService } from '$lib/services/ChatService';
  import { createChatLogic } from './ChatLogic.svelte.ts';
  
  // Get data from load functions
  let { data } = $props();
  
  // Initialize chat logic
  const { 
    messages, 
    isLoading, 
    isStreaming,
    error: chatError,
    handleMessage 
  } = createChatLogic();
  
  // Local state
  let error = $state<string | null>(data.error || null);
  let messagesContainer = $state<HTMLElement | null>(null);
  let isInitializing = $state(false);
  let lastSetChatId = $state<string | null>(null);
  
  // Debug state
  let debuggingEnabled = browser && (typeof localStorage !== 'undefined') && localStorage.getItem('enableDebug') === 'true';
  
  function logDebug(label: string, info: any) {
    if (debuggingEnabled && browser) {
      console.log(`[DEBUG] ${label}:`, info);
    }
  }
  
  // Handle server-side errors and data
  $effect(() => {
    if (data.error) {
      error = data.error;
    }
  });
  
  // Sync chat error with local error
  $effect(() => {
    if (chatError) {
      error = chatError;
    }
  });
  
  // Ensure the chat is set in the chat store, but prevent loops by tracking last set ID
  $effect(() => {
    if (isInitializing) return;
    
    const chatId = data.chat?.id;
    if (!chatId) return;
    
    // Only set the active chat if it's different from the last one we set
    if (lastSetChatId !== chatId && (!chatStore.activeChat || chatStore.activeChat.id !== chatId)) {
      console.log(`Setting active chat to ${chatId} from page data`);
      
      isInitializing = true;
      lastSetChatId = chatId;
      
      chatStore.setActiveChat(chatId)
        .catch(err => {
          console.error('Error setting active chat from data:', err);
          error = `Failed to load chat: ${err.message || 'Unknown error'}`;
        })
        .finally(() => {
          isInitializing = false;
        });
    }
  });
  
  // Handle retrying when there's an error
  async function retryLoadChat() {
    if (!page.params.id) return;
    
    try {
      error = null;
      isInitializing = true;
      
      // Try to load directly from the service
      const chat = await ChatService.getChatById(page.params.id);
      
      if (chat) {
        // Set the active chat
        lastSetChatId = chat.id;
        await chatStore.setActiveChat(chat.id);
        console.log('Successfully reloaded chat');
      } else {
        error = `Chat not found: ${page.params.id}`;
      }
    } catch (err) {
      console.error('Error retrying chat load:', err);
      error = err instanceof Error ? err.message : String(err);
    } finally {
      isInitializing = false;
    }
  }
  
  // Auto-scroll to bottom when messages change - use a timeout to avoid too many scrolls
  let scrollTimeout: number | null = null;
  $effect(() => {
    if (!messagesContainer || messages.length === 0) return;
    
    // Clear any existing timeout to prevent multiple scrolls
    if (scrollTimeout) {
      window.clearTimeout(scrollTimeout);
    }
    
    // Set a new timeout
    scrollTimeout = window.setTimeout(() => {
      messagesContainer!.scrollTop = messagesContainer!.scrollHeight;
      scrollTimeout = null;
    }, 100);
  });
  
  // Cleanup on unmount
  onMount(() => {
    return () => {
      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }
    };
  });
</script>

<div class="h-full flex flex-col">
  {#if error}
    <div class="p-4 bg-error-500/10 text-error-500 border border-error-500/20 flex justify-between items-center">
      <span>{error}</span>
      <button 
        onclick={retryLoadChat}
        class="ml-2 px-3 py-1 bg-error-500/20 hover:bg-error-500/30 rounded text-sm font-medium transition-colors"
        disabled={isLoading || isInitializing}
      >
        {isLoading || isInitializing ? 'Retrying...' : 'Retry'}
      </button>
    </div>
  {/if}
  
  {#if (isLoading || isInitializing) && messages.length === 0}
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="flex flex-col items-center gap-2">
        <div class="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
        <p class="text-surface-500">Loading conversation...</p>
      </div>
    </div>
  {:else}
    <!-- Messages container with auto-scroll -->
    <div 
      class="flex-1 overflow-y-auto p-4 space-y-4"
      bind:this={messagesContainer}
    >
      {#if messages.length === 0}
        <div class="h-full flex flex-col items-center justify-center p-8">
          <div class="card p-8 max-w-md preset-tonal-surface">
            <header class="pb-4 text-center">
              <h3 class="h3">Welcome to AI Strategy Analyzer</h3>
            </header>
            <section class="space-y-4">
              <p>Ask questions about business strategies, market analysis, or competitive insights. I'm here to help with your strategic planning.</p>
              
              <div class="card p-3 variant-ghost-primary">
                <p class="text-sm font-medium">Strategy questions to analyze:</p>
                <ul class="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>What are the key components of a SWOT analysis?</li>
                  <li>How can I analyze my competitors' business models?</li>
                  <li>What market entry strategies should I consider for my startup?</li>
                </ul>
              </div>

              <div class="card p-3 variant-ghost-tertiary">
                <p class="text-sm font-medium">✨ New! Ask about current events:</p>
                <ul class="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>What are the latest business news stories today?</li>
                  <li>Search for recent market trends in artificial intelligence</li>
                  <li>What are the current challenges in the tech industry?</li>
                </ul>
              </div>
            </section>
            <footer class="pt-4 text-center text-sm text-surface-500">
              Type your question below to begin your analysis
            </footer>
          </div>
        </div>
      {:else}
        {#each messages as message (message.id)}
          <ChatMessage message={message} />
        {/each}
        
        {#if isLoading || isStreaming}
          <!-- AI typing indicator -->
          <div class="grid grid-cols-[auto_1fr] gap-2 mb-4">
            <div class="avatar flex items-start">
              <div class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-tertiary-500/20 text-tertiary-700 dark:text-tertiary-300">
                <IconBrain />
              </div>
            </div>
            
            <div class="card p-4 preset-tonal rounded-tl-none">
              <header class="flex items-center">
                <p class="font-bold">AI Assistant</p>
              </header>
              <div class="py-2">
                <div class="flex space-x-2 items-center">
                  <div class="w-2 h-2 bg-tertiary-500 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-tertiary-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div class="w-2 h-2 bg-tertiary-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      {/if}
    </div>
    
    <!-- Input area -->
    <ChatInput 
      onSend={handleMessage} 
      disabled={isLoading || isStreaming || isInitializing} 
    />
  {/if}
</div>