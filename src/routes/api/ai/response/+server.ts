import { json } from "@sveltejs/kit";
import OpenAI from "openai";
import type { RequestHandler } from "./$types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { input, options = {}, chatId } = await request.json();

    // Start timer for performance monitoring
    const startTime = Date.now();

    // Call OpenAI Responses API
    const response = await openai.responses.create({
      model: options?.model || "gpt-4o",
      input,
      tools: options?.tools || [],
      instructions:
        options?.system ||
        "You are an AI strategy analyst using the 4C's framework (Company, Customers, Competitors, Context).",
      ...(options?.previousResponseId
        ? { previous_response_id: options.previousResponseId }
        : {}),
    });

    // Log performance metrics
    const duration = Date.now() - startTime;
    console.log(`AI response generated in ${duration}ms for chat ${chatId}`);

    // Extract text content from response
    let textContent = "";
    let sources = [];

    if (response && response.output) {
      for (const item of response.output) {
        if (item.type === "message" && item.content) {
          for (const content of item.content) {
            if (content.type === "output_text") {
              textContent += content.text;

              // Extract any annotations (like web sources)
              if (content.annotations && content.annotations.length > 0) {
                sources = content.annotations.map((annotation: any) => ({
                  title: annotation.title || "",
                  url: annotation.url || "",
                  snippet:
                    content.text.substring(
                      annotation.start_index,
                      annotation.end_index
                    ) || "",
                }));
              }
            }
          }
        }

        // Also check for web search call results
        if (item.type === "web_search_call" && item.status === "completed") {
          // Web search results might be available in the tool outputs
          // We'll handle this in a more robust implementation
        }
      }
    }

    return json({
      response: {
        id: response.id,
        content: textContent,
        modelName: response.model,
        usage: response.usage,
      },
      sources,
    });
  } catch (error: unknown) {
    console.error("OpenAI API error:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      return json(
        {
          error: error.message,
          errorType: error.name,
        },
        { status: 500 }
      );
    }

    return json({ error: "Unknown error" }, { status: 500 });
  }
};
