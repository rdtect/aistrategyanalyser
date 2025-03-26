/** @type {import('./$types').PageLoad} */
import { loadChatById } from "../../(components)/ChatUtils";
import { marked } from "marked";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const { id } = params;
  const chat = loadChatById(id);

  // During server-side rendering, we'll return minimal data
  // The full data will be loaded on the client side
  if (typeof window === "undefined") {
    return {
      chat: null,
      markdown: "",
      html: "",
    };
  }

  if (!chat) {
    return { status: 302, redirect: "/chats" };
  }

  // Generate markdown
  let markdown = `# Strategic Analysis: ${chat.name}\n\n`;
  markdown += `*Generated: ${new Date().toLocaleDateString()}*\n\n`;

  // Add company information if available
  if (chat.context?.company) {
    markdown += `## Company Information\n\n`;
    markdown += `- **Company:** ${chat.context.company}\n`;
    markdown += `- **Industry:** ${chat.context.industry || "N/A"}\n`;
    markdown += `- **Region:** ${chat.context.region || "N/A"}\n\n`;
  }

  markdown += `## Analysis Results\n\n`;

  // Add messages excluding system messages
  let currentQuestion = "";

  chat.messages.forEach((msg) => {
    const content = msg.content;

    // Check if it's a question header
    if (msg.sender === "user" && content.startsWith("## ")) {
      currentQuestion = content;
      markdown += `${content}\n\n`;
    }
    // If it's an AI response to a question
    else if (msg.sender === "ai" && currentQuestion) {
      markdown += `${content}\n\n`;
      currentQuestion = "";
    }
    // Skip other system or administrative messages
  });

  // Generate HTML for preview
  const html = marked.parse(markdown);

  return {
    chat,
    markdown,
    html,
  };
};
