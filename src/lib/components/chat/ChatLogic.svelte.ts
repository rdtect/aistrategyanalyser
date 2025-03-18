import type { Message } from "$lib/types/chat";

export function createChatLogic() {
  const conversationHistory = $state<Message[]>([]);

  // Add message to history and update UI
  function addMessage(message: Message) {
    conversationHistory.push(message);
  }

  // Generate response with full conversation context
  async function generateResponse(input: string) {
    // Format history for the API
    const apiHistory = conversationHistory.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    try {
      const response = await fetch("/api/ai/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          options: {
            conversation: apiHistory.slice(-10), // Last 10 messages for context
          },
        }),
      });

      if (!response.ok) throw new Error("API error");
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return {
    conversationHistory,
    addMessage,
    generateResponse,
  };
}
