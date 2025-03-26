/**
 * Unified Chat Store with Svelte 5 Runes
 *
 * Single source of truth for all chat-related state and operations
 */
import { browser } from "$app/environment";
import { v4 as uuid } from "uuid";
import type { Chat, ChatMessage } from "../types/chat";

// Storage keys
const STORAGE_KEY = "ai-strategy-chats";
const ACTIVE_CHAT_KEY = "ai-strategy-active-chat";

// Core chat state
export interface ChatState {
  chats: Record<string, Chat>;
  currentChatId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Initialize state with $state rune
export const chatState = $state<ChatState>({
  chats: {},
  currentChatId: null,
  isLoading: false,
  error: null,
});

// Derived values with $derived rune - private
const currentChat = $derived(() =>
  chatState.currentChatId ? chatState.chats[chatState.currentChatId] : null,
);

const messages = $derived(() => currentChat?.messages || []);

const sortedChats = $derived(() =>
  Object.values(chatState.chats).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  ),
);

// Getter functions to expose the derived values
export function getCurrentChat() {
  return currentChat;
}

export function getMessages() {
  return messages;
}

export function getSortedChats() {
  return sortedChats;
}

/**
 * Actions - All chat operations are defined here
 */
export const actions = {
  /**
   * Initialize the store from storage
   */
  async initialize() {
    if (!browser) return;

    try {
      // Load chats from storage
      const storedChats = loadFromStorage();
      if (storedChats && Object.keys(storedChats).length > 0) {
        chatState.chats = storedChats;
      }

      // Load active chat ID
      const activeId = localStorage.getItem(ACTIVE_CHAT_KEY);
      if (activeId && chatState.chats[activeId]) {
        chatState.currentChatId = activeId;
      } else if (Object.keys(chatState.chats).length > 0) {
        // Default to first chat if active ID is invalid
        chatState.currentChatId = Object.keys(chatState.chats)[0];
      }
    } catch (err) {
      chatState.error =
        err instanceof Error ? err.message : "Failed to initialize";
      console.error("Failed to initialize chat store:", err);
    }
  },

  /**
   * Create a new chat
   */
  createChat(name: string = "New Analysis", company?: string): string {
    const id = uuid();
    const newChat: Chat = {
      id,
      name,
      company,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update state
    chatState.chats = { ...chatState.chats, [id]: newChat };
    chatState.currentChatId = id;

    return id;
  },

  /**
   * Delete a chat
   */
  deleteChat(id: string): void {
    if (!chatState.chats[id]) return;

    // Create new object without the deleted chat
    const { [id]: _, ...remainingChats } = chatState.chats;
    chatState.chats = remainingChats;

    // Update current chat if needed
    if (chatState.currentChatId === id) {
      chatState.currentChatId = Object.keys(remainingChats)[0] || null;
    }
  },

  /**
   * Select a different chat
   */
  selectChat(id: string): boolean {
    if (chatState.chats[id]) {
      chatState.currentChatId = id;
      return true;
    }
    return false;
  },

  /**
   * Send a message and get AI response
   */
  async sendMessage(content: string): Promise<boolean> {
    if (!content.trim() || !chatState.currentChatId || !currentChat) {
      return false;
    }

    try {
      chatState.isLoading = true;
      chatState.error = null;

      // Create user message
      const userMessage: ChatMessage = {
        id: uuid(),
        content,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      // Add user message to chat
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, userMessage],
        updatedAt: new Date().toISOString(),
      };

      // Update chat in state
      chatState.chats = {
        ...chatState.chats,
        [chatState.currentChatId]: updatedChat,
      };

      // TODO: Get AI response (in Phase 2)
      // For now, just add a placeholder AI response
      setTimeout(() => {
        if (chatState.currentChatId && currentChat) {
          const aiMessage: ChatMessage = {
            id: uuid(),
            content: `AI response to: ${content}`,
            sender: "ai",
            timestamp: new Date().toISOString(),
          };

          const chatWithAiResponse = {
            ...currentChat,
            messages: [...currentChat.messages, aiMessage],
            updatedAt: new Date().toISOString(),
          };

          chatState.chats = {
            ...chatState.chats,
            [chatState.currentChatId]: chatWithAiResponse,
          };

          chatState.isLoading = false;
        }
      }, 1000);

      return true;
    } catch (err) {
      chatState.error =
        err instanceof Error ? err.message : "Failed to send message";
      chatState.isLoading = false;
      console.error("Error sending message:", err);
      return false;
    }
  },

  /**
   * Update a chat's metadata
   */
  updateChat(id: string, updates: Partial<Chat>): boolean {
    if (!chatState.chats[id]) return false;

    chatState.chats = {
      ...chatState.chats,
      [id]: {
        ...chatState.chats[id],
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    };

    return true;
  },

  /**
   * Clear any errors
   */
  clearError(): void {
    chatState.error = null;
  },
};

// Helper functions for persistence
function saveToStorage(chats: Record<string, Chat>): void {
  if (!browser) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.values(chats)));
  } catch (error) {
    console.error("Failed to save chats to localStorage:", error);
  }
}

