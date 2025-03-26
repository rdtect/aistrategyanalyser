import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { ChatService } from "$lib/services/ChatService";
import { withErrorHandling } from "$lib/utils/errorHandler";
import { validateUuidParam } from "$lib/utils";

/**
 * Single Chat API v1
 * Provides access to individual chat data and operations
 */

export const GET: RequestHandler = withErrorHandling(async ({ params }) => {
  const chatId = validateUuidParam(params);

  if (!chatId) {
    return new Response("Invalid chat ID", { status: 400 });
  }

  const chat = await ChatService.getChatById(chatId);

  if (!chat) {
    return new Response("Chat not found", { status: 404 });
  }

  return json(chat);
});

export const PUT: RequestHandler = withErrorHandling(
  async ({ request, params }) => {
    const chatId = validateUuidParam(params);

    if (!chatId) {
      return new Response("Invalid chat ID", { status: 400 });
    }

    const chatData = await request.json();

    if (!chatData || chatData.id !== chatId) {
      return new Response("Invalid chat data or ID mismatch", { status: 400 });
    }

    // Check if the chat exists
    const existingChat = await ChatService.getChatById(chatId);
    if (!existingChat) {
      return new Response("Chat not found", { status: 404 });
    }

    try {
      // Update the chat
      await ChatService.saveChat(chatData);

      return json({
        id: chatId,
        status: "updated",
      });
    } catch (error) {
      console.error(`Error updating chat ${chatId}:`, error);
      return new Response(
        `Failed to update chat: ${error instanceof Error ? error.message : "Unknown error"}`,
        { status: 500 },
      );
    }
  },
);

export const DELETE: RequestHandler = withErrorHandling(async ({ params }) => {
  const chatId = validateUuidParam(params);

  if (!chatId) {
    return new Response("Invalid chat ID", { status: 400 });
  }

  try {
    // Check if the chat exists first
    const existingChat = await ChatService.getChatById(chatId);
    if (!existingChat) {
      return new Response("Chat not found", { status: 404 });
    }

    await ChatService.deleteChat(chatId);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting chat ${chatId}:`, error);
    return new Response(
      `Failed to delete chat: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 },
    );
  }
});
