import type { Chat } from "../types/chat";
import * as storageService from "../services/storageService";

// Type for chat headers (metadata only)
export type ChatHeader = Pick<
  Chat,
  "id" | "name" | "updatedAt" | "createdAt" | "context"
>;

// State using Svelte 5 runes
let chatHeaders = $state<Record<string, ChatHeader>>({});
let selectedChatId = $state<string | null>(null);
let isLoading = $state(false);

// Derived values
const sortedChatHeaders = $derived(() =>
  Object.values(chatHeaders).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  ),
);

// Load only chat headers
async function loadChatHeaders() {
  isLoading = true;
  try {
    const allChats = await storageService.getAllChats();
    const headers: Record<string, ChatHeader> = {};

    allChats.forEach((chat) => {
      // Extract only header info, not messages
      const { id, name, updatedAt, createdAt, context } = chat;
      headers[id] = { id, name, updatedAt, createdAt, context };
    });

    // Update state through property mutation, not reassignment
    Object.keys(chatHeaders).forEach((key) => delete chatHeaders[key]);
    Object.entries(headers).forEach(([key, value]) => {
      chatHeaders[key] = value;
    });
  } catch (error) {
    console.error("Failed to load chat headers:", error);
  } finally {
    isLoading = false;
  }
}

// Get full chat when selected
async function selectChat(id: string) {
  if (!id) return null;

  selectedChatId = id;
  isLoading = true;

  try {
    // Load the full chat with messages from IndexedDB
    const fullChat = await storageService.getChat(id);
    return fullChat;
  } catch (error) {
    console.error(`Failed to load chat ${id}:`, error);
    return null;
  } finally {
    isLoading = false;
  }
}

// Delete a chat
async function deleteChat(id: string) {
  try {
    isLoading = true;
    await storageService.deleteChat(id);

    // Remove from local state
    const { [id]: removed, ...rest } = chatHeaders;

    // Update through property mutation
    Object.keys(chatHeaders).forEach((key) => delete chatHeaders[key]);
    Object.entries(rest).forEach(([key, value]) => {
      chatHeaders[key] = value;
    });

    // Update selected chat if needed
    if (selectedChatId === id) {
      selectedChatId = Object.keys(rest)[0] || null;
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete chat ${id}:`, error);
    return false;
  } finally {
    isLoading = false;
  }
}

// Export getters and actions
export function getHeaders() {
  return chatHeaders;
}

export function getSortedHeaders() {
  return sortedChatHeaders;
}

export function getCurrentId() {
  return selectedChatId;
}

export function getIsLoading() {
  return isLoading;
}

// Export the store object
const chatListStore = {
  loadChatHeaders,
  selectChat,
  deleteChat,

  // Getters
  get headers() {
    return chatHeaders;
  },
  get sortedHeaders() {
    return sortedChatHeaders;
  },
  get currentId() {
    return selectedChatId;
  },
  get isLoading() {
    return isLoading;
  },
};

// Default export for the store
export default chatListStore;
