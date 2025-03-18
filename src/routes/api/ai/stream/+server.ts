import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "$env/static/private";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

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
    const { message, chatId, context } = await request.json();

    if (!message) {
      return json({ error: "No message provided" }, { status: 400 });
    }

    // Create a streaming response using the new Responses API
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: message,
      stream: true,
      instructions:
        "You are an AI strategy analyst using the 4C's framework (Company, Customers, Competitors, Context).",
      // Optional context from previous conversation
      ...(context?.previousResponseId
        ? { previous_response_id: context.previousResponseId }
        : {}),
    });

    // Create a ReadableStream from the OpenAI streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Process the streaming response
          let text = "";
          for await (const chunk of response) {
            // Check for text content in the chunk
            if (chunk.output && chunk.output.length > 0) {
              for (const item of chunk.output) {
                if (
                  item.type === "message" &&
                  item.content &&
                  item.content.length > 0
                ) {
                  for (const content of item.content) {
                    if (content.type === "output_text" && content.text) {
                      const newText = content.text;
                      text += newText;
                      controller.enqueue(encoder.encode(newText));
                    }
                  }
                }
              }
            }
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
