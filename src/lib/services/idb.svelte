<script module lang="ts">
  /**
   * IndexedDB Service for chat data persistence
   * Uses Svelte 5 runes for reactive state management
   */

import { browser } from "$app/environment";
import { openDB, type IDBPDatabase } from "idb";
import type {
  Chat,
  Message,
  ChatContext,
} from "../../routes/chats/types";

// Database configuration
const DB_NAME = "ai-chat-db";
const DB_VERSION = 1;
const CHATS_STORE = "chats";

// Service state using runes
let db = $state<IDBPDatabase | null>(null);
let isInitialized = $state(false);
let fallbackStorage = $state<Map<string, Chat>>(new Map());

// Initialize database
async function initDB() {
  if (!browser) return;

  try {
    console.log("Initializing IndexedDB connection...");
    
    // Enforce a clean connection by closing any existing connection first
    if (db) {
      console.log("Closing existing IDB connection before reinitializing");
      db.close();
      db = null;
    }
    
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        console.log("Upgrading IndexedDB schema...");
        if (!db.objectStoreNames.contains(CHATS_STORE)) {
          console.log("Creating chats store");
          db.createObjectStore(CHATS_STORE, { keyPath: "id" });
        }
      },
      blocking() {
        console.log("IndexedDB blocking event triggered");
      },
      blocked() {
        console.log("IndexedDB blocked event triggered");
      },
      terminated() {
        console.log("IndexedDB connection was terminated unexpectedly");
        isInitialized = false;
      }
    });
    
    isInitialized = true;
    console.log("IndexedDB initialized successfully");
    
    // Check if we can read/write
    try {
      const testData = { id: "test", value: "test" };
      await db.put(CHATS_STORE, testData);
      const result = await db.get(CHATS_STORE, "test");
      if (result) {
        console.log("IndexedDB read/write test passed");
        await db.delete(CHATS_STORE, "test");
      } else {
        console.error("IndexedDB read/write test failed: couldn't read test data");
      }
    } catch (testError) {
      console.error("IndexedDB read/write test failed:", testError);
    }
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
    // Fallback to in-memory storage
    fallbackStorage = new Map();
    console.log("Using in-memory fallback storage due to IndexedDB failure");
  }
}

// Get a chat by ID
async function getChat(id: string): Promise<Chat | null> {
  if (!isInitialized) {
    console.log(`IDB: Service not initialized, reinitializing before getting chat ${id}`);
    await initDB();
  }

  try {
    if (db) {
      console.log(`IDB: Fetching chat ${id} from IndexedDB`);
      const chat = await db.get(CHATS_STORE, id);
      console.log(`IDB: ${chat ? 'Found' : 'Did not find'} chat ${id}`);
      
      if (!chat) {
        // Try localStorage fallback
        if (browser && typeof localStorage !== 'undefined') {
          try {
            const fallbackJson = localStorage.getItem(`chat_fallback_${id}`) || 
                                localStorage.getItem(`chat_backup_${id}`);
            if (fallbackJson) {
              console.log(`IDB: Found chat ${id} in localStorage fallback`);
              const fallbackChat = JSON.parse(fallbackJson);
              
              // If found in localStorage, try to restore it to IndexedDB
              if (fallbackChat && fallbackChat.id === id) {
                console.log(`IDB: Restoring chat ${id} from localStorage to IndexedDB`);
                try {
                  await db.put(CHATS_STORE, fallbackChat);
                  console.log(`IDB: Successfully restored chat ${id} to IndexedDB`);
                } catch (restoreErr) {
                  console.error(`IDB: Failed to restore chat to IndexedDB:`, restoreErr);
                }
                return fallbackChat;
              }
            }
          } catch (lsError) {
            console.error(`IDB: Error checking localStorage fallback:`, lsError);
          }
        }
      }
      
      return chat || null;
    }
    console.log(`IDB: Using fallback storage for chat ${id}`);
    return fallbackStorage.get(id) || null;
  } catch (error) {
    console.error(`IDB: Error getting chat ${id}:`, error);
    console.log(`IDB: Falling back to in-memory storage`);
    
    // Try localStorage as a last resort
    if (browser && typeof localStorage !== 'undefined') {
      try {
        const fallbackJson = localStorage.getItem(`chat_fallback_${id}`) || 
                            localStorage.getItem(`chat_backup_${id}`);
        if (fallbackJson) {
          console.log(`IDB: Found chat ${id} in localStorage during error recovery`);
          return JSON.parse(fallbackJson);
        }
      } catch (lsError) {
        console.error(`IDB: Error checking localStorage during recovery:`, lsError);
      }
    }
    
    return fallbackStorage.get(id) || null;
  }
}

// Get all chats
async function getAllChats(): Promise<Chat[]> {
  if (!isInitialized) await initDB();

  try {
    if (db) {
      return await db.getAll(CHATS_STORE);
    }
    return Array.from(fallbackStorage.values());
  } catch (error) {
    console.error("Error getting all chats:", error);
    return Array.from(fallbackStorage.values());
  }
}

