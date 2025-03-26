<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { state, derived } from 'svelte';
  import { chatStore } from '../stores/ChatStore';
  import ChatMessage from './ChatMessage.svelte';
  import ChatInput from './ChatInput.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  
  // Props
  let chatId: string = $props();
  let autoScroll = true;
  let useStreaming = true;
  
  // Local state using runes
  const messagesContainerRef = $state(null);
  const isAtBottom = $state(true);
  const showScrollToBottom = $state(false);
  
  // Derived values from the store
  const chat = $derived.by(() => {
    return chatStore.chats()[chatId];
  });
  
  const messages = derived(() => {
    return chat()?.messages || [];
  });
  
  const isLoading = derived(() => {
    return chatStore.isLoading();
  });
  
  const error = derived(() => {
    return chatStore.error();
  });
  
  // Methods
  function scrollToBottom(smooth = true) {
    if (!messagesContainerRef()) return;
    
    const container = messagesContainerRef();
    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }
  
  function handleScroll() {
    if (!messagesContainerRef()) return;
    
    const container = messagesContainerRef();
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Check if we're at the bottom (with a small threshold)
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    isAtBottom.set(atBottom);
    
    // Show scroll to bottom button if not at bottom
    showScrollToBottom.set(!atBottom);
  }
  
  function dismissError() {
    chatStore.clearError();
  }
  
  // Watch for changes to messages to auto-scroll
  $: if (messages() && autoScroll && isAtBottom()) {
    // Use setTimeout to ensure DOM is updated
    setTimeout(() => scrollToBottom(), 0);
  }
  
  // Lifecycle
  onMount(() => {
    // Initial scroll to bottom
    scrollToBottom(false);
    
    // Set up scroll event listener
    if (messagesContainerRef()) {
      messagesContainerRef().addEventListener('scroll', handleScroll);
    }
    
    // Load the chat if not already loaded
    if (!chat()) {
      chatStore.refreshChat(chatId);
    }
  });
  
  onDestroy(() => {
    // Clean up scroll event listener
    if (messagesContainerRef()) {
      messagesContainerRef().removeEventListener('scroll', handleScroll);
    }
  });
</script>

<div class="flex flex-col h-full">
  {#if error()}
    <Alert variant="destructive" class="mb-4">
      <AlertDescription>
        <div class="flex justify-between items-center">
          <span>{error()}</span>
          <Button variant="ghost" size="sm" on:click={dismissError}>Dismiss</Button>
        </div>
      </AlertDescription>
    </Alert>
  {/if}
  
  <div 
    bind:this={messagesContainerRef}
    class="flex-1 overflow-y-auto p-4 space-y-4"
  >
    {#if isLoading() && !messages().length}
      <div class="flex justify-center items-center h-full">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    {:else if !messages().length}
      <div class="flex flex-col justify-center items-center h-full text-center p-4">
        <h3 class="text-xl font-semibold mb-2">No messages yet</h3>
        <p class="text-muted-foreground mb-4">
          Start a conversation by typing a message below.
        </p>
      </div>
    {:else}
      {#each messages() as message, i}
        <ChatMessage 
          message={message} 
          isLastMessage={i === messages().length - 1}
        />
      {/each}
    {/if}
  </div>
  
  {#if showScrollToBottom()}
    <div class="relative">
      <Button
        variant="outline"
        size="icon"
        class="absolute bottom-4 right-4 rounded-full shadow-md z-10"
        on:click={() => scrollToBottom()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </Button>
    </div>
  {/if}
  
  <div class="p-4 pt-0">
    <ChatInput 
      {chatId} 
      disabled={isLoading()} 
      useStreaming={useStreaming}
    />
  </div>
</div>