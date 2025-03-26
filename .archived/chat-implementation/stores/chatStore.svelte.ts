/**
 * Chat Store with Svelte 5 Runes
 */
import { browser } from "$app/environment";
import { v4 as uuid } from "uuid";
import type { Chat, ChatMessage } from "../types/chat";
import { writable } from "svelte/store";
import * as storageService from "../services/storageService";

// Storage key for active chat ID (still using localStorage for this single value)
const ACTIVE_CHAT_KEY = "ai-strategy-active-chat";

// Create a traditional store for compatibility with existing code
function createChatStore() {
  // State variables using Svelte 5 runes
  let chats = $state<Record<string, Chat>>({});
  let activeChatId = $state<string | null>(null);
  let isLoading = $state(false);
  let initialized = $state(false);
  let lastSyncTime = $state<number>(0);
  let error = $state<string | null>(null);

  // Settings state
  let settings = $state({
    theme: "light",
    notifications: true,
  });

  // Initialize the database when the module loads
  if (browser) {
    storageService.initDB().catch((error) => {
      console.error("Failed to initialize IndexedDB:", error);
    });
  }

  // Private storage functions - using IndexedDB now
  async function saveToStorage(newChats: Record<string, Chat>) {
    if (!browser) return;
    try {
      // Save all chats to IndexedDB
      await storageService.saveChats(newChats);

      lastSyncTime = Date.now();
      window.dispatchEvent(new Event("userChatsUpdated"));
    } catch (error) {
      console.error("Failed to save chats to IndexedDB:", error);
    }
  }

  async function loadFromStorage(): Promise<Record<string, Chat>> {
    if (!browser) return {};

    try {
      // Get all chats from IndexedDB
      const chatArray = await storageService.getAllChats();

      // Convert to Record format
      const chatRecord: Record<string, Chat> = {};
      chatArray.forEach((chat) => {
        if (chat && chat.id) {
          chatRecord[chat.id] = chat;
        }
      });

      return chatRecord;
    } catch (error) {
      console.error("Failed to load chats from IndexedDB:", error);
      return {};
    }
  }

  // Initialize the store
  async function init(initialChats: Chat[] = []) {
    if (initialized || !browser) return true;

    try {
      // Load existing chats from storage
      const storedChats = await loadFromStorage();

      // Save initial chats to IndexedDB if they don't exist
      // This ensures sample chats are properly persisted
      if (initialChats && initialChats.length > 0) {
        console.log(`Checking ${initialChats.length} initial chats for storage`);
        for (const chat of initialChats) {
          // Check if we have this chat already before saving
          const existingChat = await storageService.getChat(chat.id);
          if (!existingChat) {
            // Ensure the chat has a properly structured context
            const chatToSave = {
              ...chat,
              context: chat.context || {
                company: "",
                industry: "",
                region: "",
                additionalInfo: "",
              },
              // Ensure timestamps are strings
              createdAt:
                typeof chat.createdAt === "string"
                  ? chat.createdAt
                  : new Date().toISOString(),
              updatedAt:
                typeof chat.updatedAt === "string"
                  ? chat.updatedAt
                  : new Date().toISOString(),
            };

            // Save to IndexedDB
            console.log(`Saving initial chat ${chat.id} to IndexedDB`);
            await storageService.saveChat(chatToSave);

            // Update storedChats to include this chat
            storedChats[chat.id] = chatToSave;
          }
        }
      }

      // Set the state with stored chats (which now include any newly saved initial chats)
      chats = storedChats;
      activeChatId = browser ? localStorage.getItem(ACTIVE_CHAT_KEY) : null;
      initialized = true;

      return true;
    } catch (error) {
      console.error("Error initializing chat store:", error);
      return false;
    }
  }

  // Get active chat using a function to avoid reference issues
  function getActiveChat() {
    return activeChatId ? chats[activeChatId] : null;
  }

  // Create the store object with methods
  const store = {
    // Helper method for components
    async ensureInitialized(initialChats: Chat[] = []) {
      if (!initialized) {
        return init(initialChats);
      }
      return true;
    },

    /**
     * Initialize the store with optional initial data
     */
    async initialize(initialChats: Chat[] = []): Promise<boolean> {
      return init(initialChats);
    },

    /**
     * Create a new chat
     */
    async createNewChat(
      name = "New Analysis",
      contextData?: string,
      existingId?: string
    ): Promise<string> {
      // Generate a new ID or use the provided one
      const chatId = existingId || uuid();
      
      // Parse context data if provided
      let context = {
        company: "",
        industry: "",
        region: "",
        additionalInfo: "",
      };
      
      if (contextData) {
        try {
          const parsedContext = JSON.parse(contextData);
          context = {
            ...context,
            ...parsedContext
          };
        } catch (e) {
          console.error("Failed to parse context data:", e);
          // Use default context
        }
      }

      const newChat: Chat = {
        id: chatId,
        name,
        context,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log(`Creating new chat: ${chatId} - ${name}`);

      // Update local state
      chats = { ...chats, [chatId]: newChat };

      // Save to storage
      await saveToStorage(chats);
      
      // Set as active chat
      this.setActiveChat(chatId);
      
      console.log(`New chat created and set as active: ${chatId}`);

      return chatId;
    },

    /**
     * Create a chat (alias for createNewChat for backward compatibility)
     */
    createChat(name = "New Analysis", contextData?: string, existingId?: string): string {
      const id = this.createNewChat(name, contextData, existingId);
      return id instanceof Promise ? "" : id;
    },

    /**
     * Delete a chat
     */
    async deleteChat(id: string) {
      const { [id]: _, ...remainingChats } = chats;

      // Update local state
      chats = remainingChats;

      if (activeChatId === id) {
        this.setActiveChat(null);
      }

      // Save changes to storage
      await saveToStorage(chats);

      // Delete from IndexedDB directly (for good measure)
      await storageService.deleteChat(id);
    },

    /**
     * Update a chat with new data
     */
    async updateChat(id: string, updates: Partial<Chat>) {
      if (!chats[id]) return;

      // Update local state
      chats = {
        ...chats,
        [id]: {
          ...chats[id],
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      };

      // Save changes to storage
      await saveToStorage(chats);
    },

    /**
     * Send a message and get AI response
     */
    async sendMessage(content: string): Promise<boolean> {
      if (!content.trim()) {
        return false;
      }

      const currentActiveChat = getActiveChat();
      if (!activeChatId || !currentActiveChat) {
        return false;
      }

      try {
        isLoading = true;
        error = null;

        // Create user message
        const userMessage: ChatMessage = {
          id: uuid(),
          content,
          sender: "user",
          timestamp: new Date().toISOString(),
        };

        // Add user message to chat
        const updatedChat: Chat = {
          ...currentActiveChat,
          messages: [...currentActiveChat.messages, userMessage],
          updatedAt: new Date().toISOString(),
        };

        // Update chat in state
        chats = {
          ...chats,
          [activeChatId]: updatedChat,
        };

        // Save changes to storage
        await saveToStorage(chats);

        // TODO: Get AI response (in Phase 2)
        // For now, just add a placeholder AI response
        setTimeout(async () => {
          const currentChat = getActiveChat();
          if (activeChatId && currentChat) {
            const aiMessage: ChatMessage = {
              id: uuid(),
              content: `AI response to: ${content}`,
              sender: "ai",
              timestamp: new Date().toISOString(),
            };

            const chatWithAiResponse: Chat = {
              ...currentChat,
              messages: [...currentChat.messages, aiMessage],
              updatedAt: new Date().toISOString(),
            };

            chats = {
              ...chats,
              [activeChatId]: chatWithAiResponse,
            };

            // Save changes to storage
            await saveToStorage(chats);
            isLoading = false;
          }
        }, 1000);

        return true;
      } catch (err) {
        error = err instanceof Error ? err.message : "Failed to send message";
        isLoading = false;
        console.error("Error sending message:", err);
        return false;
      }
    },

    setActiveChat(id: string | null) {
      activeChatId = id;
      if (browser) {
        if (id) {
          localStorage.setItem(ACTIVE_CHAT_KEY, id);
        } else {
          localStorage.removeItem(ACTIVE_CHAT_KEY);
        }
      }
    },

    /**
     * Select a chat (alias for setActiveChat for backward compatibility)
     */
    selectChat(id: string): boolean {
      if (chats[id]) {
        this.setActiveChat(id);
        return true;
      }
      return false;
    },

    /**
     * Clear any errors
     */
    clearError(): void {
      error = null;
    },

    // Cleanup method for proper disposal
    cleanup() {
      // Any cleanup logic when store is destroyed
      // Currently just a placeholder
    },

    // Getter methods that return functions to access the state
    getChats() {
      return chats;
    },
    
    getActiveChatId() {
      return activeChatId;
    },
    
    getActiveChat() {
      return getActiveChat();
    },
    
    getMessages() {
      return getActiveChat()?.messages || [];
    },
    
    getSortedChats() {
      return Object.values(chats).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    },
    
    getIsLoading() {
      return isLoading;
    },
    
    getError() {
      return error;
    },

    // Subscribe method for compatibility with Svelte stores
    subscribe(callback: (value: any) => void) {
      // Create a function to get the current state
      const getValue = () => ({
        chats,
        activeChatId,
        activeChat: getActiveChat(),
        messages: getActiveChat()?.messages || [],
        sortedChats: Object.values(chats).sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
        isLoading,
        error,
        settings
      });
      
      // Call the callback with the initial value
      callback(getValue());
      
      // Set up an effect to call the callback whenever any of the state changes
      const unsubscribe = $effect.root(() => {
        $effect(() => {
          callback(getValue());
        });
      });
      
      // Return an unsubscribe function
      return () => {
        unsubscribe();
      };
    }
  };

  return store;
}

// Create a singleton instance of the store
export const chatStore = createChatStore();

// Compatibility functions
export function getChatStore() {
  return chatStore;
}

export function getCurrentChat() {
  return chatStore.getActiveChat();
}

export function getMessages() {
  return chatStore.getMessages();
}

export function getSortedChats() {
  return chatStore.getSortedChats();
}

// Export actions for backward compatibility
export const actions = {
  initialize: chatStore.initialize.bind(chatStore),
  createNewChat: chatStore.createNewChat.bind(chatStore),
  createChat: chatStore.createChat.bind(chatStore),
  deleteChat: chatStore.deleteChat.bind(chatStore),
  updateChat: chatStore.updateChat.bind(chatStore),
  sendMessage: chatStore.sendMessage.bind(chatStore),
  setActiveChat: chatStore.setActiveChat.bind(chatStore),
  selectChat: chatStore.selectChat.bind(chatStore),
  clearError: chatStore.clearError.bind(chatStore)
};
