import type { RequestHandler } from "./$types";
import { OPENAI_API_KEY } from "$env/static/private";
import OpenAI from "openai";
import { json } from "@sveltejs/kit";

/**
 * OpenAI Responses API endpoint
 * Using the newest API approach for better quality responses
 * @see https://platform.openai.com/docs/api-reference/responses
 */

// Initialize the OpenAI client once
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || "mock-key-for-development",
});

// Available models
const MODELS = {
  GPT4_TURBO: "gpt-4o", // Latest model - best performance
  GPT4: "gpt-4", // Stable but slower
  GPT3_5: "gpt-3.5-turbo-0125", // Faster but less capable
};

// Strategy prompt for business analysis
const STRATEGY_PROMPT = `You are an AI Strategy Analyzer, an expert in business strategy, market analysis, and competitive intelligence.

Your role is to provide data-driven, insightful analysis for business strategists using the 4Cs framework:
1. Category - Comprehensive market analysis, trends, growth segments, and industry dynamics
2. Consumer - Deep customer insights, behavioral shifts, needs analysis, and segmentation
3. Competitive - Thorough competitor analysis, strategic positioning, and relative strengths/weaknesses
4. Cultural - Analysis of broader cultural and social trends impacting business strategy

Format your responses with clear hierarchical organization using markdown, include data where available, and conclude with follow-up questions.`;

/**
 * Handle requests to the OpenAI Responses API
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const requestData = await request.json();
    const { 
      messages, 
      model, 
      temperature, 
      systemMessage,
      reasoning = { effort: "high" } 
    } = requestData;

    // Check for valid request format
    if (!messages || !Array.isArray(messages)) {
      return json({ error: "Invalid messages format" }, { status: 400 });
    }

    // Extract parameters with defaults
    const selectedModel = model || MODELS.GPT4_TURBO;
    const selectedTemperature = temperature || 0.7;
    const selectedSystemMessage = systemMessage || STRATEGY_PROMPT;
    
    // Build the messages array for the API
    let apiMessages = [...messages]; // Make a copy
    
    // Add system message if not present
    if (selectedSystemMessage && !apiMessages.some(msg => msg.role === 'system')) {
      apiMessages.unshift({ role: 'system', content: selectedSystemMessage });
    }
    
    try {
      // Using the Responses API for improved quality
      const response = await openai.responses.create({
        model: selectedModel,
        input: apiMessages,
        reasoning: reasoning,
        max_tokens: 2000,
      });

      return json({
        content: response.output_text,
        metadata: {
          model: selectedModel,
          usage: {
            input_tokens: response.usage?.input_tokens || 0,
            output_tokens: response.usage?.output_tokens || 0,
            total_tokens: response.usage?.total_tokens || 0
          },
          reasoning_effort: reasoning.effort,
          finished_reason: response.finish_reason,
          response_id: response.id
        }
      });
    } catch (err) {
      console.error("OpenAI API Error:", err);
      return json({ 
        error: "Failed to generate response", 
        details: err.message 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};