import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sampleMessages } from "$lib/data/sampleData";

// Sample responses for POC
const sampleResponses = {
  default:
    "I'm an AI strategy consultant analyzing your business questions. What specific company or industry would you like me to analyze?",
  apple:
    "Apple's competitive advantages include strong brand identity, ecosystem lock-in, vertical integration of hardware and software, premium positioning, retail presence, and supply chain mastery. Their focus on user experience and design creates loyal customers willing to pay premium prices.",
  tesla:
    "Tesla has established a strong position in the EV market through innovation, vertical integration, and brand strength. They face increasing competition from traditional automakers and new entrants, but maintain technology advantages in battery efficiency, software, and their Supercharger network.",
  unilever:
    "To compete effectively with P&G, Unilever should leverage its sustainability leadership, focus on emerging markets where it's stronger, optimize its portfolio toward higher-margin personal care, accelerate digital transformation, and invest in innovation hubs for natural ingredients and market-specific products.",
};

// Generate a response based on the question and prompt
function generateResponseFromPrompt(
  message: string,
  prompt: any,
  context: any
): string {
  // For POC we'll use keyword matching plus context
  const lowerMessage = message.toLowerCase();

  // Start with a baseline response
  let baseResponse = sampleResponses.default;

  // Look for company-specific keywords
  if (
    lowerMessage.includes("apple") ||
    context?.company?.toLowerCase().includes("apple")
  ) {
    baseResponse = sampleResponses.apple;
  } else if (
    lowerMessage.includes("tesla") ||
    context?.company?.toLowerCase().includes("tesla")
  ) {
    baseResponse = sampleResponses.tesla;
  } else if (
    lowerMessage.includes("unilever") ||
    context?.company?.toLowerCase().includes("unilever")
  ) {
    baseResponse = sampleResponses.unilever;
  }

  // Format response according to the output format
  let response = "";
  if (prompt && typeof prompt === "object" && prompt["Output Format"]) {
    // Apply some formatting based on the output format
    const format = prompt["Output Format"];
    if (format.includes("table") || format.includes("structured report")) {
      response = `# Analysis: ${context?.company || "Company"} - ${message}\n\n`;
      response += `## Key Findings\n\n`;
      response += `| Factor | Assessment | Impact |\n`;
      response += `| ------ | ---------- | ------ |\n`;
      response += `| Market Position | Strong | High |\n`;
      response += `| Competition | Moderate | Medium |\n`;
      response += `| Innovation | High | High |\n`;
      response += `| Customer Loyalty | Strong | High |\n\n`;
      response += baseResponse;
    } else {
      response = `# ${message}\n\n${baseResponse}`;
    }
  } else {
    response = baseResponse;
  }

  // Add a note about web search if enabled
  if (context?.webSearch) {
    response +=
      "\n\n*Note: This analysis was enhanced with real-time web search data.*";
  }

  return response;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const requestData = await request.json();
    const {
      message,
      chatId,
      prompt,
      context = {},
      webSearch = false,
    } = requestData;

    if (!message) {
      return json({ error: "No message provided" }, { status: 400 });
    }

    // Generate a response based on the prompt and context
    let response;
    if (prompt) {
      // Enhanced response with prompt template and context
      response = generateResponseFromPrompt(message, prompt, {
        ...context,
        webSearch,
      });
    } else {
      // Simple keyword matching for basic queries
      response = sampleResponses.default;
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes("apple")) {
        response = sampleResponses.apple;
      } else if (lowerMessage.includes("tesla")) {
        response = sampleResponses.tesla;
      } else if (
        lowerMessage.includes("unilever") ||
        lowerMessage.includes("p&g")
      ) {
        response = sampleResponses.unilever;
      }
    }

    // Simulate a delay for more realistic response time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // If chatId is provided, save the response to the chat
    if (chatId) {
      // Get existing messages for this chat
      const messageList = (sampleMessages as any)[chatId] || [];

      // Add the AI response to the messages
      if (Array.isArray(messageList)) {
        messageList.push({
          id: `${chatId}-${Date.now()}`,
          content: response,
          sender: "ai",
          timestamp: new Date(),
          status: "sent",
        });
      }
    }

    return json({ response });
  } catch (error) {
    console.error("API error:", error);
    return json(
      { error: "There was an error generating a response" },
      { status: 500 }
    );
  }
};
