import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sampleMessages } from "$lib/data/sampleData";

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const chatId = url.searchParams.get("chatId");

    if (!chatId) {
      return json({ error: "Chat ID is required" }, { status: 400 });
    }

    const { userMessage, aiResponse } = await request.json();

    if (!userMessage || !aiResponse) {
      return json(
        { error: "Both user message and AI response are required" },
        { status: 400 }
      );
    }

    // For POC, we'll just simulate saving messages
    console.log("Would save:", { userMessage, aiResponse, chatId });

    // Create mock message objects
    const savedUserMessage = {
      id: `user_${Date.now()}`,
      content: userMessage,
      sender: "user",
      chatId,
      timestamp: new Date(),
    };

    const savedAiMessage = {
      id: `ai_${Date.now()}`,
      content: aiResponse,
      sender: "ai",
      chatId,
      timestamp: new Date(),
    };

    // In a real app, we would add these to the database
    // For the POC, we'll just log them
    if (!sampleMessages[chatId]) {
      sampleMessages[chatId] = [];
    }
    sampleMessages[chatId].push(savedUserMessage, savedAiMessage);

    return json({
      success: true,
      messages: [savedUserMessage, savedAiMessage],
    });
  } catch (error) {
    console.error("Error saving messages:", error);
    return json({ error: "Failed to save messages" }, { status: 500 });
  }
};
