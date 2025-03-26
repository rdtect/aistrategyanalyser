import { IDBService } from "$lib/services/idb.svelte";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Get the JSON data from the request
    const { chatJson } = await request.json();

    if (!chatJson || typeof chatJson !== "string") {
      return new Response(
        "Invalid chat data. Expected a JSON string in the 'chatJson' field.",
        { status: 400 },
      );
    }

    // Import the chat
    const chatId = await IDBService.importChatFromJson(chatJson);

    if (!chatId) {
      return new Response("Failed to import chat. See logs for details.", {
        status: 500,
      });
    }

    // Return success with the chat ID
    return json({ success: true, chatId });
  } catch (error) {
    console.error(`Error importing chat:`, error);
    return new Response("Internal server error", { status: 500 });
  }
};
