import { error } from "@sveltejs/kit";
import { getChat } from "$lib/server/db/supabase";
import type { PageServerLoad } from "./$types";
import type { Chat, Message } from "$lib/types";
import { marked } from "marked";

export const load: PageServerLoad = async ({ params }) => {
  const chatId = params.id;

  // Ensure getChat returns Promise<Chat | null> or similar
  const chat: Chat | null = await getChat(chatId);

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
    // Use 'role' based on the type definition
    const role =
      msg.role === "user"
        ? "User"
        : msg.role === "assistant"
          ? "Assistant"
          : "System";

    // Basic formatting, assuming content is plain text
    markdown += `**${role}:**\n${content}\n\n`;

    // TODO: Add more sophisticated formatting for potential markdown/code in messages
  });

  // Generate HTML for preview
  // Consider adding error handling for marked.parse if markdown can be invalid
  const html = marked.parse(markdown);

  return {
    chat: chat, // Pass the resolved chat object
    markdownContent: markdown,
    html,
  };
};
