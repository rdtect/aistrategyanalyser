// Export main components
export { default as Chat } from './Chat.svelte';
export { default as ChatInput } from './ChatInput.svelte';
export { default as ChatSidebar } from './ChatSidebar.svelte';

// Export types and utilities 
export type { Message } from '$lib/data/sampleChats'; 

// Export chat manager and stores
export { chatManager, chats, currentChatId, isLoading, messages, currentChat } from './Chat.svelte.ts';

// Constants and utilities
export const CHAT_EVENTS = {
    MESSAGE_SENT: 'message:sent',
    CHAT_SWITCHED: 'chat:switched',
    NEW_CHAT: 'chat:new'
} as const;

// Chat utility functions
export const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
    });
};

export const generateChatName = (topic: string, category?: string, region?: string): string => {
    return `${topic}${category ? ` - ${category}` : ''}${region ? ` (${region})` : ''}`;
};

export const validateMessage = (content: string): boolean => {
    return content.trim().length > 0;
};
