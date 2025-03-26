/**
 * ChatStore - Svelte 5 runes-based store for chat state management
 * Provides a centralized way to manage chat data across components
 */

import type { Chat, ChatMessage, ChatContext } from "../types/chat";
import { ChatStorageManager } from "../services/ChatStorageManager";
import { aiClientService } from "../services/aiClientService";
import { browser } from "$app/environment";

/**
 * ChatStore class using Svelte 5 runes for state management
 */
export class ChatStore {
  // Storage manager instance
  private storageManager = new ChatStorageManager();
  
  // State runes for reactive data
  chats = $state<Record<string, Chat>>({});
  activeChat = $state<string | null>(null);
  isLoading = $state<boolean>(false);
  error = $state<string | null>(null);
  
  // Derived runes for computed values
  activeChatData = $derived.by(() => {
    const chatId = this.activeChat;
    return chatId ? this.chats[chatId] : null;
  });
  
  sortedChats = $derived.by(() => {
    const chatEntries = Object.values(this.chats);
    return chatEntries.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA; // Sort by most recent first
    });
  });

  /**
   * Initialize the store and load chats from storage
   */
  constructor() {
    $effect(() => {
      if (browser) {
        this.loadChats();
  
        // Listen for storage updates from other tabs/components
        window.addEventListener("userChatsUpdated", (event) => {
          const detail = (event as CustomEvent).detail;
          if (detail?.chatId) {
            this.refreshChat(detail.chatId);
          } else {
            this.loadChats();
          }
        });
        
        // Clean up event listener when effect is destroyed
        return () => {
          window.removeEventListener("userChatsUpdated", () => {});
        };
      }
    });
  }

  /**
   * Load all chats from storage
   */
  async loadChats(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;

      const chats = await this.storageManager.getAllChats();
      const chatsMap: Record<string, Chat> = {};

      chats.forEach((chat) => {
        chatsMap[chat.id] = chat;
      });

      this.chats = chatsMap;
      this.isLoading = false;
    } catch (error) {
      console.error("Error loading chats:", error);
      this.error = "Failed to load chats";
      this.isLoading = false;
    }
  }

  /**
   * Refresh a specific chat from storage
   */
  async refreshChat(chatId: string): Promise<void> {
    try {
      const chat = await this.storageManager.getChat(chatId);
      if (chat) {
        const updatedChats = { ...this.chats };
        updatedChats[chatId] = chat;
        this.chats = updatedChats;
      }
    } catch (error) {
      console.error(`Error refreshing chat ${chatId}:`, error);
    }
  }

  /**
   * Set the active chat
   */
  setActiveChat(chatId: string | null): void {
    this.activeChat = chatId;
  }

  /**
   * Create a new chat
   */
  async createChat(name: string, context: ChatContext): Promise<string> {
    try {
      this.isLoading = true;

      const chatId = crypto.randomUUID();
      const now = new Date().toISOString();

      const newChat: Chat = {
        id: chatId,
        name,
        context,
        createdAt: now,
        updatedAt: now,
        messages: [],
      };

      await this.storageManager.saveChat(newChat);

      // Update local state
      const updatedChats = { ...this.chats };
      updatedChats[chatId] = newChat;
      this.chats = updatedChats;

      this.isLoading = false;
      return chatId;
    } catch (error) {
      console.error("Error creating chat:", error);
      this.error = "Failed to create chat";
      this.isLoading = false;
      throw error;
    }
  }

  /**
   * Delete a chat
   */
  async deleteChat(chatId: string): Promise<void> {
    try {
      this.isLoading = true;

      await this.storageManager.deleteChat(chatId);

      // Update local state
      const updatedChats = { ...this.chats };
      delete updatedChats[chatId];
      this.chats = updatedChats;

      // If the deleted chat was active, clear the active chat
      if (this.activeChat === chatId) {
        this.activeChat = null;
      }

      this.isLoading = false;
    } catch (error) {
      console.error(`Error deleting chat ${chatId}:`, error);
      this.error = "Failed to delete chat";
      this.isLoading = false;
    }
  }

  /**
   * Update chat name
   */
  async updateChatName(chatId: string, name: string): Promise<void> {
    try {
      const chat = this.chats[chatId];
      if (!chat) return;

      const updatedChat = {
        ...chat,
        name,
        updatedAt: new Date().toISOString(),
      };
      await this.storageManager.saveChat(updatedChat);

      // Update local state
      const updatedChats = { ...this.chats };
      updatedChats[chatId] = updatedChat;
      this.chats = updatedChats;
    } catch (error) {
      console.error(`Error updating chat name for ${chatId}:`, error);
      this.error = "Failed to update chat name";
    }
  }

  /**
   * Update chat context
   */
  async updateChatContext(chatId: string, context: ChatContext): Promise<void> {
    try {
      const chat = this.chats[chatId];
      if (!chat) return;

      const updatedChat = {
        ...chat,
        context,
        updatedAt: new Date().toISOString(),
      };

      await this.storageManager.saveChat(updatedChat);

      // Update local state
      const updatedChats = { ...this.chats };
      updatedChats[chatId] = updatedChat;
      this.chats = updatedChats;
    } catch (error) {
      console.error(`Error updating context for chat ${chatId}:`, error);
      this.error = "Failed to update chat context";
    }
  }

  /**
   * Send a user message and get AI response
   */
  async sendMessage(chatId: string, content: string): Promise<void> {
    try {
      const chat = this.chats[chatId];
      if (!chat) {
        throw new Error(`Chat ${chatId} not found`);
      }

      // Create user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        sender: "user",
        timestamp: new Date().toISOString(),
        status: "sent",
      };

      // Add user message to chat
      const updatedChat = await this.storageManager.addMessageToChat(
        chatId,
        userMessage,
      );
      if (!updatedChat) {
        throw new Error("Failed to add message to chat");
      }

      // Update local state with user message
      const localUpdatedChats = { ...this.chats };
      localUpdatedChats[chatId] = updatedChat;
      this.chats = localUpdatedChats;

      // Create AI thinking message
      const thinkingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: "",
        sender: "ai",
        timestamp: new Date().toISOString(),
        status: "thinking",
      };

      // Add thinking message to chat
      const chatWithThinking = await this.storageManager.addMessageToChat(
        chatId,
        thinkingMessage,
      );
      if (chatWithThinking) {
        // Update local state with thinking message
        const localUpdatedChats = { ...this.chats };
        localUpdatedChats[chatId] = chatWithThinking;
        this.chats = localUpdatedChats;
      }

      try {
        // Generate AI response
        const aiMessage = await aiClientService.generateAIResponse(
          updatedChat,
          content,
        );

        // Replace thinking message with actual response
        const finalChat = await this.storageManager.addMessageToChat(
          chatId,
          aiMessage,
        );
        if (finalChat) {
          // Update local state with AI response
          const localUpdatedChats = { ...this.chats };
          localUpdatedChats[chatId] = finalChat;
          this.chats = localUpdatedChats;
        }
      } catch (error) {
        console.error("Error generating AI response:", error);

        // Create error message
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          content:
            "Sorry, I encountered an error while generating a response. Please try again.",
          sender: "system",
          timestamp: new Date().toISOString(),
          status: "error",
        };

        // Add error message to chat
        const chatWithError = await this.storageManager.addMessageToChat(
          chatId,
          errorMessage,
        );
        if (chatWithError) {
          // Update local state with error message
          const localUpdatedChats = { ...this.chats };
          localUpdatedChats[chatId] = chatWithError;
          this.chats = localUpdatedChats;
        }

        this.error = "Failed to generate AI response";
      }
    } catch (error) {
      console.error(`Error sending message in chat ${chatId}:`, error);
      this.error = "Failed to send message";
    }
  }

  /**
   * Stream an AI response for real-time display
   */
  async streamMessage(
    chatId: string,
    content: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    try {
      const chat = this.chats[chatId];
      if (!chat) {
        throw new Error(`Chat ${chatId} not found`);
      }

      // Create user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        sender: "user",
        timestamp: new Date().toISOString(),
        status: "sent",
      };

      // Add user message to chat
      const updatedChat = await this.storageManager.addMessageToChat(
        chatId,
        userMessage,
      );
      if (!updatedChat) {
        throw new Error("Failed to add message to chat");
      }

      // Update local state with user message
      this.chats = {
        ...this.chats,
        [chatId]: updatedChat
      };

      // Create streaming message placeholder
      const streamingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: "",
        sender: "ai",
        timestamp: new Date().toISOString(),
        status: "streaming",
      };

      // Add streaming message to chat
      const chatWithStreaming = await this.storageManager.addMessageToChat(
        chatId,
        streamingMessage,
      );
      if (chatWithStreaming) {
        // Update local state with streaming message
        this.chats = {
          ...this.chats,
          [chatId]: chatWithStreaming
        };
      }

      try {
        // Stream AI response
        const aiMessage = await aiClientService.streamAIResponse(
          updatedChat,
          content,
          (chunk) => {
            // Update the streaming message content in local state
            const currentChat = this.chats[chatId];

            if (currentChat && Array.isArray(currentChat.messages)) {
              const lastMessageIndex = currentChat.messages.length - 1;
              if (lastMessageIndex >= 0) {
                const lastMessage = currentChat.messages[lastMessageIndex];
                if (lastMessage.status === "streaming") {
                  // Create a new messages array with the updated content
                  const updatedMessages = [...currentChat.messages];
                  updatedMessages[lastMessageIndex] = {
                    ...lastMessage,
                    content: lastMessage.content + chunk,
                  };
                  
                  // Update the chat with the new messages array
                  this.chats = {
                    ...this.chats,
                    [chatId]: {
                      ...currentChat,
                      messages: updatedMessages
                    }
                  };

                  // Call the callback with the chunk
                  onChunk(chunk);
                }
              }
            }
          },
        );

        // Update the final message in storage
        const finalChat = await this.storageManager.addMessageToChat(chatId, {
          ...aiMessage,
          status: "sent",
        });

        if (finalChat) {
          // Update local state with completed AI response
          this.chats = {
            ...this.chats,
            [chatId]: finalChat
          };
        }
      } catch (error) {
        console.error("Error streaming AI response:", error);

        // Create error message
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          content:
            "Sorry, I encountered an error while generating a response. Please try again.",
          sender: "system",
          timestamp: new Date().toISOString(),
          status: "error",
        };

        // Add error message to chat
        const chatWithError = await this.storageManager.addMessageToChat(
          chatId,
          errorMessage,
        );
        if (chatWithError) {
          // Update local state with error message
          this.chats = {
            ...this.chats,
            [chatId]: chatWithError
          };
        }

        this.error = "Failed to stream AI response";
      }
    } catch (error) {
      console.error(`Error streaming message in chat ${chatId}:`, error);
      this.error = "Failed to send message";
    }
  }

  /**
   * Create a new chat with simplified parameters
   */
  async createNewChat(name: string, additionalInfo: string): Promise<string> {
    const context: ChatContext = {
      company: "",
      industry: "",
      region: "",
      additionalInfo: additionalInfo || "",
    };

    return this.createChat(name, context);
  }

  /**
   * Subscribe to store updates
   */
  subscribe(
    callback: (state: {
      chats: Record<string, Chat>;
      activeChat: string | null;
    }) => void,
  ): () => void {
    // Create an effect to track changes
    const unsubscribe = $effect(() => {
      // Call the callback with the current state when it changes
      callback({
        chats: this.chats,
        activeChat: this.activeChat,
      });
    });

    // Return unsubscribe function
    return unsubscribe;
  }

  /**
   * Ensure the store is initialized
   */
  async ensureInitialized(): Promise<void> {
    if (Object.keys(this.chats).length === 0) {
      await this.loadChats();
    }
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.error = null;
  }
}

// Export a singleton instance for global use
export const chatStore = new ChatStore();