// Save a chat
async function saveChat(chat: Chat): Promise<void> {
  if (!isInitialized) {
    console.log(`IDB: Service not initialized, reinitializing before saving chat ${chat.id}`);
    await initDB();
  }

  // Ensure we're not using a proxy object
  const serializedChat = JSON.parse(JSON.stringify(chat));

  try {
    if (db) {
      console.log(`IDB: Starting save of chat ${chat.id} to IndexedDB`);
      // Try to get existing chat first to confirm read works
      try {
        const existingChat = await db.get(CHATS_STORE, chat.id);
        console.log(`IDB: Read test before save ${chat.id}: ${existingChat ? 'successful' : 'not found (new chat)'}`);
      } catch (readErr) {
        console.warn(`IDB: Read test failed before save: ${readErr}`);
        // Reopen the database if read fails
        db.close();
        await initDB();
        console.log(`IDB: Reopened IndexedDB connection after read failure`);
      }
      
      // Now perform the actual save
      await db.put(CHATS_STORE, serializedChat);
      console.log(`IDB: Successfully saved chat ${chat.id}`);
      
      // Verify the write immediately
      try {
        const verifyChat = await db.get(CHATS_STORE, chat.id);
        if (verifyChat) {
          console.log(`IDB: Verify after save for ${chat.id} successful`);
        } else {
          console.error(`IDB: Verify after save for ${chat.id} failed - chat not found after save`);
          throw new Error("Chat not found after save - database may be inconsistent");
        }
      } catch (verifyErr) {
        console.error(`IDB: Verify after save failed: ${verifyErr}`);
        throw verifyErr;
      }
    } else {
      console.log(`IDB: Using fallback storage to save chat ${chat.id}`);
      fallbackStorage.set(chat.id, serializedChat);
    }
  } catch (error) {
    console.error(`IDB: Error saving chat ${chat.id}:`, error);
    console.log(`IDB: Falling back to in-memory storage`);
    fallbackStorage.set(chat.id, serializedChat);
    
    // Also save to localStorage as a deeper fallback
    if (browser && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`chat_fallback_${chat.id}`, JSON.stringify(serializedChat));
        console.log(`IDB: Saved fallback of chat ${chat.id} to localStorage`);
      } catch (lsError) {
        console.error(`IDB: Could not save fallback to localStorage:`, lsError);
      }
    }
    
    throw error;
  }
}

// Delete a chat
async function deleteChat(id: string): Promise<void> {
  if (!isInitialized) await initDB();

  try {
    if (db) {
      await db.delete(CHATS_STORE, id);
    } else {
      fallbackStorage.delete(id);
    }
  } catch (error) {
    console.error("Error deleting from storage:", error);
    fallbackStorage.delete(id);
  }
}

// Add a message to a chat
async function addMessageToChat(
  chatId: string,
  message: Message,
): Promise<void> {
  const chat = await getChat(chatId);
  if (!chat) throw new Error(`Chat ${chatId} not found`);

  chat.messages.push(message);
  chat.updatedAt = new Date().toISOString();

  await saveChat(chat);
}

// Initialize with sample data if needed
async function initializeWithSampleData(sampleChats: Chat[]): Promise<void> {
  if (!isInitialized) await initDB();

  try {
    for (const chat of sampleChats) {
      await saveChat(chat);
    }
  } catch (error) {
    console.error("Error initializing with sample data:", error);
  }
}

// Add this function to the IDBService
async function importChatFromJson(jsonString: string): Promise<string | null> {
  if (!browser) return null;
  
  try {
    // Parse the chat from JSON
    const chat = JSON.parse(jsonString);
    
    // Validate that it's a chat object with required fields
    if (!chat || !chat.id || !Array.isArray(chat.messages)) {
      console.error('IDB: Invalid chat data for import');
      return null;
    }
    
    console.log(`IDB: Importing chat ${chat.id} from JSON`);
    
    // Initialize if needed
    if (!isInitialized) {
      await initDB();
    }
    
    // Save the chat to IndexedDB
    await saveChat(chat);
    
    // Verify it was saved
    const savedChat = await getChat(chat.id);
    if (savedChat) {
      console.log(`IDB: Successfully imported chat ${chat.id}`);
      return chat.id;
    } else {
      console.error(`IDB: Failed to verify imported chat ${chat.id}`);
      return null;
    }
  } catch (error) {
    console.error('IDB: Error importing chat from JSON:', error);
    return null;
  }
}

// Export the service
export const IDBService = {
  initDB,
  getChat,
  getAllChats,
  saveChat,
  deleteChat,
  addMessageToChat,
  initializeWithSampleData,
  importChatFromJson,
};
</script>

<script lang="ts">
  // This is a module file, not a component
</script>