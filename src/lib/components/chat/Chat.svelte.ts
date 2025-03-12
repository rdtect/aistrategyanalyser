import { generateAIResponse } from '$lib/services/aiService';
import { marked } from 'marked';
import { sampleChats, type Chat, type Message } from '$lib/data/sampleChats';
import { writable, derived, get, type Readable } from 'svelte/store';

// Create stores for state management
const chatsStore = writable<Chat[]>(sampleChats);
const currentChatIdStore = writable<number>(0);
const isLoadingStore = writable<boolean>(false);

// Create derived stores
const currentChatStore = derived(
    [chatsStore, currentChatIdStore],
    ([$chats, $currentChatId]) => $chats.find(chat => chat.id === $currentChatId)
);

const messagesStore = derived(
    currentChatStore,
    ($currentChat) => $currentChat?.messages || []
);

/**
 * Formats a plain text message with markdown
 * @param text - The text to format
 * @returns HTML formatted message
 */
function formatMessage(text: string): string {
    try {
        return marked.parse(text) as string;
    } catch (error) {
        console.error('Error parsing markdown:', error);
        return text;
    }
}

/**
 * Returns a timestamp string for the current time
 * @returns Formatted timestamp string
 */
function getTimestamp(): string {
    return new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Generates a new message ID for the current chat
 */
function generateMessageId(): number {
    const messages = get(messagesStore);
    return messages.length ? Math.max(...messages.map(m => m.id)) + 1 : 0;
}

/**
 * Switches to a different chat session
 * @param id - ID of the chat to switch to
 */
function switchChat(id: number): void {
    currentChatIdStore.set(id);
}

/**
 * Handles submission of a new message
 * Adds the user message to the chat and generates an AI response
 * @param messageContent - Content of the user's message
 */
async function handleMessageSubmit(messageContent: string): Promise<void> {
    const currentChat = get(currentChatStore);
    if (!messageContent.trim() || !currentChat) return;

    // Create user message
    const userMessage: Message = {
        id: generateMessageId(),
        content: messageContent,
        sender: 'user',
        timestamp: getTimestamp(),
        status: 'sending'
    };

    // Update chat with user message
    const currentChatId = get(currentChatIdStore);
    chatsStore.update(chats => 
        chats.map(chat => 
            chat.id === currentChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat
        )
    );

    isLoadingStore.set(true);

    try {
        const aiResponse = await generateAIResponse(currentChat, messageContent);
        const formattedResponse = formatMessage(aiResponse);

        const aiMessage: Message = {
            id: generateMessageId(),
            content: formattedResponse,
            sender: 'ai',
            timestamp: getTimestamp(),
            status: 'sent'
        };

        // Update chat with AI response
        chatsStore.update(chats => 
            chats.map(chat => 
                chat.id === currentChatId ? { ...chat, messages: [...chat.messages, aiMessage] } : chat
            )
        );
    } catch (error) {
        console.error('Error generating AI response:', error);
    } finally {
        isLoadingStore.set(false);
    }
}

/**
 * Creates a new chat session
 * @param name - Name for the new chat
 */
function createNewChat(name: string): void {
    const chats = get(chatsStore);
    const newChat: Chat = {
        id: Math.max(...chats.map((c) => c.id)) + 1,
        name,
        messages: [],
        createdAt: new Date().toISOString()
    };

    chatsStore.update(chats => [...chats, newChat]);
    currentChatIdStore.set(newChat.id);
}

/**
 * Deletes a chat session
 * @param id - ID of the chat to delete
 */
function deleteChat(id: number): void {
    const currentId = get(currentChatIdStore);
    
    chatsStore.update(chats => chats.filter(chat => chat.id !== id));
    
    if (currentId === id) {
        const updatedChats = get(chatsStore);
        currentChatIdStore.set(updatedChats[0]?.id || 0);
    }
}

// Export the chatManager with all required properties and methods
export const chatManager = {
    // Methods
    switchChat,
    handleMessageSubmit,
    createNewChat,
    deleteChat,
    formatMessage,
    getTimestamp
};

// Export stores separately for reactive access
export const chats = chatsStore;
export const currentChatId = currentChatIdStore;
export const isLoading = isLoadingStore;
export const messages = messagesStore;
export const currentChat = currentChatStore;
