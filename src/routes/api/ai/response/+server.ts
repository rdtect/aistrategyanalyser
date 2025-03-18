import { json } from "@sveltejs/kit";
import OpenAI from "openai";
import type { RequestHandler } from "./$types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define interface for the OpenAI response structure
interface ResponseOutput {
  type: string;
  web_search?: {
    results: Array<{
      title?: string;
      url?: string;
      snippet?: string;
    }>;
  };
}

interface SearchResult {
  title?: string;
  url?: string;
  snippet?: string;
}

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
    });

    // Log performance metrics
    const duration = Date.now() - startTime;
    console.log(`AI response generated in ${duration}ms for chat ${chatId}`);

    // Extract sources if web search was used
    let sources: Array<{ title: string; url: string; snippet: string }> = [];

    // Process response for sources (from web search tools)
    // Use the actual response structure - access any potential tool outputs safely
    const responseObj = response as any;
    if (responseObj && responseObj.tool_outputs) {
      const webSearchOutputs = responseObj.tool_outputs.filter(
        (output: ResponseOutput) => output.type === "web_search"
      );

      for (const webSearchOutput of webSearchOutputs) {
        if (webSearchOutput.web_search?.results) {
          sources = webSearchOutput.web_search.results.map(
            (result: SearchResult) => ({
              title: result.title || "",
              url: result.url || "",
              snippet: result.snippet || "",
            })
          );
        }
      }
    }

    return json({
      response,
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
