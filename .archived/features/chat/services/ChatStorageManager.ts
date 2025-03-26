/**
 * ChatStorageManager - Class-based encapsulation of IndexedDB operations for chat data
 * Optimized for Svelte 5 and SvelteKit 2 best practices
 */
import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Chat, ChatMessage } from "../types/chat";
import { browser } from "$app/environment";

// Define the database schema
interface ChatDB extends DBSchema {
  chats: {
    key: string;
    value: Chat;
    indexes: {
      "by-date": string;
    };
  };
}

/**
 * ChatStorageManager - Handles all chat storage operations
 * Uses class-based encapsulation for better organization and maintainability
 */
export class ChatStorageManager {
  private static DB_NAME = "ai-strategy-analyzer";
  private static DB_VERSION = 1;
  private static CHATS_STORE = "chats";
  private dbPromise: Promise<IDBPDatabase<ChatDB>> | null = null;

  constructor() {
    // Initialize the database connection when the class is instantiated
    if (browser) {
      this.initDB();
    }
  }

  /**
   * Initialize the database connection
   */
  async initDB(): Promise<IDBPDatabase<ChatDB> | null> {
    if (!browser) return null;

    try {
      if (!this.dbPromise) {
        console.log(`[Storage] Initializing IndexedDB database: ${ChatStorageManager.DB_NAME} (v${ChatStorageManager.DB_VERSION})`);
        
        this.dbPromise = openDB<ChatDB>(ChatStorageManager.DB_NAME, ChatStorageManager.DB_VERSION, {
          upgrade: (db) => this.upgradeDB(db),
          blocked: () => {
            console.warn(`[Storage] Database upgrade was blocked`);
          },
          blocking: () => {
            console.warn(`[Storage] This connection is blocking a database upgrade`);
          },
          terminated: () => {
            console.warn(`[Storage] Database connection was terminated unexpectedly`);
            this.dbPromise = null; // Reset so we can try to reconnect
          }
        });
        
        console.log(`[Storage] IndexedDB database initialized successfully`);
      }

      return this.dbPromise;
    } catch (error) {
      console.error(`[Storage] Failed to initialize IndexedDB:`, error);
      throw error;
    }
  }

  /**
   * Handle database upgrade
   */
  private upgradeDB(db: IDBPDatabase<ChatDB>): void {
    console.log(`[Storage] Upgrading IndexedDB database to version ${ChatStorageManager.DB_VERSION}`);
    
    // Check if store already exists
    if (!db.objectStoreNames.contains(ChatStorageManager.CHATS_STORE)) {
      // Create the chats store with the chat ID as the key path
      const chatStore = db.createObjectStore(ChatStorageManager.CHATS_STORE, {
        keyPath: "id",
      });

      // Create an index for faster querying by date
      chatStore.createIndex("by-date", "updatedAt");
      console.log(`[Storage] Created ${ChatStorageManager.CHATS_STORE} object store with by-date index`);
    } else {
      console.log(`[Storage] ${ChatStorageManager.CHATS_STORE} object store already exists`);
    }
  }

  /**
   * Get the database instance
   */
  private async getDB(): Promise<IDBPDatabase<ChatDB>> {
    try {
      if (!this.dbPromise) {
        console.log(`[Storage] No database connection, initializing...`);
        const db = await this.initDB();
        if (!db) {
          throw new Error("Failed to initialize database");
        }
        return db;
      }
      return this.dbPromise;
    } catch (error) {
      console.error(`[Storage] Error getting database connection:`, error);
      throw error;
    }
  }

  /**
   * Save a chat to the database
   */
  async saveChat(chat: Chat): Promise<void> {
    if (!browser) return;

    try {
      // Create a safe sanitized version of the chat object
      const sanitizedChat = this.sanitizeChatForStorage(chat);

      // Get DB instance
      const db = await this.getDB();

      // Save to IndexedDB
      await db.put("chats", sanitizedChat);
      console.log(`Chat ${chat.id} saved to IndexedDB`);

      // Dispatch event to notify subscribers
      this.dispatchChatUpdateEvent(chat.id);
    } catch (error) {
      console.error(`Failed to save chat ${chat.id} to IndexedDB:`, error);
      console.error(
        "Chat structure that failed:",
        JSON.stringify(chat, this.replacer),
      );
      throw error;
    }
  }

