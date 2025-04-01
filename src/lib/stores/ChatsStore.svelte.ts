import { SvelteMap } from "svelte/reactivity";
import { v4 as uuidv4 } from "uuid";
import type { Chat, Message, ChatContext } from "$lib/types";
import { browser } from "$app/environment";
import { IDBService } from "$lib/services/idb.ts";

// Enhanced store using Svelte 5 runes and SvelteMap for better reactivity and performance
// This file contains only the logic part, to be imported by client-side components

// State container
let chats = $state(new SvelteMap<string, Chat>());
let activeChat = $state<Chat | null>(null);
let isLoading = $state(false);
let error = $state<string | null>(null);

// Derived values
const chatList = $derived(
  Array.from(chats.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  ),
);

// Debug helpers
const debuggingEnabled =
  browser &&
  typeof localStorage !== "undefined" &&
  localStorage.getItem("enableDebug") === "true";

function logDebug(label: string, data: any) {
  if (debuggingEnabled && browser) {
    console.log(`[DEBUG] ${label}:`, data);
  }
}

// Extend ChatContext interface to include selected questions
// Re-declare or import ChatContext if needed, ensuring it includes selectedQuestions
// Assuming ChatContext is defined in $lib/types.ts, we should modify it there ideally,
// but for now, let's augment the usage here.
interface AugmentedChatContext extends ChatContext {
  selectedQuestionIds?: string[];
}

// Default empty context matching the type
const defaultChatContext: ChatContext = {
  id: "", // Default ID
  name: "", // Default Name
  // Add other non-optional fields if they exist in ChatContext type
};

// Initialize the store with optional sample chats
export async function initialize(sampleChats: Chat[] = []) {
  isLoading = true;
  error = null;

  try {
    if (sampleChats.length > 0) {
      // First try to load existing chats from storage
      const existingChats = await IDBService.getAllChats();

      // Process each sample chat
      for (const chat of sampleChats) {
        // Only add if not already in storage
        if (!existingChats.some((existing) => existing.id === chat.id)) {
          // Ensure it has all required properties
          const processedChat: Chat = {
            id: chat.id || uuidv4(),
            name: chat.name || "Untitled Analysis",
            createdAt: chat.createdAt || new Date().toISOString(),
            updatedAt: chat.updatedAt || new Date().toISOString(),
            context: chat.context || undefined,
            messages: Array.isArray(chat.messages) ? chat.messages : [],
          };

          // Add to local state
          chats.set(processedChat.id, processedChat);

          // Save to IndexedDB
          IDBService.saveChat(processedChat).catch((err) => {
            console.error(
              `Failed to save sample chat ${processedChat.id}:`,
              err,
            );
          });
        }
      }

      // Add existing chats to the map
      existingChats.forEach((chat) => {
        chats.set(chat.id, chat);
      });

      logDebug("chatDebug", { chats: Array.from(chats.keys()) });
      console.log(`Initialized with ${chats.size} chats`);
    } else {
      await loadFromStorage();
      logDebug("chatDebug", { chats: Array.from(chats.keys()) });
    }
  } catch (e) {
    console.error("Error initializing chats:", e);
    error = e instanceof Error ? e.message : String(e);
  } finally {
    isLoading = false;
  }
}

