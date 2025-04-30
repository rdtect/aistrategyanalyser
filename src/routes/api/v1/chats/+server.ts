import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { idbService } from '$lib/services/IDBService';
import { withErrorHandling } from "$lib/utils/errorHandler";

/**
 * Chats API v1
 * Provides access to chat data
 */

export const POST: RequestHandler = withErrorHandling(async ({ request }) => {
  const { name, context, selectedQuestionIds } = await request.json();
  // Compose a new chat object
  const newChat = {
    id: crypto.randomUUID(),
    name,
    context: context ?? null,
    selectedQuestionIds: selectedQuestionIds ?? [],
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const savedId = await idbService?.saveChat(newChat);
  if (!savedId) throw new Error('Failed to save chat');
  return json({ id: savedId }, { status: 201 });
});

export const GET: RequestHandler = withErrorHandling(async () => {
  const chats = await idbService?.getAllChats();
  return json(chats ?? []);
});
