import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { ChatService } from "$lib/services/ChatService";
import { withErrorHandling } from "$lib/utils/errorHandler";

/**
 * Chats API v1
 * Provides access to chat data
 */

export const GET: RequestHandler = withErrorHandling(async () => {
  const chats = await ChatService.getAllChats();
  return json(chats);
});

export const POST: RequestHandler = withErrorHandling(async ({ request }) => {
  const chatData = await request.json();

  if (!chatData) {
    return new Response("Invalid chat data", { status: 400 });
  }

  // Ensure we have a valid chat object
  if (!chatData.name) {
    return new Response("Chat name is required", { status: 400 });
  }

  try {
    // Save the chat to storage
    await ChatService.saveChat(chatData);

    return json(
      {
        id: chatData.id,
        status: "created",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating chat:", error);
    return new Response(
      `Failed to create chat: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 },
    );
  }
});
