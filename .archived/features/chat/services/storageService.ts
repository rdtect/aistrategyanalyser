/**
 * Storage Service - Handles persistence of chat data using IndexedDB via idb
 */
import { openDB, type DBSchema, IDBPDatabase } from "idb";
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

// Database configuration
const DB_NAME = "ai-strategy-analyzer";
const DB_VERSION = 1;
const CHATS_STORE = "chats";

// Database instance
let db: Promise<IDBPDatabase<ChatDB>> | null = null;

/**
 * Initialize the database
 */
export async function initDB(): Promise<IDBPDatabase<ChatDB>> {
  if (!browser) return null;

  try {
    if (!db) {
      console.log(
        `[Storage] Initializing IndexedDB database: ${DB_NAME} (v${DB_VERSION})`,
      );

      try {
        db = openDB<ChatDB>(DB_NAME, DB_VERSION, {
          upgrade(db) {
            console.log(
              `[Storage] Upgrading IndexedDB database to version ${DB_VERSION}`,
            );

            // Check if store already exists
            if (!db.objectStoreNames.contains(CHATS_STORE)) {
              // Create the chats store with the chat ID as the key path
              const chatStore = db.createObjectStore(CHATS_STORE, {
                keyPath: "id",
              });

              // Create an index for faster querying by date
              chatStore.createIndex("by-date", "updatedAt");
              console.log(
                `[Storage] Created ${CHATS_STORE} object store with by-date index`,
              );
            } else {
              console.log(
                `[Storage] ${CHATS_STORE} object store already exists`,
              );
            }
          },
          blocked() {
            console.warn(`[Storage] Database upgrade was blocked`);
          },
          blocking() {
            console.warn(
              `[Storage] This connection is blocking a database upgrade`,
            );
          },
          terminated() {
            console.warn(
              `[Storage] Database connection was terminated unexpectedly`,
            );
            db = null; // Reset so we can try to reconnect
          },
        });
      } catch (initError) {
        console.error(
          `[Storage] Critical IndexedDB initialization error:`,
          initError,
        );
        // Create a fallback dummy DB object that won't throw errors
        // but will return empty results
        db = createFallbackDB();
      }

      console.log(`[Storage] IndexedDB database initialized successfully`);
    }

    return db;
  } catch (error) {
    console.error(`[Storage] Failed to initialize IndexedDB:`, error);

    // Create fallback DB that will silently fail
    db = createFallbackDB();
    return db;
  }
}

/**
 * Create a fallback DB object when IndexedDB is not available
 * This prevents errors from crashing the app
 */
function createFallbackDB(): any {
  console.warn(`[Storage] Using fallback DB object (no persistence)`);

  // In-memory fallback storage
  const memoryStore: Record<string, any> = {};

  // Return a dummy DB object that implements the IDBPDatabase interface
  return {
    get: async (storeName: string, key: string) => {
      console.log(`[Fallback] Getting ${key} from ${storeName}`);
      return memoryStore[key];
    },
    put: async (storeName: string, value: any) => {
      console.log(`[Fallback] Putting ${value.id} to ${storeName}`);
      memoryStore[value.id] = value;
      return value.id;
    },
    delete: async (storeName: string, key: string) => {
      console.log(`[Fallback] Deleting ${key} from ${storeName}`);
      delete memoryStore[key];
    },
    getAll: async (storeName: string) => {
      console.log(`[Fallback] Getting all from ${storeName}`);
      return Object.values(memoryStore);
    },
    getAllFromIndex: async (storeName: string, indexName: string) => {
      console.log(
        `[Fallback] Getting all from ${storeName} using index ${indexName}`,
      );
      return Object.values(memoryStore).sort((a, b) => {
        if (indexName === "by-date") {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
        return 0;
      });
    },
    clear: async (storeName: string) => {
      console.log(`[Fallback] Clearing ${storeName}`);
      Object.keys(memoryStore).forEach((key) => delete memoryStore[key]);
    },
    transaction: () => {
      console.log(`[Fallback] Creating transaction`);
      return {
        store: {
          get: async (key: string) => memoryStore[key],
          put: async (value: any) => {
            memoryStore[value.id] = value;
            return value.id;
          },
          delete: async (key: string) => {
            delete memoryStore[key];
          },
          clear: async () => {
            Object.keys(memoryStore).forEach((key) => delete memoryStore[key]);
          },
        },
        done: Promise.resolve(),
      };
    },
  };
}

/**
 * Get the database instance
 */
async function getDB(): Promise<IDBPDatabase<ChatDB>> {
  try {
    if (!db) {
      console.log(`[Storage] No database connection, initializing...`);
      return initDB();
    }
    return db;
  } catch (error) {
    console.error(`[Storage] Error getting database connection:`, error);
    throw error;
  }
}

/**
 * Save a chat to the database
 */
export async function saveChat(chat: Chat): Promise<void> {
  if (!browser) return;

  try {
    // Create a safe sanitized version of the chat object
    const sanitizedChat = sanitizeChatForStorage(chat);

    // Get DB instance
    const db = await getDB();

    // Save to IndexedDB
    await db.put(CHATS_STORE, sanitizedChat);
    console.log(`Chat ${chat.id} saved to IndexedDB`);

    // Dispatch event to notify subscribers
    dispatchChatUpdateEvent(chat.id);
  } catch (error) {
    console.error(`Failed to save chat ${chat.id} to IndexedDB:`, error);
    console.error(
      "Chat structure that failed:",
      JSON.stringify(chat, replacer),
    );
    throw error;
  }
}

/**
 * Helper function to sanitize a chat object for storage
 * This creates a clean object that's safe for IndexedDB storage
 */
function sanitizeChatForStorage(chat: Chat): any {
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
      ? chat.messages.map(sanitizeMessage)
      : [],
  };

  return sanitized;
}

