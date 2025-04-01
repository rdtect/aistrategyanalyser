import type { Chat, Message } from "$lib/types";
import { browser } from "$app/environment";
import { IDBService } from "$lib/services/idb";
import { logError, withRetry, ErrorMessages } from "$lib/utils/errorHandler";
import { v4 as uuidv4 } from "uuid";

/**
 * ChatService provides a unified interface for chat operations
 * with server-side caching and client-side persistence
 */
export class ChatService {
  // Server-side cache for faster access
  private static serverCache = new Map<string, Chat>();

  /**
   * Get all chats from storage with retries and improved error handling
   */
  static async getAllChats(): Promise<Chat[]> {
    if (browser) {
      try {
        // Use withRetry for more resilient data loading
        const rawChats = await withRetry(
          async () => await IDBService.getAllChats(),
          3, // 3 attempts
          500, // 500ms base delay
        );

        // Validate and hydrate each chat
        const validatedChats = rawChats
          .map(validateAndHydrateChat)
          .filter((chat): chat is Chat => chat !== null); // Type guard to filter out nulls

        return validatedChats;
      } catch (error) {
        logError(error, "ChatService.getAllChats");
        return [];
      }
    } else {
      // Return from server cache when in SSR context
      return Array.from(this.serverCache.values());
    }
  }

  /**
   * Get a chat by ID with enhanced error handling and fallbacks
   */
  static async getChatById(id: string): Promise<Chat | null> {
    if (!id) return null;

    let hydratedChat: Chat | null = null;

    if (browser) {
      try {
        const rawChat = await withRetry(
          async () => {
            const chatFromDB = await IDBService.getChat(id);
            if (chatFromDB) {
              return chatFromDB;
            }

            // Try localStorage BACKUP if IDB fails or returns null
            if (typeof localStorage !== "undefined") {
              const backupJson = localStorage.getItem(`chat_backup_${id}`); // Check only backup key

              if (backupJson) {
                console.log(`Found chat ${id} in localStorage fallback`);
                try {
                  return JSON.parse(backupJson);
                } catch (parseError) {
                  logError(
                    parseError,
                    "ChatService.getChatById - localStorage parse",
                    { chatId: id },
                  );
                  localStorage.removeItem(`chat_backup_${id}`);
                  return null; // Indicate failure to load from fallback
                }
              }
            }
            return null; // Return null if not found in DB or fallback
          },
          3, // 3 attempts
          500, // 500ms base delay
        );

        // Validate and hydrate the loaded chat data
        if (rawChat) {
          hydratedChat = validateAndHydrateChat(rawChat);
        } else {
          hydratedChat = null;
        }
      } catch (error) {
        logError(error, "ChatService.getChatById", { chatId: id });
        hydratedChat = null;
      }
    } else {
      // Return from server cache when in SSR context
      // Server cache data should ideally already be validated when cached
      hydratedChat = this.serverCache.get(id) || null;
    }

    // Return the validated and hydrated chat (or null)
    return hydratedChat;
  }

  /**
   * Save a chat with fallbacks and resilience
   */
  static async saveChat(chat: Chat): Promise<void> {
    if (!chat || !chat.id) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }

    // Ensure we're not using a proxy object
    const serializedChat = JSON.parse(JSON.stringify(chat));

