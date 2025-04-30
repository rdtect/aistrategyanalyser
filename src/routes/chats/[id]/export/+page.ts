/** @type {import('./$types').PageLoad} */
import { error } from "@sveltejs/kit";
// import { ChatService } from "../../(lib)/ChatService"; // Commented out
import type { PageLoad } from "./$types";
import type { Chat, Message } from "$lib/types"; // Updated path
import { validateUuidParam } from "$lib/utils/urlUtils";

// Define expected parent data structure (adjust as needed)
interface ParentData {
  chat?: Chat | null; // Make chat optional or ensure it's always loaded
  // Add other properties loaded by parent layouts if any
}

export const load: PageLoad = async ({ params }) => {
  // const chatId = validateUuidParam(params);
  // if (!chatId) {
  //   throw error(400, "Invalid chat ID");
  // }
  // try {
  //   // Note: Fetching the full chat might be heavy for the client.
  //   // Consider if only specific data (like name) is needed for the export page UI itself.
  //   // If the actual export happens server-side, this might just need the chat name.
  //   const chat = await ChatService.getChatById(chatId); // Needs adaptation if ChatService isn't client-side
  //   if (!chat) {
  //     throw error(404, "Chat not found");
  //   }
  //   return { chatName: chat.name };
  // } catch (e) {
  //   console.error(`Failed to load chat ${chatId} info for export page:`, e);
  //   throw error(500, "Failed to load chat info");
  // }
  console.warn(
    "ChatService not available, returning mock name for export page",
  );
  return { chatName: "Mock Chat Export" };
};
