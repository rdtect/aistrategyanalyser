import { error } from "@sveltejs/kit";
// import { ChatService } from "../../(lib)/ChatService"; // Ensure this remains commented if ChatService is not available
import type { PageServerLoad } from "./$types";
import type { Chat, Message } from "$lib/types";
import { marked } from "marked";

export const load: PageServerLoad = async ({ params }) => {
  const chatId = params.id;
  try {
    // Ensure ChatService usage is commented out if it doesn't exist
    // const chatFromService: Chat | null = await ChatService.getChatById(chatId);
    // TEMP FIX: Use a placeholder or fetch logic if ChatService is unavailable
    const chat: Chat | null = null; // Replace with actual data fetching later

    if (!chat) {
      throw error(404, "Chat not found (or ChatService not implemented)");
    }

    // Assert type after null check to satisfy TypeScript
    const confirmedChat = chat as Chat;

    // Generate markdown using confirmedChat
    let markdown = `# Strategic Analysis: ${confirmedChat.name || "Unknown Chat"}\n\n`;
    markdown += `*Generated: ${new Date().toLocaleDateString()}*\n\n`;

    // Add company information if available
    if (confirmedChat.context?.company) {
      markdown += `## Company Information\n\n`;
      markdown += `- **Company:** ${confirmedChat.context.company}\n`;
      markdown += `- **Industry:** ${confirmedChat.context.industry || "N/A"}\n`;
      markdown += `- **Region:** ${confirmedChat.context.region || "N/A"}\n\n`;
    }

    markdown += `## Conversation\n\n`;

    // Add messages using confirmedChat
    confirmedChat.messages?.forEach((msg: Message) => {
      const content = msg.content;
      const role =
        msg.role === "user"
          ? "User"
          : msg.role === "assistant"
            ? "Assistant"
            : "System";
      markdown += `**${role}:**\n${content}\n\n`;
    });

    // Generate HTML for preview
    // Consider adding error handling for marked.parse if markdown can be invalid
    const html = marked.parse(markdown);

    return {
      chat: confirmedChat, // Return the asserted chat object
      markdownContent: markdown,
      html,
    };
  } catch (err: any) {
    console.error(`Error loading chat for export: ${chatId}`, err);
    if (
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      err.status === 404
    ) {
      throw err;
    }
    throw error(500, "Failed to load chat data for export");
  }
};