    if (browser) {
      // In browser, use IDBService with retries
      try {
        await withRetry(
          async () => {
            await IDBService.saveChat(serializedChat);

            // Also save to localStorage as backup
            if (typeof localStorage !== "undefined") {
              try {
                localStorage.setItem(
                  `chat_backup_${chat.id}`,
                  JSON.stringify(serializedChat),
                );
              } catch (lsError) {
                console.warn(`Could not save backup to localStorage:`, lsError);
              }
            }
          },
          3, // 3 attempts
          500, // 500ms base delay
        );
      } catch (error) {
        logError(error, "ChatService.saveChat", { chatId: chat.id });

        // Try localStorage backup as a last resort if IDB failed
        if (typeof localStorage !== "undefined") {
          try {
            localStorage.setItem(
              `chat_backup_${chat.id}`, // Use the standard backup key
              JSON.stringify(serializedChat),
            );
            console.warn(
              `Saved chat ${chat.id} to localStorage backup after IDB failure`,
            );
          } catch (lsError) {
            // Re-throw the original error if localStorage also fails
            throw error;
          }
        } else {
          throw error;
        }
      }
    } else {
      // In SSR, update server cache
      this.serverCache.set(chat.id, serializedChat);
    }
  }

  /**
   * Delete a chat
   */
  static async deleteChat(id: string): Promise<void> {
    if (!id) return;

    if (browser) {
      try {
        await IDBService.deleteChat(id);
      } catch (error) {
        console.error(`Error deleting chat ${id}:`, error);
        throw error;
      }
    } else {
      // In SSR, remove from server cache
      this.serverCache.delete(id);
    }
  }

  /**
   * Add a message to a chat
   */
  static async addMessage(
    chatId: string,
    message: Message,
  ): Promise<Chat | null> {
    if (!chatId || !message) return null;

    // Get the chat
    const chat = await this.getChatById(chatId);
    if (!chat) return null;

    // Add the message
    chat.messages.push(message);
    chat.updatedAt = new Date().toISOString();

    // Save the updated chat
    await this.saveChat(chat);

    return chat;
  }

  /**
   * Cache a chat in the server-side store
   * Used by server-side load functions to improve performance
   */
  static cacheChat(chat: Chat): void {
    if (!browser && chat && chat.id) {
      this.serverCache.set(chat.id, chat);
    }
  }

  /**
   * Cache multiple chats in the server-side cache
   */
  static cacheChats(chats: Chat[]): void {
    if (!browser) {
      for (const chat of chats) {
        this.serverCache.set(chat.id, chat);
      }
    }
  }

  /**
   * Clear the server-side cache
   */
  static clearCache(): void {
    if (!browser) {
      this.serverCache.clear();
    }
  }
}

// Helper function to validate and hydrate a single message
function validateAndHydrateMessage(msg: any, index: number): Message {
  const validRole =
    msg?.role && ["user", "assistant", "system"].includes(msg.role)
      ? msg.role
      : "system"; // Default to system if missing or invalid

  const validStatus =
    msg?.status &&
    ["sending", "sent", "error", "streaming", "delivered", "read"].includes(
      msg.status,
    )
      ? msg.status
      : "sent"; // Default to sent

  return {
    id: msg?.id || uuidv4(), // Ensure ID exists
    role: validRole,
    content: msg?.content ?? null, // Ensure content is string or null
    timestamp: msg?.timestamp || new Date().toISOString(), // Provide default timestamp
    status: validStatus,
    index: typeof msg?.index === "number" ? msg.index : index, // Ensure index is number, use provided or fallback
    // Optional fields - ensure they exist or are undefined/null
    sources: Array.isArray(msg?.sources) ? msg.sources : undefined,
    tool_calls: msg?.tool_calls,
    tool_call_id: msg?.tool_call_id,
  };
}

// Helper function to validate and hydrate a chat object
function validateAndHydrateChat(chatData: any): Chat | null {
  if (!chatData || typeof chatData.id !== "string") {
    logError(
      new Error("Invalid chat data: Missing or invalid ID"),
      "validateAndHydrateChat",
      { chatData },
    );
    return null;
  }

  const messages: Message[] = Array.isArray(chatData.messages)
    ? chatData.messages.map(validateAndHydrateMessage)
    : [];

  return {
    id: chatData.id,
    name: chatData.name || "Untitled Chat", // Default name
    messages: messages,
    createdAt: chatData.createdAt || new Date().toISOString(), // Default dates
    updatedAt: chatData.updatedAt || new Date().toISOString(),
    context: chatData.context, // Assume context structure is handled elsewhere or optional
    tags: Array.isArray(chatData.tags) ? chatData.tags : undefined,
    isArchived:
      typeof chatData.isArchived === "boolean" ? chatData.isArchived : false,
  };
}
