import type { Chat } from "$lib/features/chat/types/chat";
import * as indexedDb from "./db/indexedDb";
import * as chatService from "$lib/features/chat/services/storageService";
import { error } from "@sveltejs/kit";
import { sampleChats } from "$lib/core/data/sampleChats";
import { browser } from "$app/environment";
import { chatAdapter } from "$lib/core/patterns/adapters/ChatAdapter";

const isBrowser = typeof window !== "undefined";

/**
 * Load all chats with their messages
 * Centralizes chat loading logic to avoid duplication
 */
export async function loadAllChats(): Promise<{
  success: boolean;
  chats: Chat[];
}> {
  // For server-side rendering, return sample chats
  if (!isBrowser) {
    console.log(
      `Server-side rendering: returning ${sampleChats.length} sample chats`,
    );
    return { success: true, chats: sampleChats };
  }

  try {
    // Use the chat service instead of direct IndexedDB access
    const chats = await chatService.getAllChats();
    console.log(
      `Server utils loaded ${chats.length} chats from storage service`,
    );
    return { success: true, chats };
  } catch (error) {
    console.error("Error loading chats:", error);
    return { success: false, chats: [] };
  }
}

/**
 * Load a specific chat by ID
 * @throws {Error} If chat is not found and not a new chat
 */
export async function loadChatById(
  id: string,
): Promise<{ success: boolean; currentChat: Chat | null }> {
  // For server-side rendering, use sample chats
  if (!isBrowser) {
    console.log("Server-side rendering: checking sample chats for", id);

    // Find the chat with the matching ID
    const chat = sampleChats.find((chat) => chat.id === id);

    if (chat) {
      console.log(
        `Server-side rendering: found sample chat for ${id}: ${chat.name}`,
      );
      return { success: true, currentChat: chat };
    } else {
      console.log(`Server-side rendering: no sample chat found for ${id}`);
      return { success: true, currentChat: null };
    }
  }

  try {
    console.log(`Server utils: Loading chat ${id} from storage service`);
    const chat = await chatService.getChat(id);
    console.log(`Server utils: Chat ${id} load result:`, !!chat);
    // Explicitly convert undefined to null to match the expected return type
    return { success: true, currentChat: chat || null };
  } catch (error) {
    console.error(`Error loading chat ${id}:`, error);
    return { success: false, currentChat: null };
  }
}

export async function saveChat(chat: Chat): Promise<{ success: boolean }> {
  // Skip saving for server-side rendering
  if (!isBrowser) {
    return { success: true };
  }

  try {
    // Use the chat service instead of direct IndexedDB access
    await chatService.saveChat(chat);
    return { success: true };
  } catch (error) {
    console.error("Error saving chat:", error);
    return { success: false };
  }
}

export async function deleteChat(id: string): Promise<{ success: boolean }> {
  // Skip deletion for server-side rendering
  if (!isBrowser) {
    return { success: true };
  }

  try {
    // Use the chat service instead of direct IndexedDB access
    await chatService.deleteChat(id);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting chat ${id}:`, error);
    return { success: false };
  }
}

/**
 * Loads a chat by ID from browser storage (IndexedDB)
 * This is a client-side only function
 */
export async function loadChatByIdFromStorage(
  id: string,
): Promise<Chat | null> {
  if (!browser) {
    console.warn("[Client] loadChatByIdFromStorage called on server");
    return null;
  }

  if (!id || id === "undefined") {
    console.error(
      "[Client] Invalid chat ID provided to loadChatByIdFromStorage:",
      id,
    );
    return null;
  }

  try {
    // Import the storage service dynamically
    const { storageService } = await import(
      "$lib/features/chat/services/storageService"
    );
    await storageService.initDB();

    // Try to get the chat from IndexedDB
    const chat = await storageService.getChat(id);

    if (chat) {
      console.log("[Client] Chat found in IndexedDB:", id);
      return chat;
    }

    // If not found, check if it's a sample chat
    const sampleChat = sampleChats.find((c) => c.id === id);
    if (sampleChat) {
      console.log("[Client] Found matching sample chat:", id);
      // Use the adapter to normalize the sample chat
      const normalizedChat = chatAdapter.adapt(sampleChat);

      // Try to save this to IndexedDB for future use
      try {
        await storageService.saveChat(normalizedChat);
        console.log("[Client] Saved sample chat to IndexedDB");
      } catch (saveError) {
        console.error(
          "[Client] Failed to save sample chat to IndexedDB:",
          saveError,
        );
      }

      return normalizedChat;
    }

    console.log("[Client] Chat not found in any source:", id);
    return null;
  } catch (error) {
    console.error("[Client] Error in loadChatByIdFromStorage:", error);
    return null;
  }
}
