import { browser } from "$app/environment";
import { chatStore } from "../(components)/ChatStore.svelte";

/** @type {import('./$types').PageLoad} */
export async function load({ data, params }) {
  // If on the server or the chat was found by server load, just return the data
  if (!browser || data.chat) {
    console.log(`[Client] Using server-provided chat data for ${params.id}`);
    return data;
  }

  console.log(
    `[Client] Chat not found on server, trying client-side sources for ${params.id}`,
  );

  // Try to load from chatStore/IndexedDB
  try {
    // Try to load the chat from cache first
    if (chatStore.activeChat?.id === params.id) {
      console.log(`[Client] Chat ${params.id} already active`);
      return { chat: chatStore.activeChat };
    }

    // Set active chat via chatStore
    console.log(`[Client] Setting active chat to ${params.id}`);
    await chatStore.setActiveChat(params.id);

    if (chatStore.activeChat?.id === params.id) {
      console.log(
        `[Client] Successfully loaded chat ${params.id} from ChatStore`,
      );
      return { chat: chatStore.activeChat };
    }

    // Check localStorage backup as a last resort
    if (typeof localStorage !== "undefined") {
      const backupChatJson =
        localStorage.getItem(`chat_backup_${params.id}`) ||
        localStorage.getItem(`chat_fallback_${params.id}`);
      if (backupChatJson) {
        console.log(`[Client] Found chat ${params.id} in localStorage backup`);
        const backupChat = JSON.parse(backupChatJson);

        if (backupChat && backupChat.id === params.id) {
          await chatStore.restoreChat(backupChat);
          return { chat: backupChat };
        }
      }
    }

    // Still not found
    console.log(`[Client] Chat ${params.id} not found in client-side sources`);
    return { chat: null };
  } catch (error) {
    console.error(`[Client] Error loading chat ${params.id}:`, error);
    return {
      chat: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
