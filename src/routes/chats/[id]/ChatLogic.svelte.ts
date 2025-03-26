import {
  generateAIResponse,
  generateStreamingAIResponse,
  extractOpenAIStreamContent,
  type Message as OpenAIMessage,
} from "$lib/services/openai";
import { chatStore } from "../(components)/ChatStore.svelte";
import type { Message, ChatContext } from "../types";

/**
 * System prompt components for the AI Strategy Analyzer
 */
const SYSTEM_PROMPTS = {
  base: "You are an AI Strategy Analyst assistant helping with business and market analysis.",
  detailed: `You are an expert AI Strategy Analyst specialized in business strategy, market research, and competitive analysis. 
Your role is to:
1. Analyze business data and market trends
2. Identify strategic opportunities and threats
3. Provide actionable insights for business decision-making
4. Help assess competitive landscapes
5. Evaluate strategic options with pros and cons`,
  formatting:
    "Present your analysis in a clear, structured format. Use bullet points, sections, and summaries when appropriate to improve readability.",
};

/**
 * Chat logic component based on Svelte 5 component logic pattern
 * Provides the core functionality for chat interaction including AI responses
 */
export function createChatLogic() {
  // State
  const messages = $state<Message[]>([]);
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let streamingContent = $state("");
  let isStreaming = $state(false);
  let lastActiveChatId = $state<string | null>(null);

  // Instead of directly updating the messages array in the effect (which causes loops),
  // we'll track the active chat ID and only update messages when it changes
  $effect(() => {
    const activeChat = chatStore.activeChat;
    if (!activeChat) return;

    // Only update messages if the chat ID has changed
    if (lastActiveChatId !== activeChat.id) {
      lastActiveChatId = activeChat.id;

      // Make a copy of the messages to avoid reactive bindings
      const chatMessages = [...activeChat.messages];

      // Replace the messages array instead of modifying it in place
      messages.length = 0;
      for (const msg of chatMessages) {
        messages.push(msg);
      }
    }
  });

  /**
   * Get the complete system prompt with the context of the current chat
   */
  function getSystemPrompt(): string {
    const activeChat = chatStore.activeChat;
    if (!activeChat) return SYSTEM_PROMPTS.base;

    const context = activeChat.context;

    // Build a context section if we have context information
    let contextSection = "";
    if (context.company || context.industry || context.region) {
      contextSection = `\n\nContext Information:\n`;

      if (context.company) contextSection += `- Company: ${context.company}\n`;

      if (context.industry)
        contextSection += `- Industry: ${context.industry}\n`;

      if (context.region) contextSection += `- Region: ${context.region}\n`;

      if (context.additionalInfo)
        contextSection += `- Additional Context: ${context.additionalInfo}\n`;

      if (context.competitors && context.competitors.length > 0)
        contextSection += `- Competitors: ${context.competitors.join(", ")}\n`;
    }

    // Combine all prompt components
    return `${SYSTEM_PROMPTS.detailed}${contextSection}\n\n${SYSTEM_PROMPTS.formatting}`;
  }

  /**
   * Convert our internal messages to OpenAI API format
   */
  function formatMessagesForAPI(): OpenAIMessage[] {
    // Get system message
    const systemMessage: OpenAIMessage = {
      role: "system",
      content: getSystemPrompt(),
    };

    // Get conversation messages, excluding system messages
    const conversationMessages: OpenAIMessage[] = messages
      .filter((msg) => msg.sender !== "system")
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }));

    // Combine with system message first
    return [systemMessage, ...conversationMessages];
  }

  /**
   * Handle sending a user message and generating an AI response
   * @param content The message content to send
   * @param useStreaming Whether to use streaming for the AI response
   */
  async function handleMessage(content: string, useStreaming = true) {
    if (!content.trim() || isLoading || isStreaming) return;

    const chatId = chatStore.activeChat?.id;
    if (!chatId) {
      // Update error state inside a function to avoid the state referenced in its own scope warning
      queueMicrotask(() => {
        error = "No active chat found";
      });
      return;
    }

    const userMessageId = crypto.randomUUID();

    // Create user message
    const userMessage: Message = {
      id: userMessageId,
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sent",
      index: messages.length,
    };

    // Update local messages - add a clone to avoid reactivity issues
    messages.push({ ...userMessage });

    // Save to store
    try {
      await chatStore.addMessage(content, "user", chatId);

      // Determine if we need to use tools or specialized format
      const needsAdvancedOptions =
        content.includes("diagram") ||
        content.includes("chart") ||
        content.includes("table") ||
        content.includes("json") ||
        content.includes("data");

      // Choose the API approach based on content
      if (useStreaming && !needsAdvancedOptions) {
        await handleStreamingResponse(content, chatId);
      } else {
        await handleStandardResponse(content, chatId, needsAdvancedOptions);
      }
    } catch (err) {
      console.error("Error handling message:", err);
      // Update error state inside a function to avoid the warning
      queueMicrotask(() => {
        error = err instanceof Error ? err.message : String(err);
      });
    }
  }

  /**
   * Handle a standard (non-streaming) AI response
   */
  async function handleStandardResponse(
    content: string,
    chatId: string,
    useAdvancedOptions = false,
  ) {
    isLoading = true;

    try {
      // Prepare the complete conversation history
      const apiMessages = formatMessagesForAPI();

      // Set up options based on content needs
      const options: Record<string, any> = {
        useStream: false,
      };

      // Detect when to use the Responses API
      const shouldUseResponsesAPI =
        content.includes("search") ||
        content.includes("current") ||
        content.includes("news") ||
        content.includes("latest") ||
        content.includes("today") ||
        content.includes("recent");

      if (shouldUseResponsesAPI) {
        options.useResponsesAPI = true;
        options.tools = [{ type: "web_search_preview" }];
      }
      // Add specialized options for certain content
      else if (useAdvancedOptions) {
        options.tools = [
          {
            type: "function",
            function: {
              name: "generateTable",
              description: "Generate a markdown table with the specified data",
              parameters: {
                type: "object",
                properties: {
                  headers: {
                    type: "array",
                    items: { type: "string" },
                    description: "Table column headers",
                  },
                  rows: {
                    type: "array",
                    items: {
                      type: "array",
                      items: { type: "string" },
                    },
                    description: "Table rows as arrays of cell values",
                  },
                },
                required: ["headers", "rows"],
              },
            },
          },
        ];
      }

      const { response } = await generateAIResponse(apiMessages, options);

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        sender: "ai",
        timestamp: new Date().toISOString(),
        status: "sent",
        index: messages.length,
      };

      // Add to local messages - add a clone to avoid reactivity issues
      messages.push({ ...aiMessage });

      // Save to store
      await chatStore.addMessage(response, "ai", chatId);
    } catch (err) {
      // Update error state inside a function to avoid the warning
      queueMicrotask(() => {
        error = err instanceof Error ? err.message : String(err);
      });
    } finally {
      // Reset state using function to avoid referencing in its own scope
      queueMicrotask(() => {
        isLoading = false;
      });
    }
  }

  /**
   * Handle a streaming AI response
   */
  async function handleStreamingResponse(content: string, chatId: string) {
    // Set reactive state to indicate streaming
    isStreaming = true;
    streamingContent = "";

    try {
      // Prepare the complete conversation history
      const apiMessages = formatMessagesForAPI();

      // Add a placeholder message for the streaming content
      const aiMessageId = crypto.randomUUID();
      const aiMessage: Message = {
        id: aiMessageId,
        content: "",
        sender: "ai",
        timestamp: new Date().toISOString(),
        status: "streaming",
        index: messages.length,
      };

      // Add a clone to avoid reactivity issues
      messages.push({ ...aiMessage });

      // Create a local variable to accumulate content to avoid reactivity issues
      let currentContent = "";

      // Start streaming
      const { processStream } = await generateStreamingAIResponse(apiMessages, {
        useStream: true,
      });

      // Process the stream chunks
      await processStream((chunk) => {
        try {
          // Extract content using our utility function
          const deltaContent = extractOpenAIStreamContent(chunk);

          if (deltaContent) {
            // Update the accumulated content
            currentContent += deltaContent;
            streamingContent = currentContent;

            // Find the message and update it with a new object to avoid references
            const messageIndex = messages.findIndex(
              (m) => m.id === aiMessageId,
            );
            if (messageIndex !== -1) {
              // Create a new message object to avoid reference issues
              const updatedMessage = {
                ...messages[messageIndex],
                content: currentContent,
              };
              messages[messageIndex] = updatedMessage;
            }
          }
        } catch (e) {
          console.error("Error processing stream chunk:", e, chunk);
        }
      });

      // When stream is complete, update the status and save to store
      const finalIndex = messages.findIndex((m) => m.id === aiMessageId);
      if (finalIndex !== -1) {
        // Create a new message object with the final status
        const finalMessage = {
          ...messages[finalIndex],
          status: "sent" as const,
          content: currentContent,
        };

        // Update the message with the new object
        messages[finalIndex] = finalMessage;

        // Save to the store
        await chatStore.addMessage(finalMessage.content, "ai", chatId);
      }
    } catch (err) {
      // Update error state inside a function to avoid the warning
      queueMicrotask(() => {
        error = err instanceof Error ? err.message : String(err);
      });
    } finally {
      // Reset state using function to avoid referencing in its own scope
      queueMicrotask(() => {
        isStreaming = false;
        streamingContent = "";
      });
    }
  }

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    handleMessage,
  };
}
