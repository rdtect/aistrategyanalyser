import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

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

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { message, chatId } = await request.json();

    if (!message) {
      return json({ error: "No message provided" }, { status: 400 });
    }

    // Determine which sample response to use based on the message content
    let responseText = sampleResponses.default;

    // Simple keyword matching for demo
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("apple")) {
      responseText = sampleResponses.apple;
    } else if (lowerMessage.includes("tesla")) {
      responseText = sampleResponses.tesla;
    } else if (
      lowerMessage.includes("unilever") ||
      lowerMessage.includes("p&g")
    ) {
      responseText = sampleResponses.unilever;
    }

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Split the response into words for simulated streaming
          const words = responseText.split(" ");

          // Stream each word with a small delay
          for (const word of words) {
            // Add random delay (20-100ms) to simulate typing
            await new Promise((resolve) =>
              setTimeout(resolve, 20 + Math.random() * 80)
            );
            controller.enqueue(encoder.encode(word + " "));
          }

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(
            encoder.encode("Sorry, there was an error generating a response.")
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return json({ error: "Failed to process request" }, { status: 500 });
  }
};
