import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect, error } from "@sveltejs/kit";
import { loadChatById, loadAllChats } from "../(components)/ChatUtils";
import { ChatService } from "$lib/services/ChatService";
import type { Chat } from "$lib/types";

/**
 * Load data for a specific chat with error handling
 */
export const load: PageServerLoad = async ({ params, parent, fetch }) => {
  // Retrieve sample chats from parent layout load
  const { sampleChats } = await parent();
  let chat = null;
  let errorMessage = null;

  try {
    // Try to load the chat from our service
    chat = await loadChatById(params.id);

    // As a fallback, search in sample chats if not found
    if (!chat && sampleChats) {
      const sampleChat = sampleChats.find((c) => c.id === params.id);
      if (sampleChat) {
        // Cache the sample chat for future requests
        ChatService.cacheChat(sampleChat as Chat);
        chat = sampleChat;
      }
    }

    if (!chat) {
      console.log(`Chat ${params.id} not found, creating sample...`);
      // Create a basic sample chat matching the Chat type structure
      const sampleChat = {
        id: params.id,
        name: "Sample Chat",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        context: {
          id: `context-${params.id}`, // Add context ID
          name: `Context for ${params.id}`, // Add context name
          // Add other default context fields if necessary
        },
        messages: [
          {
            role: "system",
            content: "Welcome to the sample chat!",
            timestamp: new Date().toISOString(),
            status: "sent",
            index: 0,
          },
        ], // Add empty messages array
      };

      // Cache the sample chat for future requests
      ChatService.cacheChat(sampleChat as Chat);
      chat = sampleChat;
    }

    console.log(`Chat ${params.id} loaded successfully`);
  } catch (err) {
    console.error(`Error loading chat ${params.id}:`, err);
    errorMessage = err instanceof Error ? err.message : String(err);

    // Don't throw error here, we'll handle it in the page component
    // This allows us to show better error messages to the user
  }

  // Load all chats for the sidebar navigation
  const chats = await loadAllChats();
  console.log(`[Server] Loaded ${chats.length} chats for sidebar`);

  return {
    chatId: params.id,
    chat,
    chats,
    error: errorMessage,
  };
};

export const actions: Actions = {};
