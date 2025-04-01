/** @type {import('./$types').PageLoad} */
import { error } from "@sveltejs/kit";
import { ChatService } from "$lib/services/ChatService";
import type { PageLoad } from "./$types";
import type { Chat, Message } from "$lib/types"; // Updated path

// Define expected parent data structure (adjust as needed)
interface ParentData {
  chat?: Chat | null; // Make chat optional or ensure it's always loaded
  // Add other properties loaded by parent layouts if any
}

export const load: PageLoad = async ({ params, parent }) => {
  const chatId = params.id;
  // Use type assertion for parent data
  const { chat: parentChat } = (await parent()) as ParentData;

  let chat: Chat | null = null;

  // Check if parentChat exists and matches the current chatId
  if (parentChat && parentChat.id === chatId) {
    chat = parentChat;
  } else {
    // Use ChatService to get the chat on the client-side
    chat = await ChatService.getChatById(chatId);
  }

  if (!chat) {
    throw error(404, "Chat not found");
  }

  // Generate markdown - Now 'chat' is resolved
  let markdown = `# Strategic Analysis: ${chat.name}\n\n`;
  markdown += `*Generated: ${new Date().toLocaleDateString()}*\n\n`;

  // Add company information if available
  if (chat.context?.company) {
    markdown += `## Company Information\n\n`;
    markdown += `- **Company:** ${chat.context.company}\n`;
    markdown += `- **Industry:** ${chat.context.industry || "N/A"}\n`;
    markdown += `- **Region:** ${chat.context.region || "N/A"}\n\n`;
  }

  markdown += `## Conversation\n\n`;

  // Add messages
  chat.messages.forEach((msg: Message) => {
    // Add type to msg
    const content = msg.content;
    // Use 'role' based on the corrected type/data
    const role =
      msg.role === "user"
        ? "User"
        : msg.role === "assistant"
          ? "Assistant"
          : "System";

    // Basic formatting
    markdown += `**${role}:**\n${content}\n\n`;
  });

  return {
    chat: chat, // Pass the resolved chat object
    markdownContent: markdown,
    // stream: { // Example if you were streaming data
    //   chat: chatPromise // Pass the promise if needed downstream
    // }
  };
};
