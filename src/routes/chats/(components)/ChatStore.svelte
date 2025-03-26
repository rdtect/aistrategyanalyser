<!-- 
  This file serves as the interface to import the chat store functionality.
  The actual implementation is in the ChatsStore.svelte.ts file.
  This approach separates the UI and logic as per Svelte 5 best practices.

  Since $effect can't be used in module scripts, we need a different approach:
  1. We'll create a proxy component that updates and exposes state
  2. We'll use reactivity to keep the values in sync
-->
<script module lang="ts">
  import * as storeModule from '$lib/services/ChatsStore.svelte.ts';
  import type { Chat, ChatContext } from '../types';
  
  // Re-export the getter functions
  export const getChatList = storeModule.getChatList;
  export const getActiveChat = storeModule.getActiveChat;
  export const getIsLoading = storeModule.getIsLoading;
  export const getError = storeModule.getError;
  
  // Re-export all methods with proper types
  export async function initialize(sampleChats: Chat[] = []) {
    return storeModule.initialize(sampleChats);
  }
  
  export async function createChat(name: string, context: ChatContext = {}) {
    return storeModule.createChat(name, context);
  }
  
  export async function setActiveChat(id: string) {
    return storeModule.setActiveChat(id);
  }
  
  export async function deleteChat(id: string) {
    return storeModule.deleteChat(id);
  }
  
  export async function addMessage(
    content: string, 
    sender: "user" | "ai" | "system" = "user", 
    chatId: string | null = null
  ) {
    return storeModule.addMessage(content, sender, chatId);
  }
  
  export async function restoreChat(backupChat: Chat) {
    return storeModule.restoreChat(backupChat);
  }
  
  // Create a singleton instance for backward compatibility
  export const chatStore = {
    initialize,
    createChat,
    setActiveChat,
    deleteChat,
    addMessage,
    restoreChat,
    get chatList() { return getChatList(); },
    get activeChat() { return getActiveChat(); },
    get isLoading() { return getIsLoading(); },
    get error() { return getError(); }
  };
</script>

<script lang="ts">
  // This is a non-visual component that helps with reactivity
  // Import the component where needed with:
  // import ChatStoreSync from './ChatStore.svelte';
  // <ChatStoreSync />
  
  // This component runs the effects to keep the store in sync
  $effect(() => {
    // This effect won't do anything visible, but it subscribes to store updates
    // which is necessary for reactivity to work in Svelte 5
    const chatList = storeModule.getChatList();
    const activeChat = storeModule.getActiveChat();
    const isLoading = storeModule.getIsLoading();
    const error = storeModule.getError();
    
    // We don't use these values, but accessing them creates subscriptions
    console.debug('ChatStore synced', { 
      chatCount: chatList.length,
      hasActiveChat: !!activeChat,
      isLoading,
      hasError: !!error 
    });
  });
</script>

<!-- No markup needed for this component -->
