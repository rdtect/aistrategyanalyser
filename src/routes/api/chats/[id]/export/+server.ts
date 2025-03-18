import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";
import { marked } from "marked";

export const GET: RequestHandler = async ({ params, url }) => {
  const { id } = params;
  const format = url.searchParams.get("format") || "markdown";

  if (!["markdown", "html", "json"].includes(format)) {
    throw error(400, "Invalid format. Must be markdown, html, or json.");
  }

  try {
    // Get chat with messages
    const chat = await prisma.chat.findUnique({
      where: { id },
      include: { messages: true },
    });

    if (!chat) {
      throw error(404, "Chat not found");
    }

    // Get analysis if associated
    const analysis = await prisma.analysis.findFirst({
      where: { chatId: id },
      include: {
        questions: true,
        responses: true,
      },
    });

    // Generate content based on format
    if (format === "json") {
      // Return the chat data as JSON
      const jsonData = {
        chat,
        analysis,
        exportedAt: new Date().toISOString(),
      };

      return new Response(JSON.stringify(jsonData, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="chat-${id}-export.json"`,
        },
      });
    } else {
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
        // Regular messages
        else {
          const senderLabel = msg.sender === "user" ? "**User:**" : "**AI:**";
          markdown += `${senderLabel} ${content}\n\n`;
        }
      });

      if (format === "html") {
        // Convert markdown to HTML and return
        const html = marked.parse(markdown);
        const fullHtml = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Strategic Analysis: ${chat.name}</title>
            <style>
              body {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                color: #1a1a1a;
              }
              h1, h2, h3 {
                margin-top: 2em;
                margin-bottom: 0.5em;
              }
              pre {
                background-color: #f5f5f5;
                padding: 1em;
                border-radius: 5px;
                overflow-x: auto;
              }
              code {
                font-family: monospace;
                background-color: #f5f5f5;
                padding: 0.2em 0.4em;
                border-radius: 3px;
              }
              blockquote {
                border-left: 4px solid #ddd;
                padding-left: 1em;
                margin-left: 0;
                color: #666;
              }
              img {
                max-width: 100%;
              }
              table {
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f5f5f5;
              }
            </style>
          </head>
          <body>
            ${html}
          </body>
          </html>
        `;

        return new Response(fullHtml, {
          headers: {
            "Content-Type": "text/html",
            "Content-Disposition": `attachment; filename="chat-${id}-export.html"`,
          },
        });
      } else {
        // Return markdown
        return new Response(markdown, {
          headers: {
            "Content-Type": "text/markdown",
            "Content-Disposition": `attachment; filename="chat-${id}-export.md"`,
          },
        });
      }
    }
  } catch (err) {
    console.error("Export error:", err);
    throw error(500, "An error occurred while generating the export");
  }
};
