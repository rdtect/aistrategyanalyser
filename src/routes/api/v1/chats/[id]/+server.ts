import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { idbService } from '$lib/services/IDBService';
import { withErrorHandling } from "$lib/utils/errorHandler";
import { validateUuidParam } from "$lib/utils/urlUtils";

/**
 * Single Chat API v1
 * Provides access to individual chat data and operations
 */

// Define params type
type Params = { id: string };

export const GET: RequestHandler = withErrorHandling(async ({ params }) => {
  const safeId = params.id ?? "";
  const chat = await idbService?.getChat(safeId);
  if (!chat) {
    return json({ error: 'Chat not found' }, { status: 404 });
  }
  return json(chat);
});

export const DELETE: RequestHandler = withErrorHandling(async ({ params }) => {
  const safeId = params.id ?? "";
  const success = await idbService?.deleteChat(safeId);
  if (!success) {
    return json({ error: 'Failed to delete chat' }, { status: 500 });
  }
  return json({ success: true }, { status: 200 });
});

export const PUT: RequestHandler = withErrorHandling(async ({ request, params }) => {
  const safeId = params.id ?? "";
  const updatedChat = await request.json();
  if (!updatedChat || updatedChat.id !== safeId) {
    return json({ error: 'Invalid chat data or ID mismatch' }, { status: 400 });
  }
  const savedId = await idbService?.saveChat(updatedChat);
  if (!savedId) {
    return json({ error: 'Failed to update chat' }, { status: 500 });
  }
  return json(updatedChat, { status: 200 });
});