/**
 * Helper function to sanitize a message for storage
 */
function sanitizeMessage(msg: any): any {
  if (!msg) return null;

  return {
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
    // Only include sources if they exist and are an array
    ...(Array.isArray(msg.sources)
      ? {
          sources: msg.sources.map((s: any) => ({
            title: String(s.title || ""),
            url: s.url ? String(s.url) : undefined,
            content: s.content ? String(s.content) : undefined,
          })),
        }
      : {}),
  };
}

/**
 * Custom replacer for JSON.stringify to handle circular references
 */
function replacer(key: string, value: any): any {
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
export async function saveChats(
  chats: Record<string, Chat> | Chat[],
): Promise<void> {
  if (!browser) return;

  try {
    const db = await getDB();
    const tx = db.transaction(CHATS_STORE, "readwrite");
    const promises: Promise<any>[] = [];

    // Handle both array and record formats
    const chatArray = Array.isArray(chats) ? chats : Object.values(chats);

    // Keep track of processed chat IDs for logging
    const processedIds: string[] = [];

    for (const chat of chatArray) {
      try {
        // Sanitize each chat before saving to ensure it's IndexedDB compatible
        const sanitizedChat = sanitizeChatForStorage(chat);
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
export async function getChat(id: string): Promise<Chat | undefined> {
  if (!browser) return undefined;

  // Validate ID parameter
  if (!id || typeof id !== "string") {
    console.error("Invalid chat ID provided to getChat:", id);
    throw new Error(`Invalid chat ID provided to getChat: ${id}`);
  }

  try {
    const db = await getDB();
    return db.get(CHATS_STORE, id);
  } catch (error) {
    console.error(`Error retrieving chat ${id} from IndexedDB:`, error);
    return undefined;
  }
}

/**
 * Get all chats
 */
export async function getAllChats(): Promise<Chat[]> {
  if (!browser) return [];

  const db = await getDB();
  return db.getAll(CHATS_STORE);
}

/**
 * Get all chats sorted by date
 */
export async function getChatsOrderedByDate(
  ascending = false,
): Promise<Chat[]> {
  if (!browser) return [];

  const db = await getDB();
  const chats = await db.getAllFromIndex(CHATS_STORE, "by-date");

  return ascending ? chats : chats.reverse();
}

/**
 * Delete a chat by ID
 */
export async function deleteChat(id: string): Promise<void> {
  if (!browser) return;

  const db = await getDB();
  await db.delete(CHATS_STORE, id);
  console.log(`Chat ${id} deleted from IndexedDB`);

  // Dispatch event to notify subscribers
  dispatchChatUpdateEvent(id);
}

/**
 * Add a message to a chat
 */
export async function addMessageToChat(
  chatId: string,
  message: ChatMessage,
): Promise<Chat | undefined> {
  if (!browser) return;

  try {
    // Sanitize the message first
    const sanitizedMessage = sanitizeMessage(message);

    const db = await getDB();
    const tx = db.transaction(CHATS_STORE, "readwrite");

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
    const sanitizedChat = sanitizeChatForStorage(chat);

    // Save the updated chat
    await tx.store.put(sanitizedChat);
    await tx.done;

    console.log(`Message added to chat ${chatId}`);

    // Dispatch event to notify subscribers
    dispatchChatUpdateEvent(chatId);

    return sanitizedChat;
  } catch (error) {
    console.error(`Error adding message to chat ${chatId}:`, error);
    console.error("Message that failed:", JSON.stringify(message, replacer));
    return undefined;
  }
}

/**
 * Update chat context
 */
export async function updateChatContext(
  chatId: string,
  context: Chat["context"],
): Promise<Chat | undefined> {
  if (!browser) return;

  try {
    const db = await getDB();
    const tx = db.transaction(CHATS_STORE, "readwrite");

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
    const sanitizedChat = sanitizeChatForStorage(chat);

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
export async function clearAllChats(): Promise<void> {
  if (!browser) return;

  const db = await getDB();
  await db.clear(CHATS_STORE);
  console.log("All chats cleared from IndexedDB");
}

/**
 * Export all chats as JSON
 */
export async function exportChatsAsJSON(): Promise<string> {
  if (!browser) return "[]";

  const chats = await getAllChats();
  return JSON.stringify(chats, null, 2);
}

/**
 * Import chats from JSON
 */
export async function importChatsFromJSON(json: string): Promise<number> {
  if (!browser) return 0;

  try {
    const chats = JSON.parse(json) as Chat[];

    if (!Array.isArray(chats)) {
      throw new Error("Invalid JSON format: expected an array of chats");
    }

    await saveChats(chats);
    return chats.length;
  } catch (error) {
    console.error("Error importing chats:", error);
    throw error;
  }
}

/**
 * Helper function to dispatch chat update events
 */
function dispatchChatUpdateEvent(chatId: string): void {
  if (browser) {
    window.dispatchEvent(
      new CustomEvent("userChatsUpdated", {
        detail: { chatId },
      }),
    );
  }
}