function loadFromStorage(): Record<string, Chat> {
  if (!browser) return {};

  try {
    const chatsJson = localStorage.getItem(STORAGE_KEY);
    if (!chatsJson) return {};

    const parsedData = JSON.parse(chatsJson);
    // Ensure we have an array before calling reduce
    const chatsArray = Array.isArray(parsedData) ? parsedData : [];

    return chatsArray.reduce(
      (acc, chat) => ({
        ...acc,
        [chat.id]: chat,
      }),
      {},
    );
  } catch (error) {
    console.error("Failed to load chats from localStorage:", error);
    return {};
  }
}

// Set up persistence without using $effect at module level
function setupPersistence() {
  if (browser) {
    // Initialize the store when this module is first imported
    actions.initialize();

    // Set up manual persistence instead of using $effect
    const saveState = () => {
      saveToStorage(chatState.chats);
      if (chatState.currentChatId) {
        localStorage.setItem(ACTIVE_CHAT_KEY, chatState.currentChatId);
      } else {
        localStorage.removeItem(ACTIVE_CHAT_KEY);
      }
    };

    // Create a proxy to intercept state changes
    const originalUpdateChat = actions.updateChat;
    const originalCreateChat = actions.createChat;
    const originalDeleteChat = actions.deleteChat;
    const originalSelectChat = actions.selectChat;
    const originalSendMessage = actions.sendMessage;

    // Override actions to trigger persistence
    actions.updateChat = (id, updates) => {
      const result = originalUpdateChat(id, updates);
      saveState();
      return result;
    };

    actions.createChat = (name, company) => {
      const result = originalCreateChat(name, company);
      saveState();
      return result;
    };

    actions.deleteChat = (id) => {
      originalDeleteChat(id);
      saveState();
    };

    actions.selectChat = (id) => {
      const result = originalSelectChat(id);
      saveState();
      return result;
    };

    actions.sendMessage = async (content) => {
      const result = await originalSendMessage(content);
      saveState();
      return result;
    };
  }
}

// Run setup
setupPersistence();

// Export for backwards compatibility
export function getChatStore() {
  // Create a list of subscribers
  let subscribers: Array<(value: ChatState) => void> = [];

  // Setup an effect at the module level
  $effect(() => {
    const state = {
      chats: chatState.chats,
      currentChatId: chatState.currentChatId,
      isLoading: chatState.isLoading,
      error: chatState.error,
    };

    // Notify all subscribers
    subscribers.forEach((callback) => callback(state));
  });

  return {
    // Expose reactive state
    subscribe: (callback: (value: ChatState) => void) => {
      subscribers.push(callback);

      // Call once immediately with current state
      callback({
        chats: chatState.chats,
        currentChatId: chatState.currentChatId,
        isLoading: chatState.isLoading,
        error: chatState.error,
      });

      // Return unsubscribe function
      return () => {
        subscribers = subscribers.filter((cb) => cb !== callback);
      };
    },

    // Expose actions
    ...actions,

    // Expose derived values for compatibility
    get chats() {
      return chatState.chats;
    },
    get currentChatId() {
      return chatState.currentChatId;
    },
    get currentChat() {
      return currentChat;
    },
    get messages() {
      return messages;
    },
    get sortedChats() {
      return sortedChats;
    },
    get isLoading() {
      return chatState.isLoading;
    },
    get error() {
      return chatState.error;
    },

    // Legacy support
    cleanup() {},
    ensureInitialized: actions.initialize,
  };
}
