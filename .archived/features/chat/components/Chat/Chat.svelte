<!--
  Chat Component
  
  Main container for the chat interface that displays messages
  and provides interaction capabilities.
-->
<script lang="ts">
  import { createChatLogic } from './Chat.svelte.ts';
  import type { Chat } from '$lib/features/chat/types/chat';
  import { onMount } from 'svelte';
  
  // Import child components
  import ChatInput from '../ChatInput/ChatInput.svelte';
  import ChatMessage from '../ChatMessage/ChatMessage.svelte';
  import AITypingIndicator from '../AITypingIndicator.svelte';

  // Props
  let { variant = 'default', chat, chatId } = $props<{
    variant?: 'default' | 'sidebar';
    chat?: Chat | null;
    chatId?: string;
  }>();

  // Create chat logic
  const chatLogic = createChatLogic();
  
  // Local state
  let scrollToBottomVisible = $state(false);
  let messagesContainer: HTMLElement | null = null;
  
  // Initialize with chat or chatId
  onMount(async () => {
    if (chat?.id) {
      await chatLogic.setActiveChat(chat.id);
    } else if (chatId) {
      await chatLogic.setActiveChat(chatId);
    }
  });
  
  // Watch for prop changes and update active chat if needed
  $effect(() => {
    if (chat?.id && (!chatLogic.activeChat || chatLogic.activeChat.id !== chat.id)) {
      chatLogic.setActiveChat(chat.id);
    } else if (chatId && (!chatLogic.activeChat || chatLogic.activeChat.id !== chatId)) {
      chatLogic.setActiveChat(chatId);
    }
  });
  
  // Handle message submission from ChatInput
  function handleSendMessage(content: string) {
    chatLogic.updateMessageInput(content);
    const syntheticEvent = new Event('submit');
    chatLogic.handleSendMessage(syntheticEvent);
  }
  
  // Handle scroll to check if we should show the scroll-to-bottom button
  function handleScroll(event: Event) {
    if (!messagesContainer) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
    // Show button if scrolled up more than 300px from bottom
    scrollToBottomVisible = scrollHeight - scrollTop - clientHeight > 300;
  }
  
  // Scroll to bottom of messages
  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
  
  // Set messages container ref and add scroll event
  function setMessagesContainerRef(node: HTMLElement) {
    messagesContainer = node;
    node.addEventListener('scroll', handleScroll);
    
    return {
      destroy() {
        node.removeEventListener('scroll', handleScroll);
      }
    };
  }
</script>

