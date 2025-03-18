import { json } from "@sveltejs/kit";
import OpenAI from "openai";
import type { RequestHandler } from "./$types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { query } = await request.json();

    const response = await openai.responses.create({
      model: "gpt-4o",
      input: query,
      tools: [{ type: "web_search_preview" }],
    });

    // Extract search results from the response
    // This will depend on the exact format of the response
    const results = response.tool_results?.web_search?.results || [];

    return json({ results });
  } catch (error) {
    console.error("Search API error:", error);
    return json({ error: "Search failed", results: [] }, { status: 500 });
  }
};
