import { writable, derived } from "svelte/store";
import type { Chat, Message, MessageStatus } from "$lib/types/chat";
import { supabaseService } from "$lib/services/supabaseService";

// Define global stores
export const chats = writable<Chat[]>([]);
export const currentChatId = writable<string | null>(null);
export const isCheckingAPI = writable(false);
export const apiAvailable = writable(true);

// Create derived stores
export const currentChat = derived(
  [chats, currentChatId],
  ([$chats, $currentChatId]) => {
    if (!$currentChatId) return null;
    return $chats.find((chat) => chat.id === $currentChatId) || null;
  }
);

export const currentMessages = derived(
  currentChat,
  ($currentChat) => $currentChat?.messages || []
);

// Chat store functions
export const chatActions = {
  async createChat(name: string, metadata?: any) {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      name,
      messages: [],
      createdAt: new Date(),
      ...metadata,
    };

    chats.update((c) => [newChat, ...c]);
    currentChatId.set(newChat.id);

    // Persist to database
    try {
      await supabaseService.saveChat(newChat);
    } catch (error) {
      console.error("Failed to save chat:", error);
    }

    return newChat.id;
  },

  // Add message to a chat
  addMessage(chatId: string, message: Message) {
    chats.update((cs) => {
      return cs.map((c) => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: [...c.messages, message],
            updatedAt: new Date(),
          };
        }
        return c;
      });
    });

    // Persist to database
    supabaseService
      .saveMessage(chatId, message)
      .catch((error) => console.error("Failed to save message:", error));
  },

  // Update message content
  updateMessage(chatId: string, messageId: string, updates: Partial<Message>) {
    chats.update((cs) => {
      return cs.map((c) => {
        if (c.id === chatId) {
          const messages = c.messages.map((m) => {
            if (m.id === messageId) {
              return { ...m, ...updates };
            }
            return m;
          });
          return { ...c, messages, updatedAt: new Date() };
        }
        return c;
      });
    });

    // Could also update in database if needed
  },

  // Update message status
  updateMessageStatus(
    chatId: string,
    messageId: string,
    status: MessageStatus
  ) {
    this.updateMessage(chatId, messageId, { status });
  },

  // Helper methods for updating messages and loading data
  // ... other methods as in the previous example
};
