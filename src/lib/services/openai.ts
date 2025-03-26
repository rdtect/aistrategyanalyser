/**
 * Shared OpenAI service functions for client-side use
 * Updated to use versioned API endpoints
 */

// Define message format for OpenAI APIs
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// Define OpenAI request options interface
export interface OpenAIRequestOptions {
  model?: string;
  temperature?: number;
  systemMessage?: string;
  useStream?: boolean; // Control whether to use streaming
  tools?: Array<{
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: Record<string, any>;
    };
  }>;
  responseFormat?: {
    type: "text" | "json_object";
  };
  useResponsesAPI?: boolean;
  reasoning?: {
    effort?: "low" | "medium" | "high";
  };
}

/**
 * Generate an AI response using the OpenAI API
 * Uses the versioned API endpoint and conditionally streams based on the use case
 */
export async function generateAIResponse(
  input: string | Message[],
  options: OpenAIRequestOptions = {},
) {
  try {
    // Decide whether to use streaming based on options
    // Default to streaming only for longer responses where user experience benefits
    const shouldStream =
      options.useStream ?? (typeof input === "string" && input.length > 100);

    if (shouldStream) {
      return generateStreamingResponse(input, options);
    } else {
      return generateStandardResponse(input, options);
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

/**
 * Generate a standard (non-streaming) response
 * This is more cost-effective for shorter responses
 */
async function generateStandardResponse(
  input: string | Message[],
  options: OpenAIRequestOptions = {},
) {
  // Format input as messages if it's a string
  const messages =
    typeof input === "string" ? [{ role: "user", content: input }] : input;

  // Add system message if provided
  if (options.systemMessage && !messages.some((m) => m.role === "system")) {
    messages.unshift({
      role: "system",
      content: options.systemMessage,
    });
  }

  // Use the versioned API endpoint
  const response = await fetch("/api/v1/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      model: options.model || "gpt-4o",
      temperature: options.temperature || 0.7,
      useResponsesAPI: options.useResponsesAPI !== false,
      reasoning: options.reasoning,
      tools: options.tools,
      responseFormat: options.responseFormat,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to generate AI response");
  }

  const data = await response.json();
  return {
    response: data.text,
    metadata: {
      model: data.model,
      usage: data.usage,
      id: data.id,
    },
  };
}

/**
 * Generate a streaming response for better user experience
 * This is better for longer responses where seeing incremental output improves UX
 */
async function generateStreamingResponse(
  input: string | Message[],
  options: OpenAIRequestOptions = {},
) {
  let fullContent = "";

  const streamResult = await generateStreamingAIResponse(input, options);

  // Process the entire stream and accumulate the content
  await streamResult.processStream((chunk) => {
    const deltaContent = extractOpenAIStreamContent(chunk);
    fullContent += deltaContent;
  });

  // Return in the same format as standard response
  return {
    response: fullContent,
    metadata: {
      model: options.model || "gpt-4o",
      // We don't have usage stats for streaming responses
    },
  };
}

/**
 * Utility to extract content from OpenAI SSE format
 */
export function extractOpenAIStreamContent(chunk: string): string {
  try {
    // Check for [DONE] marker
    if (chunk.includes("data: [DONE]")) {
      return "";
    }

    // Extract the JSON data part
    const dataMatch = chunk.match(/data: ({.*})/);
    if (!dataMatch) return "";

    // Parse the JSON payload
    const data = JSON.parse(dataMatch[1]);

    // Extract content from the delta
    return data?.choices?.[0]?.delta?.content || "";
  } catch (error) {
    console.error("Error extracting OpenAI stream content:", error);
    return "";
  }
}

/**
 * Generate a streaming AI response
 * Uses the versioned API endpoint with streaming enabled
 */
export async function generateStreamingAIResponse(
  input: string | Message[],
  options: OpenAIRequestOptions = {},
) {
  try {
    // Format input as messages if it's a string
    const messages =
      typeof input === "string" ? [{ role: "user", content: input }] : input;

    // Add system message if provided
    if (options.systemMessage && !messages.some((m) => m.role === "system")) {
      messages.unshift({
        role: "system",
        content: options.systemMessage,
      });
    }

    // Use the versioned API endpoint with streaming
    const response = await fetch("/api/v1/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        model: options.model || "gpt-4o",
        temperature: options.temperature || 0.7,
        tools: options.tools,
        responseFormat: options.responseFormat,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Streaming response failed: ${errorText}`);
    }

    return {
      stream: response.body,
      contentType: response.headers.get("Content-Type"),
      processStream: async (onChunk: (text: string) => void): Promise<void> => {
        if (!response.body) throw new Error("Response body is null");

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Decode the chunk and add it to our buffer
            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE messages from the buffer
            const lines = buffer.split("\n");

            // Keep the last potentially incomplete line in the buffer
            buffer = lines.pop() || "";

            // Process each complete line
            for (const line of lines) {
              if (line.trim()) {
                onChunk(line);
              }
            }
          }

          // Process any remaining text in the buffer
          if (buffer.trim()) {
            onChunk(buffer);
          }
        } finally {
          reader.releaseLock();
        }
      },
    };
  } catch (error) {
    console.error("Error generating streaming response:", error);
    throw error;
  }
}

/**
 * Check the health of the OpenAI API connection
 */
export async function checkAPIHealth() {
  try {
    // Use the versioned health endpoint
    const response = await fetch("/api/v1/health");

    if (!response.ok) {
      throw new Error("Health check failed");
    }

    return response.json();
  } catch (error) {
    console.error("Health check error:", error);
    throw error;
  }
}