  /**
   * Helper function to sanitize a chat object for storage
   * This creates a clean object that's safe for IndexedDB storage
   */
  private sanitizeChatForStorage(chat: Chat): Chat {
    console.log("Sanitizing chat for storage:", chat.id);

    // Create basic structure with required fields
    const sanitized = {
      id: chat.id,
      name: String(chat.name || "Untitled Chat"),
      createdAt:
        typeof chat.createdAt === "string"
          ? chat.createdAt
          : new Date().toISOString(),
      updatedAt:
        typeof chat.updatedAt === "string"
          ? chat.updatedAt
          : new Date().toISOString(),
      // Ensure context is properly structured
      context: {
        company: String(chat.context?.company || ""),
        industry: String(chat.context?.industry || ""),
        region: String(chat.context?.region || ""),
        additionalInfo: String(chat.context?.additionalInfo || ""),
      },
      // Sanitize messages
      messages: Array.isArray(chat.messages)
        ? chat.messages.map(msg => this.sanitizeMessage(msg))
        : [],
    };

    return sanitized as Chat;
  }

  /**
   * Helper function to sanitize a message for storage
   */
  private sanitizeMessage(msg: any): ChatMessage {
    if (!msg) {
      return {
        id: crypto.randomUUID(),
        content: "",
        sender: "system",
        timestamp: new Date().toISOString(),
        status: "sent"
      };
    }

    const sanitized = {
      id: String(msg.id || crypto.randomUUID()),
      content: String(msg.content || ""),
      sender: ["user", "ai", "system"].includes(msg.sender)
        ? msg.sender
        : "system",
      timestamp:
        typeof msg.timestamp === "string"
          ? msg.timestamp
          : new Date().toISOString(),
      status: msg.status || "sent",
    } as ChatMessage;

    // Only include sources if they exist and are an array
    if (Array.isArray(msg.sources)) {
      sanitized.sources = msg.sources.map((s: any) => ({
        title: String(s.title || ""),
        url: s.url ? String(s.url) : undefined,
        content: s.content ? String(s.content) : undefined,
      }));
    }

    return sanitized;
  }

  /**
   * Custom replacer for JSON.stringify to handle circular references
   */
  private replacer(key: string, value: any): any {
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    }

