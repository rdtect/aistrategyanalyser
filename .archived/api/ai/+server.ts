import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createResponse } from "$lib/_archived/lib/server/services/openaiServer";
import { extractTextFromResponse } from "$lib/services/openaiService";
import { sampleMessages } from "$lib/data/sampleData";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const {
      message,
      chatId,
      prompt,
      context = {},
      webSearch = false,
    } = await request.json();

    if (!message) {
      return json({ error: "No message provided" }, { status: 400 });
    }

    // Start timer for performance monitoring
    const startTime = Date.now();

    // Use the centralized OpenAI service
    const response = await createResponse(message, {
      context: { ...context, webSearch },
      tools: webSearch ? [{ type: "web_search" }] : [],
    });

    // Extract text content from response
    const { textContent } = extractTextFromResponse(response);

    // Log performance metrics
    const duration = Date.now() - startTime;
    console.log(`AI response generated in ${duration}ms for chat ${chatId}`);

    // If chatId is provided, save the response to the chat (for sample data)
    if (chatId) {
      // Get existing messages for this chat
      const messageList = (sampleMessages as any)[chatId] || [];

      // Add the AI response to the messages
      if (Array.isArray(messageList)) {
        messageList.push({
          id: `${chatId}-${Date.now()}`,
          content: textContent,
          sender: "ai",
          timestamp: new Date(),
          status: "sent",
        });
      }
    }

    return json({ response: textContent });
  } catch (error) {
    console.error("API error:", error);
    return json(
      { error: "There was an error generating a response" },
      { status: 500 },
    );
  }
};
