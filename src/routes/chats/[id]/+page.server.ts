import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect, error } from "@sveltejs/kit";
import { loadChatById, loadAllChats } from "../(components)/ChatUtils";
import { ChatService } from "$lib/services/ChatService";

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
        ChatService.cacheChat(sampleChat);
        chat = sampleChat;
      }
    }

    if (!chat) {
      throw error(404, "Chat not found");
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

export const actions: Actions = {
  sendMessage: async ({ request, params, fetch }) => {
    const formData = await request.formData();
    const message = formData.get("message")?.toString();
    const chatId = params.id;

    if (!message) {
      return fail(400, { error: "Message is required" });
    }

    try {
      // In a real app, we would save to the database and then call the API
      // For now, we'll call the API directly
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({
          message,
          chatId,
          stream: false,
          tools: [{ type: "web_search_preview" }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API response: ${response.status}`);
      }

      return { success: true };
    } catch (e) {
      console.error("Error sending message:", e);
      return fail(500, { error: "Failed to process message" });
    }
  },
};