    // Handle circular references
    const seen = new Set();
    return typeof value === "object" && value !== null
      ? seen.has(value)
        ? "[Circular]"
        : seen.add(value) && value
      : value;
  }

  /**
   * Save multiple chats to IndexedDB
   */
  async saveChats(chats: Record<string, Chat> | Chat[]): Promise<void> {
    if (!browser) return;

    try {
      const db = await this.getDB();
      const tx = db.transaction("chats", "readwrite");
      const promises: Promise<any>[] = [];

      // Handle both array and record formats
      const chatArray = Array.isArray(chats) ? chats : Object.values(chats);

      // Keep track of processed chat IDs for logging
      const processedIds: string[] = [];

      for (const chat of chatArray) {
        try {
          // Sanitize each chat before saving to ensure it's IndexedDB compatible
          const sanitizedChat = this.sanitizeChatForStorage(chat);
          promises.push(tx.store.put(sanitizedChat));
          processedIds.push(sanitizedChat.id);
        } catch (err) {
          console.error(`Failed to process chat ${chat.id}:`, err);
        }
      }

      // Add the transaction completion to the promises
      promises.push(tx.done);

      // Wait for all operations to complete
      await Promise.all(promises);
      console.log(
        `${processedIds.length} chats saved to IndexedDB: ${processedIds.join(", ")}`,
      );
    } catch (error) {
      console.error("Error saving multiple chats to IndexedDB:", error);
      throw error;
    }
  }

  /**
   * Get a chat by ID
   */
  async getChat(id: string): Promise<Chat | undefined> {
    if (!browser) return undefined;

    const db = await this.getDB();
    return db.get("chats", id);
  }

  /**
   * Get all chats
   */
  async getAllChats(): Promise<Chat[]> {
    if (!browser) return [];

    const db = await this.getDB();
    return db.getAll("chats");
  }

  /**
   * Get all chats sorted by date
   */
  async getChatsOrderedByDate(ascending = false): Promise<Chat[]> {
    if (!browser) return [];

    const db = await this.getDB();
    const chats = await db.getAllFromIndex("chats", "by-date");

    return ascending ? chats : chats.reverse();
  }

  /**
   * Delete a chat by ID
   */
  async deleteChat(id: string): Promise<void> {
    if (!browser) return;

    const db = await this.getDB();
    await db.delete("chats", id);
    console.log(`Chat ${id} deleted from IndexedDB`);

    // Dispatch event to notify subscribers
    this.dispatchChatUpdateEvent(id);
  }

  /**
   * Add a message to a chat
   */
  async addMessageToChat(chatId: string, message: ChatMessage): Promise<Chat | undefined> {
    if (!browser) return;

    try {
      // Sanitize the message first
      const sanitizedMessage = this.sanitizeMessage(message);

      const db = await this.getDB();
      const tx = db.transaction("chats", "readwrite");

      // Get the chat
      const chat = await tx.store.get(chatId);

      if (!chat) {
        console.error(`Chat ${chatId} not found`);
        return undefined;
      }

      // Make sure messages array exists
      if (!Array.isArray(chat.messages)) {
        chat.messages = [];
      }

      // Add the sanitized message
      chat.messages.push(sanitizedMessage);
      chat.updatedAt = new Date().toISOString();

      // Sanitize the whole chat to ensure complete compatibility
      const sanitizedChat = this.sanitizeChatForStorage(chat);

      // Save the updated chat
      await tx.store.put(sanitizedChat);
      await tx.done;

      console.log(`Message added to chat ${chatId}`);

      // Dispatch event to notify subscribers
      this.dispatchChatUpdateEvent(chatId);

      return sanitizedChat;
    } catch (error) {
      console.error(`Error adding message to chat ${chatId}:`, error);
      console.error("Message that failed:", JSON.stringify(message, this.replacer));
      return undefined;
    }
  }

  /**
   * Update chat context
   */
  async updateChatContext(chatId: string, context: Chat["context"]): Promise<Chat | undefined> {
    if (!browser) return;

    try {
      const db = await this.getDB();
      const tx = db.transaction("chats", "readwrite");

      // Get the chat
      const chat = await tx.store.get(chatId);

      if (!chat) {
        console.error(`Chat ${chatId} not found`);
        return undefined;
      }

      // Create a sanitized context
      const sanitizedContext = {
        company: String(context?.company || ""),
        industry: String(context?.industry || ""),
        region: String(context?.region || ""),
        additionalInfo: String(context?.additionalInfo || ""),
      };

      // Update the context
      chat.context = sanitizedContext;
      chat.updatedAt = new Date().toISOString();

      // Sanitize the whole chat to ensure complete compatibility
      const sanitizedChat = this.sanitizeChatForStorage(chat);

      // Save the updated chat
      await tx.store.put(sanitizedChat);
      await tx.done;

      console.log(`Context updated for chat ${chatId}`);
      return sanitizedChat;
    } catch (error) {
      console.error(`Error updating context for chat ${chatId}:`, error);
      return undefined;
    }
  }

  /**
   * Clear all chats (for testing/debugging)
   */
  async clearAllChats(): Promise<void> {
    if (!browser) return;

    const db = await this.getDB();
    await db.clear("chats");
    console.log("All chats cleared from IndexedDB");
  }

  /**
   * Export all chats as JSON
   */
  async exportChatsAsJSON(): Promise<string> {
    if (!browser) return "[]";

    const chats = await this.getAllChats();
    return JSON.stringify(chats, null, 2);
  }

  /**
   * Import chats from JSON
   */
  async importChatsFromJSON(json: string): Promise<number> {
    if (!browser) return 0;

    try {
      const chats = JSON.parse(json) as Chat[];

      if (!Array.isArray(chats)) {
        throw new Error("Invalid JSON format: expected an array of chats");
      }

      await this.saveChats(chats);
      return chats.length;
    } catch (error) {
      console.error("Error importing chats:", error);
      throw error;
    }
  }

  /**
   * Helper function to dispatch chat update events
   */
  private dispatchChatUpdateEvent(chatId: string): void {
    if (browser) {
      window.dispatchEvent(
        new CustomEvent("userChatsUpdated", {
          detail: { chatId },
        }),
      );
    }
  }
}