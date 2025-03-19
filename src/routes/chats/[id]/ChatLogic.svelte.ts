import { generateAIResponse } from "$lib/services/openai";
import type { Message } from "$lib/types/chat";

export function createChatLogic() {
  const messages = $state<Message[]>([]);
  let isLoading = $state(false);

  async function handleMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    };

    messages.push(userMessage);
    isLoading = true;

    try {
      const { response } = await generateAIResponse(content, {
        model: "gpt-4o",
      });

      messages.push({
        id: crypto.randomUUID(),
        content: response,
        sender: "ai",
        timestamp: new Date(),
        status: "completed",
      });
    } catch (error) {
      console.error("AI Response Error:", error);
    } finally {
      isLoading = false;
    }
  }

  return {
    messages,
    isLoading,
    handleMessage,
  };
}
