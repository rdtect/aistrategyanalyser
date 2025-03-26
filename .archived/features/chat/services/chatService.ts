/**
 * Core Chat Service
 * Consolidates chat business logic and coordinates with other services
 */
import { v4 as uuidv4 } from "uuid";
import type {
  Chat,
  ChatMessage,
  MessageStatus,
  ChatContext,
} from "../types/chat";
import { aiClientService } from "./aiClientService";
import { chatStore } from "../stores/chatStore.svelte";
import { syncChatMetadata } from "./syncService";
import * as storageService from "./storageService";

export const chatService = {
  /**
   * Create a new empty chat
   */
  createEmptyChat(
    options: Partial<Chat> & {
      company?: string;
      industry?: string;
      region?: string;
    } = {},
  ): Chat {
    const now = new Date().toISOString();

    // Create default context if none provided
    const context: ChatContext = options.context || {
      company: options.company || "",
      industry: options.industry || "",
      region: options.region || "",
      additionalInfo: options.context || "",
    };

    // Create base chat object
    const chat = {
      id: options.id || uuidv4(),
      name: options.name || "New Chat",
      context,
      createdAt: options.createdAt || now,
      updatedAt: options.updatedAt || now,
      messages: options.messages || [],
    };

    // Ensure serializable by running through JSON conversion
    // This catches any non-serializable properties early
    try {
      return JSON.parse(JSON.stringify(chat));
    } catch (error) {
      console.error("Error serializing chat:", error);
      // Return the original as fallback
      return chat;
    }
  },

  /**
   * Create and save a new chat
   */
  async createChat(options: Partial<Chat> = {}): Promise<Chat> {
    try {
      // Create a base chat object
      const chat = this.createEmptyChat(options);

      // Ensure data is serializable by converting to and from JSON
      // This prevents any non-serializable data from causing IndexedDB errors
      const serializedChat = JSON.parse(JSON.stringify(chat));

      // First save to IndexedDB to ensure it works
      await storageService.saveChat(serializedChat);

      // Then update the store after confirming save worked
      chatStore.updateChat(serializedChat.id, serializedChat);

      // Optional: synchronize with backend
      try {
        await syncChatMetadata(serializedChat.id);
      } catch (error) {
        console.warn("Failed to sync chat metadata with server:", error);
        // Continue anyway since local storage succeeded
      }

      return serializedChat;
    } catch (error: unknown) {
      console.error("Error creating chat:", error);
      throw new Error(
        `Failed to create chat: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },

  /**
   * Add a message to a chat
   */
  async addMessage(chat: Chat, message: Partial<ChatMessage>): Promise<Chat> {
    const newMessage: ChatMessage = {
      id: message.id || uuidv4(),
      content: message.content || "",
      sender: message.sender || "user",
      timestamp: message.timestamp || new Date().toISOString(),
      status: message.status || "sent",
      sources: message.sources,
      index: message.index !== undefined ? message.index : chat.messages.length,
    };

    const updatedChat = {
      ...chat,
      messages: [...chat.messages, newMessage],
      updatedAt: new Date().toISOString(),
    };

    // Update chat in store
    chatStore.updateChat(updatedChat.id, updatedChat);

    // Save to IndexedDB
    await storageService.saveChat(updatedChat);

    return updatedChat;
  },

  /**
   * Generate AI response for a message
   */
  async generateAiResponse(
    chat: Chat,
    userMessage: string,
  ): Promise<ChatMessage> {
    // Generate AI response using aiClientService
    return await aiClientService.generateAIResponse(chat, userMessage);
  },

  /**
   * Update a message in a chat
   */
  async updateMessage(
    chat: Chat,
    messageId: string,
    updates: Partial<ChatMessage>,
  ): Promise<Chat> {
    const messageIndex = chat.messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return chat;

    const updatedMessage = { ...chat.messages[messageIndex], ...updates };
    const newMessages = [...chat.messages];
    newMessages[messageIndex] = updatedMessage;

    const updatedChat = {
      ...chat,
      messages: newMessages,
      updatedAt: Date.now(),
    };

    // Update chat in store
    chatStore.updateChat(updatedChat.id, updatedChat);
    // Save to local storage
    storageService.saveChats({ [chat.id]: updatedChat });
    return updatedChat;
  },

  /**
   * Delete a message from a chat
   */
  async deleteMessage(chat: Chat, messageId: string): Promise<Chat> {
    const updatedChat = {
      ...chat,
      messages: chat.messages.filter((m) => m.id !== messageId),
      updatedAt: Date.now(),
    };

    // Update chat in store
    chatStore.updateChat(updatedChat.id, updatedChat);
    // Save to local storage
    storageService.saveChats({ [chat.id]: updatedChat });
    return updatedChat;
  },

  /**
   * Delete a chat
   */
  async deleteChat(chatId: string): Promise<void> {
    // Delete chat from store
    chatStore.deleteChat(chatId);

    // Delete from IndexedDB
    await storageService.deleteChat(chatId);

    // Note: Metadata will be automatically cleaned up by database cascade delete
  },

  /**
   * Create a new message object
   */
  createMessage(
    content: string,
    sender: "user" | "ai" | "system",
    index?: number,
    status: MessageStatus = "sent",
  ): ChatMessage {
    return {
      id: uuidv4(),
      content,
      sender,
      timestamp: Date.now(),
      status,
      index,
    };
  },

  /**
   * Load all chats from storage
   */
  async loadAllChats(): Promise<Record<string, Chat>> {
    const chats = await storageService.getAllChats();

    // Convert array to Record format for the store
    const chatMap: Record<string, Chat> = {};
    chats.forEach((chat) => {
      chatMap[chat.id] = chat;
    });

    return chatMap;
  },

  /**
   * Get chats sorted by date
   */
  async getSortedChats(): Promise<Chat[]> {
    return storageService.getChatsOrderedByDate(false); // newest first
  },

  /**
   * Export all chats as JSON
   */
  async exportChats(): Promise<string> {
    return storageService.exportChatsAsJSON();
  },

  /**
   * Import chats from JSON
   */
  async importChats(json: string): Promise<number> {
    const count = await storageService.importChatsFromJSON(json);

    // Update the store with the newly imported chats
    const allChats = await this.loadAllChats();
    Object.values(allChats).forEach((chat) => {
      chatStore.updateChat(chat.id, chat);
    });

    return count;
  },

  /**
   * Get a specific chat by ID
   */
  async getChat(id: string): Promise<Chat | null> {
    try {
      // Look for the chat in the store first
      let chatFromStore: Chat | null = null;

      // Use subscribe pattern to safely access store state
      const unsubscribe = chatStore.subscribe((state) => {
        if (state?.chats?.[id]) {
          chatFromStore = state.chats[id];
        }
      });
      unsubscribe(); // Prevent memory leaks

      // Return chat from store if found
      if (chatFromStore) {
        return chatFromStore;
      }

      // Otherwise try to load from storage
      const chatFromStorage = await storageService.getChat(id);

      if (chatFromStorage) {
        // Ensure chat has valid context structure
        if (!chatFromStorage.context) {
          chatFromStorage.context = {
            company: "",
            industry: "",
            region: "",
          };
        }

        // Update store with loaded chat
        chatStore.updateChat(id, chatFromStorage);

        return chatFromStorage;
      }

      return null;
    } catch (error: unknown) {
      console.error(`Error getting chat ${id}:`, error);
      throw new Error(
        `Failed to get chat: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
};