// Create a new chat
export async function createChat(
  name = "New Analysis",
  context: Partial<ChatContext> = {}, // Allow partial context initially
  selectedQuestionIds: string[] = [], // Add parameter for selected question IDs
): Promise<string> {
  const id = uuidv4();
  const now = new Date().toISOString();

  // Combine base context with selected question IDs and ensure defaults
  const finalContext: ChatContext = {
    ...defaultChatContext, // Start with defaults
    ...context, // Spread provided partial context
    id: context.id || uuidv4(), // Ensure ID exists, generate if missing
    name: context.name || name, // Use provided name or chat name
    selectedQuestionIds: selectedQuestionIds,
  };

  // Create the chat object with serialized data and match existing schema
  const newChat: Chat = {
    id,
    name,
    messages: [
      {
        id: uuidv4(),
        role: "system" as const,
        content: `You are an AI Strategy Analyst assistant analyzing ${context.company || "a company"} in the ${context.industry || "specified industry"}.`,
        timestamp: now,
        status: "sent",
        index: 0,
      },
    ],
    createdAt: now,
    updatedAt: now,
    context: JSON.parse(JSON.stringify(finalContext)), // Serialize FINAL context
  };

  // Update local state
  chats.set(id, newChat);
  activeChat = newChat;

  // Debug info
  console.log(`Creating new chat with ID: ${id}`, newChat);

  // Save to storage with multiple attempts
  let savedSuccessfully = false;
  let attempts = 0;
  const maxAttempts = 3;

  while (!savedSuccessfully && attempts < maxAttempts) {
    attempts++;
    try {
      console.log(
        `Attempt ${attempts}/${maxAttempts} to save chat ${id} to IndexedDB`,
      );

      // First reinitialize IDB to ensure we have a fresh connection
      if (attempts > 1) {
        console.log(`Reinitializing IDB for attempt ${attempts}`);
        await IDBService.initDB();

        // Additional delay between attempts
        await new Promise((resolve) => setTimeout(resolve, 500 * attempts));
      }

      // Save the chat to IndexedDB
      await saveToStorage(newChat);
      console.log(`Chat ${id} saved to IndexedDB (attempt ${attempts})`);

      // Verify it was saved by trying to retrieve it
      await new Promise((resolve) => setTimeout(resolve, 300));

      const savedChat = await IDBService.getChat(id);
      if (savedChat) {
        console.log(`Chat ${id} verified in IndexedDB`, savedChat);
        savedSuccessfully = true;

        // Also backup to localStorage as a fallback
        if (browser && typeof localStorage !== "undefined") {
          try {
            const chatJson = JSON.stringify(newChat);
            localStorage.setItem(`chat_backup_${id}`, chatJson);
            console.log(`Backup of chat ${id} saved to localStorage`);
          } catch (e) {
            console.warn(`Could not save backup to localStorage:`, e);
          }
        }
      } else {
        console.error(
          `Chat ${id} could not be verified in IndexedDB (attempt ${attempts})`,
        );

        if (attempts < maxAttempts) {
          console.log(`Will retry in ${500 * attempts}ms...`);
        }
      }
    } catch (e) {
      console.error(`Error saving chat ${id} (attempt ${attempts}):`, e);
    }
  }

  // Dispatch update event
  notifyUpdate();

  // Return the ID even if saving failed - we'll still have it in memory
  return id;
}

// Set active chat by ID
export async function setActiveChat(id: string): Promise<void> {
  if (!id) {
    error = `Cannot set active chat: Invalid chat ID`;
    return;
  }

  try {
    // First check if the chat is already loaded in memory
    if (chats.has(id)) {
      console.log(`Chat ${id} found in memory`);
      activeChat = chats.get(id) || null;
      logDebug("chatDebug", {
        action: "setActiveChat",
        source: "memory",
        id,
        chat: activeChat,
      });
      return;
    }

    console.log(`Chat ${id} not in memory, loading from storage...`);
    // Otherwise, try to load it from storage
    const loadedChat = await loadFromStorage(id);

    if (!loadedChat) {
      console.error(`Chat ${id} not found in storage`);
      error = `Chat with ID ${id} not found`;
      logDebug("chatDebug", {
        action: "setActiveChat",
        error: "not found",
        id,
      });

      // Try all means possible to find the chat
      console.log("Attempting to reload all chats from IndexedDB");
      const allChats = await IDBService.getAllChats();
      console.log(
        `Found ${allChats.length} chats in IndexedDB:`,
        allChats.map((c) => c.id),
      );

      return;
    }

    console.log(`Chat ${id} loaded from storage:`, loadedChat);

    // Add to local state and set as active
    chats.set(id, loadedChat);
    activeChat = loadedChat;
    logDebug("chatDebug", {
      action: "setActiveChat",
      source: "storage",
      id,
      chat: activeChat,
    });
  } catch (e) {
    console.error(`Error setting active chat ${id}:`, e);
    error = e instanceof Error ? e.message : String(e);
    logDebug("chatDebug", { action: "setActiveChat", error: String(e), id });
  }
}

// Delete a chat by ID
export async function deleteChat(id: string): Promise<void> {
  if (!id || !chats.has(id)) {
    error = `Chat with ID ${id} not found`;
    return;
  }

  // Remove from local state
  chats.delete(id);

  // Clear active chat if it was the deleted one
  if (activeChat?.id === id) {
    activeChat = null;
  }

  // Remove from storage
  await deleteFromStorage(id);

  // Dispatch update event
  notifyUpdate();
}

// Add message to a chat
export async function addMessage(
  content: string,
  senderRole: "user" | "assistant" | "system" = "user",
  chatId: string | null = null,
): Promise<Message> {
  const targetChatId = chatId || activeChat?.id || null;

  if (!targetChatId) {
    error = "No active chat to add message to";
    throw new Error("No active chat to add message to");
  }

  // Get the target chat
  const chat = chats.get(targetChatId);
  if (!chat) {
    error = `Chat with ID ${targetChatId} not found`;
    throw new Error(`Chat with ID ${targetChatId} not found`);
  }

  // Calculate the next index based on existing messages
  const nextIndex = chat.messages.length;

  // Create the message with the same schema as existing data
  const message: Message = {
    id: uuidv4(),
    role: senderRole,
    content,
    timestamp: new Date().toISOString(),
    status: "sent",
    index: nextIndex,
  };

  // Create updated chat with new message, ensuring data is serialized
  const updatedChat = {
    ...JSON.parse(JSON.stringify(chat)), // Serialize to remove proxy objects
    messages: [...chat.messages, message],
    updatedAt: new Date().toISOString(),
  };

  // Update in chats collection
  chats.set(targetChatId, updatedChat);

  // If this is the active chat, update it too
  if (activeChat && activeChat.id === targetChatId) {
    activeChat = updatedChat;
  }

  // Save to storage
  await saveToStorage(updatedChat);

  // Notify subscribers of the update
  notifyUpdate();

  return message;
}

