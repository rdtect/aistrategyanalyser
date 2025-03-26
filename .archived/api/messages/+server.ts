import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sampleMessages } from "$lib/data/sampleData";

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const chatId = url.searchParams.get("chatId");

    if (!chatId) {
      return json({ error: "Chat ID is required" }, { status: 400 });
    }

    const data = await request.json();
    const userMessage = data.userMessage;
    const aiResponse = data.aiResponse;

    if (!userMessage && !aiResponse) {
      return json(
        { error: "Either user message or AI response must be provided" },
        { status: 400 },
      );
    }

    // For POC, we'll just simulate saving messages to the sample data
    console.log("Saving message for chat:", chatId, {
      userMessage,
      aiResponse,
    });

    // Initialize the array if it doesn't exist
    if (!sampleMessages[chatId]) {
      sampleMessages[chatId] = [];
    }

    // Create message objects for any provided messages
    const savedMessages = [];

    if (userMessage) {
      const userMessageObj = {
        id: `user_${Date.now()}`,
        content: userMessage,
        sender: "user",
        timestamp: new Date(),
        status: "sent",
      };
      sampleMessages[chatId].push(userMessageObj);
      savedMessages.push(userMessageObj);
    }

    if (aiResponse) {
      const aiMessageObj = {
        id: `ai_${Date.now() + 100}`,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        status: "sent",
      };
      sampleMessages[chatId].push(aiMessageObj);
      savedMessages.push(aiMessageObj);
    }

    // Return success with the saved messages
    return json({
      success: true,
      messages: savedMessages,
    });
  } catch (error) {
    console.error("Error saving messages:", error);
    return json({ error: "Failed to save messages" }, { status: 500 });
  }
};