<div class="h-full flex flex-col bg-surface-900 text-surface-50">
  <!-- Header with chat info -->
  {#if chatLogic.activeChat}
    <div class="border-b border-surface-700 p-1 flex justify-between items-center backdrop-blur-sm bg-surface-800/20 px-8">
      <div class="px-8">
        <h1 class="text-md font-semibold">{chatLogic.activeChat.name || 'New Analysis'}</h1>
        {#if chatLogic.activeChat.context?.company}
          <p class="text-sm text-surface-400">
            {chatLogic.activeChat.context.company}
            {#if chatLogic.activeChat.context?.industry}
              <span class="px-1">•</span>{chatLogic.activeChat.context.industry}
            {/if}
          </p>
        {/if}
      </div>
      
      <div class="flex items-center gap-2">
        <!-- Regenerate button -->
        {#if chatLogic.messages.length > 0 && !chatLogic.isLoading}
          <button 
            class="p-2 text-surface-400 hover:text-primary-400 rounded-full transition-colors flex items-center gap-1"
            aria-label="Regenerate last response"
            title="Regenerate last response"
            onclick={() => {
              // Find the last AI message
              const lastAIMessageIndex = [...chatLogic.messages].reverse().findIndex(m => m.sender === 'ai');
              if (lastAIMessageIndex !== -1) {
                const lastAIMessage = chatLogic.messages[chatLogic.messages.length - 1 - lastAIMessageIndex];
                // Find the user message before it
                const userMessageIndex = chatLogic.messages.findIndex(m => m.id === lastAIMessage.id) - 1;
                const userMessageId = userMessageIndex >= 0 && chatLogic.messages[userMessageIndex].sender === 'user' 
                  ? chatLogic.messages[userMessageIndex].id 
                  : null;
                
                chatLogic.handleRegenerateResponse(lastAIMessage.id, userMessageId);
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            <span class="hidden sm:inline">Regenerate</span>
          </button>
        {/if}
        
        <!-- Settings button -->
        <button 
          class="p-2 text-surface-400 hover:text-primary-400 rounded-full transition-colors"
          aria-label="Chat settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </button>
        
        <!-- Export button -->
        <a 
          href={chatLogic.activeChat ? `/chats/${chatLogic.activeChat.id}/export` : '#'}
          class="p-2 text-surface-400 hover:text-primary-400 rounded-full transition-colors"
          aria-label="Export chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </a>
      </div>
    </div>
  {/if}
  
  {#if chatLogic.error}
    <div class="bg-error-900/50 text-error-300 p-4 border-b border-error-700 flex justify-between items-center">
      <p class="m-0">{chatLogic.error}</p>
      <button 
        onclick={chatLogic.clearError}
        class="text-error-400 hover:text-error-300 p-1 rounded-full"
        aria-label="Close error message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  {/if}
  
  <!-- Message list container with scroll handling -->
  <div 
    class="flex-1 overflow-y-auto p-8 flex flex-col gap-4 relative bg-surface-950/20" 
    use:chatLogic.setViewport
    use:setMessagesContainerRef
  >
    {#if !chatLogic.activeChat}
      <div class="flex items-center justify-center h-full text-center text-surface-400 italic">
        <div class="flex flex-col items-center">
          <div class="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mb-2"></div>
          <p>Loading chat... {chatId || chat?.id || 'No chat ID'}</p>
        </div>
      </div>
    {:else if chatLogic.messages.length === 0}
      <div class="flex items-center justify-center h-full text-center text-surface-400 italic">
        <div class="bg-surface-800/50 p-8 rounded-lg backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-surface-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          <p class="text-lg">Start a conversation by sending a message</p>
        </div>
      </div>
    {:else}
      <!-- Use the ChatMessage component for each message -->
      {#each chatLogic.messages as message, index (message.id)}
        <ChatMessage 
          {message} 
          previousUserMessageId={index > 0 && chatLogic.messages[index - 1]?.sender === 'user' ? chatLogic.messages[index - 1].id : null}
          on:regenerate={(event) => chatLogic.handleRegenerateResponse(event.detail.messageId, event.detail.previousUserMessageId)}
        />
      {/each}
      
      <!-- Scroll to bottom button (only visible when scrolled away) -->
      {#if scrollToBottomVisible}
        <button 
          class="absolute bottom-4 right-4 w-10 h-10 bg-primary-600 hover:bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
          onclick={scrollToBottom}
          aria-label="Scroll to bottom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      {/if}
      
      <!-- Loading indicator (when applicable) -->
      {#if chatLogic.isLoading}
        <div class="flex items-center gap-2 p-4 bg-surface-800/50 rounded-lg backdrop-blur-sm self-start">
          <AITypingIndicator />
          <span class="text-sm text-surface-200">Generating response...</span>
        </div>
      {/if}
      
      <!-- Error recovery - show regenerate button if last message is an error -->
      {#if chatLogic.messages.length > 0 && chatLogic.messages[chatLogic.messages.length - 1].sender === 'system' && chatLogic.messages[chatLogic.messages.length - 1].status === 'error' && !chatLogic.isLoading}
        <div class="flex items-center justify-center mt-2">
          <button 
            class="bg-primary-700 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            onclick={() => {
              // Find the last user message
              const lastUserMessageIndex = [...chatLogic.messages].reverse().findIndex(m => m.sender === 'user');
              if (lastUserMessageIndex !== -1) {
                const lastUserMessage = chatLogic.messages[chatLogic.messages.length - 1 - lastUserMessageIndex];
                // Remove the error message
                chatLogic.handleRegenerateResponse(chatLogic.messages[chatLogic.messages.length - 1].id, lastUserMessage.id);
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            <span>Try again</span>
          </button>
        </div>
      {/if}
    {/if}
  </div>
  
  <!-- Message input area using ChatInput component -->
  <ChatInput 
    onSend={handleSendMessage}
    disabled={chatLogic.isLoading}
    initialValue={chatLogic.messageInput}
    placeholder="Type your message..."
  />
</div>