// Restore a chat from a backup
export async function restoreChat(backupChat: Chat): Promise<void> {
  if (!backupChat || !backupChat.id) {
    error = "Invalid backup chat";
    return;
  }

  try {
    console.log(`Attempting to restore chat ${backupChat.id} from backup`);
    logDebug("chatDebug", { action: "restoreChat", id: backupChat.id });

    // Make sure we have a proper serialized object and validate the schema
    const serializedChat = JSON.parse(JSON.stringify(backupChat));

    // Ensure all messages have the required properties
    if (Array.isArray(serializedChat.messages)) {
      serializedChat.messages = serializedChat.messages.map(
        (msg: any, idx: number) => {
          // Ensure each message has the required format
          return {
            id: msg.id || uuidv4(),
            role: msg.role || "system",
            content: msg.content || "",
            timestamp: msg.timestamp || new Date().toISOString(),
            status: msg.status || "sent",
            index: msg.index !== undefined ? msg.index : idx,
          };
        },
      );
    }

    // Add to local state
    chats.set(serializedChat.id, serializedChat);
    activeChat = serializedChat;

    // Force save to storage
    await saveToStorage(serializedChat);

    // Reset any error
    error = null;

    // Notify subscribers
    notifyUpdate();

    console.log(`Successfully restored chat ${serializedChat.id}`);
  } catch (e) {
    console.error(`Error restoring chat:`, e);
    error = e instanceof Error ? e.message : String(e);
  }
}

// Private methods for storage
async function loadFromStorage(id?: string): Promise<Chat | null> {
  try {
    if (id) {
      // Load a specific chat from ChatService
      console.log(`Loading chat ${id} from ChatService`);
      const chat = await import("$lib/services/ChatService").then((module) =>
        module.ChatService.getChatById(id),
      );
      console.log(`ChatService returned:`, chat);
      return chat;
    } else {
      // Load all chats from ChatService
      console.log(`Loading all chats from ChatService`);
      const allChats = await import("$lib/services/ChatService").then(
        (module) => module.ChatService.getAllChats(),
      );
      console.log(`ChatService returned ${allChats.length} chats`);

      // Debug the IDs
      console.log(
        "Chat IDs from ChatService:",
        allChats.map((c) => c.id),
      );

      // Clear existing chats and add all retrieved chats
      chats = new SvelteMap();
      allChats.forEach((chat) => {
        chats.set(chat.id, chat);
      });

      return null;
    }
  } catch (e) {
    console.error(`Error loading chat${id ? ` ${id}` : "s"} from storage:`, e);
    throw e;
  }
}

async function saveToStorage(chat: Chat): Promise<void> {
  try {
    console.log(`Preparing to save chat ${chat.id} to storage`);

    // Make sure we're not storing any proxy objects
    const serializedChat = JSON.parse(JSON.stringify(chat));

    // Use ChatService with enhanced error handling
    console.log(`Now saving chat ${chat.id} to ChatService...`);
    await import("$lib/services/ChatService")
      .then((module) => module.ChatService.saveChat(serializedChat))
      .catch((error) => {
        console.error(
          `Error in ChatService while saving chat ${chat.id}:`,
          error,
        );
        // As a backup, try the direct IDBService approach
        return IDBService.saveChat(serializedChat);
      });

    console.log(`Chat ${chat.id} saved to storage`);
  } catch (e) {
    console.error(`Error saving chat ${chat.id} to storage:`, e);
    throw e;
  }
}

async function deleteFromStorage(id: string): Promise<void> {
  try {
    // Use ChatService for consistency
    await import("$lib/services/ChatService")
      .then((module) => module.ChatService.deleteChat(id))
      .catch((error) => {
        console.error(`Error in ChatService while deleting chat ${id}:`, error);
        // Fallback to direct IDBService
        return IDBService.deleteChat(id);
      });
  } catch (e) {
    console.error("Error deleting from storage:", e);
    throw e;
  }
}

// Notify about updates
function notifyUpdate(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("userChatsUpdated"));
  }
}

// Export accessor functions instead of the state directly
export function getChatList() {
  return chatList;
}

export function getActiveChat() {
  return activeChat;
}

export function getIsLoading() {
  return isLoading;
}

export function getError() {
  return error;
}
