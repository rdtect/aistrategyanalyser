import { json, error as svelteError } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { ChatService } from "$lib/services/ChatService";
import { withErrorHandling } from "$lib/utils/errorHandler";
import { validateUuidParam } from "$lib/utils/validateUuidParam";

/**
 * Single Chat API v1
 * Provides access to individual chat data and operations
 */

export const GET: RequestHandler = withErrorHandling(async ({ params }) => {
  if (!params.id) {
    throw svelteError(400, "Chat ID parameter is missing");
  }
  const chatId = validateUuidParam(params.id);

  if (!chatId) {
    throw svelteError(400, "Invalid chat ID format");
  }

  const chat = await ChatService.getChatById(chatId);

  if (!chat) {
    throw svelteError(404, "Chat not found");
  }

  return json(chat);
});

export const PUT: RequestHandler = withErrorHandling(
  async ({ request, params }) => {
    if (!params.id) {
      throw svelteError(400, "Chat ID parameter is missing");
    }
    const chatId = validateUuidParam(params.id);

    if (!chatId) {
      throw svelteError(400, "Invalid chat ID format");
    }

    const chatData = await request.json();

    if (!chatData || typeof chatData !== "object" || chatData.id !== chatId) {
      throw svelteError(400, "Invalid chat data or ID mismatch");
    }

    const existingChat = await ChatService.getChatById(chatId);
    if (!existingChat) {
      throw svelteError(404, "Chat not found");
    }

    try {
      await ChatService.saveChat(chatData);

      return json({
        id: chatId,
        status: "updated",
      });
    } catch (err) {
      console.error(`Error updating chat ${chatId}:`, err);
      const message = err instanceof Error ? err.message : "Unknown error";
      throw svelteError(500, `Failed to update chat: ${message}`);
    }
  },
);

export const DELETE: RequestHandler = withErrorHandling(async ({ params }) => {
  if (!params.id) {
    throw svelteError(400, "Chat ID parameter is missing");
  }
  const chatId = validateUuidParam(params.id);

  if (!chatId) {
    throw svelteError(400, "Invalid chat ID format");
  }

  try {
    const existingChat = await ChatService.getChatById(chatId);
    if (!existingChat) {
      throw svelteError(404, "Chat not found");
    }

    await ChatService.deleteChat(chatId);

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(`Error deleting chat ${chatId}:`, err);
    const message = err instanceof Error ? err.message : "Unknown error";
    throw svelteError(500, `Failed to delete chat: ${message}`);
  }
});
