<script lang="ts">
    import { getContext } from 'svelte';
    import type { ChatStore } from '$lib/stores/chatStore.svelte';
    import type { Chat } from '$lib/types/chat';
    import ChatMessage from './ChatMessage.svelte';
    import ChatInput from './ChatInput.svelte';
    import { onMount, onDestroy } from 'svelte';

    // Get the chat store directly with no type checking first, for safety
    const chatStore = getContext('chatStore') as ChatStore;
    
    // Break dependency chain by using direct access in derived calculations
    const chats = $derived.by(() => chatStore?.chats || []);
    const currentChatId = $derived.by(() => chatStore?.currentChatId || null);
    const isLoading = $derived.by(() => chatStore?.isLoading || false);
    const status = $derived.by(() => chatStore?.status || { openai: { connected: false } });
    
    // Compute derived values through chainable calculations
    const currentChat = $derived.by(() => {
        if (!currentChatId) return null;
        return chats.find(chat => chat.id === currentChatId) || null;
    });
    
    const messages = $derived.by(() => currentChat?.messages || []);
    
    // Track error state for better user feedback - use objects instead of primitives
    const errorState = $state({ 
        hasError: false, 
        message: '' 
    });
    
    // Handle message submission with proper error handling
    async function handleMessageSubmit(message: string): Promise<void> {
        if (!chatStore) {
            errorState.hasError = true;
            errorState.message = 'Chat store not available';
            console.error('Chat store not available');
            return;
        }
        
        try {
            if (!message || message.trim() === '') {
                return;
            }
            await chatStore.handleMessageSubmit(message);
        } catch (error) {
            errorState.hasError = true;
            errorState.message = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error handling message:', error);
        }
    }

    // Custom event handler that adapts CustomEvent to the function signature
    function handleMessageEvent(event: CustomEvent<string>): void {
        handleMessageSubmit(event.detail);
    }

    // Functions to interact with the store - create wrapper functions with null checks
    function switchChat(id: string): void {
        if (!chatStore) return;
        chatStore.switchChat(id);
    }

    function createNewChat(options: any): Promise<string> {
        if (!chatStore) return Promise.resolve('');
        return chatStore.createNewChat(options);
    }

    function deleteChat(id: string): void {
        if (!chatStore) return;
        chatStore.deleteChat(id);
    }

    function exportToMarkdown() {
        if (!chatStore) return;
        chatStore.exportToMarkdown();
    }

    function updateModel(model: string): Promise<void> {
        if (!chatStore) return Promise.resolve();
        return chatStore.updateModel(model);
    }

    function checkApiStatus(): Promise<any> {
        if (!chatStore) return Promise.resolve({ openai: { connected: false } });
        return chatStore.checkApiStatus();
    }

    // Track component lifecycle
    const componentId = Math.random().toString(36).substring(7);
    
    onMount(() => {
        console.log(`[ChatDisplay ${componentId}] MOUNTED`);
        return () => {
            console.log(`[ChatDisplay ${componentId}] UNMOUNTED`);
        };
    });
</script>

<div class="h-full flex flex-col">
    {#if errorState.hasError}
        <div class="error-message p-4 bg-red-100 text-red-800 rounded m-4">
            <h3 class="font-bold">Error</h3>
            <p>{errorState.message || 'An error occurred'}</p>
            <button 
                class="mt-2 px-3 py-1 bg-red-600 text-white rounded"
                onclick={() => { 
                    errorState.hasError = false; 
                    errorState.message = ''; 
                }}
            >
                Dismiss
            </button>
        </div>
    {/if}
    
    {#if !chatStore}
        <div class="p-4 bg-red-100 text-red-800 rounded m-4">
            <h3 class="font-bold">Chat service unavailable</h3>
            <p>Please refresh the page or check your connection.</p>
        </div>
    {:else if messages.length === 0}
        <div class="flex-1 flex flex-col items-center justify-center">
            <h2 class="text-xl font-bold mb-2">Start a conversation</h2>
            <p class="text-surface-600 mb-4">Type a message below to begin chatting</p>
            
            <div class="chat-status text-sm">
                <span class={status?.openai?.connected ? 'text-green-500' : 'text-red-500'}>
                    API Status: {status?.openai?.connected ? 'Connected' : 'Disconnected'}
                </span>
            </div>
        </div>
    {:else}
        <div class="flex-1 overflow-y-auto p-4">
            {#each messages as message}
                <ChatMessage {message} />
            {/each}
        </div>
    {/if}
    
    <div class="p-4 border-t">
        <ChatInput 
            onMessageSubmit={handleMessageSubmit}
            chatId={currentChatId || ''}
            disabled={isLoading} 
        />
    </div>
</div>

<style>
    /* Remove unused selectors or update your HTML to use them */
    /* .chat-container and .chat-history are not used in the HTML */
</style> 