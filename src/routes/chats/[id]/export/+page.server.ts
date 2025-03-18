import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db";
import { marked } from "marked";

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;

  // Get chat with messages
  const chat = await prisma.chat.findUnique({
    where: { id },
    include: { messages: true },
  });

  if (!chat) {
    throw redirect(302, "/chats");
  }

  // Get analysis if associated
  const analysis = await prisma.analysis.findFirst({
    where: { chatId: id },
    include: {
      questions: true,
      responses: true,
    },
  });

  // Generate markdown
  let markdown = `# Strategic Analysis: ${chat.name}\n\n`;
  markdown += `*Generated: ${new Date().toLocaleDateString()}*\n\n`;

  if (analysis) {
    markdown += `## Company Information\n\n`;
    markdown += `- **Company:** ${analysis.company}\n`;
    markdown += `- **Industry:** ${analysis.industry}\n`;
    markdown += `- **Region:** ${analysis.region}\n`;

    if (analysis.additionalContext) {
      markdown += `\n### Additional Context\n\n${analysis.additionalContext}\n\n`;
    }
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
    analysis,
    markdown,
    html,
  };
};
