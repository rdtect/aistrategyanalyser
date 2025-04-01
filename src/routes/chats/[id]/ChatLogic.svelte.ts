import {
  generateAIResponse,
  generateStreamingAIResponse,
  extractOpenAIStreamContent,
  type OpenAIMessage,
  type OpenAIRequestOptions,
  type UnifiedAIResponseType,
} from "$lib/services/openai";
import {
  getActiveChat,
  addMessage as addMessageToStore,
} from "$lib/stores/ChatsStore.svelte"; // Updated path from services to stores
import type { Message } from "$lib/types"; // Correct import path - Remove ChatContext
import { page } from "$app/stores"; // To read URL params
import { get } from "svelte/store"; // Import get utility
import { categoryQuestionsData } from "$lib/data/category_question_prompts"; // Use correct export name

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
  let isAnalyzing = $state(false);

  // Instead of directly updating the messages array in the effect (which causes loops),
  // we'll track the active chat ID and only update messages when it changes
  $effect(() => {
    const activeChat = getActiveChat();
    if (!activeChat) return;

    // Only update messages if the chat ID has changed
    if (lastActiveChatId !== activeChat.id) {
      lastActiveChatId = activeChat.id;

      // Make a copy of the messages to avoid reactive bindings
      const chatMessages = [...activeChat.messages];

      // Replace the messages array instead of modifying it in place
      messages.length = 0;
      for (const msg of chatMessages) {
        // Cast msg to any to bypass potential type mismatch from storage loading
        const anyMsg = msg as any;
        // Ensure the role from storage is one of the expected values
        const validRole = ["user", "assistant", "system"].includes(anyMsg.role)
          ? (anyMsg.role as "user" | "assistant" | "system")
          : "system"; // Default to system if role is invalid/missing

        messages.push({
          // Only include properties defined in the Message interface ($lib/types.ts)
          id: anyMsg.id,
          role: validRole, // Use role directly
          content: anyMsg.content,
          timestamp: anyMsg.timestamp,
          status: anyMsg.status,
          index: anyMsg.index,
        });
      }
    }
  });

  // Effect to trigger automated analysis on new chats
  $effect(() => {
    // Use get() to read the store value once within the effect
    const currentPage = get(page);
    const urlParams = new URLSearchParams(currentPage.url.search);
    const shouldStartAnalysis = urlParams.get("startAnalysis") === "true";

    const currentChat = getActiveChat();
    const isNewEmptyChat = currentChat && currentChat.messages.length === 0;

    if (shouldStartAnalysis && isNewEmptyChat && !isAnalyzing) {
      console.log("Starting automated analysis...");
      runAutomatedAnalysis();

      // Remove the query param after starting
      // Use the already retrieved currentPage
      const url = new URL(currentPage.url.href);
      url.searchParams.delete("startAnalysis");
      history.replaceState(history.state, "", url);
    }
  });

  // Function to run the automated analysis prompts
  async function runAutomatedAnalysis() {
    const currentRunningChat = getActiveChat();
    if (!currentRunningChat || isAnalyzing) return;
    isAnalyzing = true;
    console.log("Starting automated analysis in parallel...");

    // 1. Prepare all prompts and associated question data
    const analysisTasks: { question: any; apiMessages: Message[] }[] = []; // Use 'any' for question temporarily if type is complex
    const chatId = currentRunningChat.id;
    const systemPrompt =
      currentRunningChat.context?.system_prompt ||
      "You are a helpful assistant.";

    for (const [categoryName, questions] of Object.entries(
      categoryQuestionsData,
    )) {
      for (const question of questions) {
        const userPromptContent =
          question.prompt["Task Description"] || question.question || "";
        const apiMessages: Message[] = [
          { role: "system", content: systemPrompt },
          // Consider adding previous context if needed in future
          { role: "user", content: userPromptContent },
        ];
        analysisTasks.push({ question, apiMessages });
      }
    }

    // Add all user-facing questions to the chat first (optional, can also add later)
    // This provides immediate feedback that analysis has started
    const initialQuestionsMessages: Message[] = [];
    for (const task of analysisTasks) {
      const userQuestionMessageContent = `Question: ${task.question.question}`;
      // Temporarily store, add to store later or add now?
      // Let's add them now for faster UI feedback
      try {
        await addMessageToStore(userQuestionMessageContent, "user", chatId);
        initialQuestionsMessages.push({
          role: "user",
          content: userQuestionMessageContent,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          status: "sent",
          index: -1,
        }); // Dummy index
      } catch (addError) {
        console.error(
          `Error adding initial question message: ${task.question.question}`,
          addError,
        );
      }
    }

    // 2. Execute API calls in parallel
    console.log(
      `Executing ${analysisTasks.length} analysis prompts in parallel...`,
    );
    const results = await Promise.allSettled(
      analysisTasks.map((task) =>
        generateAIResponse(task.apiMessages, {
          model: "gpt-4o", // Or model from context
          useStream: false, // Responses API path doesn't stream this way
          useResponsesAPI: true, // Explicitly use the Responses API
          tools: [{ type: "web_search_preview" }], // Force web search tool
        }),
      ),
    );
    console.log("Parallel analysis calls finished.");

    // 3. Process results and add answers to chat
    try {
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const task = analysisTasks[i];

        let assistantAnswerMessage = "";

        if (result.status === "fulfilled") {
          const aiResponse = result.value;
          const aiAnswerText =
            aiResponse.response?.message?.content?.trim() ??
            "No answer received or answer was empty.";
          console.log(
            `  Answer for "${task.question.question.substring(0, 30)}...": ${aiAnswerText.substring(0, 50)}...`,
          );
          assistantAnswerMessage = `Answer: ${aiAnswerText}`;
        } else {
          // Handle rejected promise
          console.error(
            `Error analyzing question "${task.question.question}":`,
            result.reason,
          );
          assistantAnswerMessage = `Answer: Error processing this question. (${result.reason?.message || "Unknown error"})`;
          // Optionally set the main error state
          error =
            "An error occurred during the initial analysis for one or more questions.";
        }

        // Add formatted AI answer to chat
        try {
          await addMessageToStore(assistantAnswerMessage, "assistant", chatId);
        } catch (addError) {
          console.error(
            `Error adding assistant answer message: ${task.question.question}`,
            addError,
          );
          // Continue to next message even if adding fails
        }
      }
      console.log("Finished adding all analysis answers.");
    } catch (processingError) {
      console.error("Error processing analysis results:", processingError);
      error = "An error occurred while processing the analysis results.";
      if (currentRunningChat) {
        try {
          await addMessageToStore(
            "Analysis Error: Could not process all analysis results.",
            "system",
            currentRunningChat.id,
          );
        } catch {}
      }
    } finally {
      isAnalyzing = false;
      console.log("Automated analysis process complete.");
    }
  }

  /**
   * Get the complete system prompt with the context of the current chat
   */
  function getSystemPrompt(): string {
    const activeChat = getActiveChat();
    if (!activeChat) return SYSTEM_PROMPTS.base;

    const context = activeChat.context;

    // Build a context section if we have context information
    let contextSection = "";
    if (context?.company || context?.industry || context?.region) {
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
      .filter((msg) => msg.role !== "system") // Filter by role
      .map((msg) => ({
        role: msg.role, // Role maps directly
        content: msg.content || "", // Ensure content is string, default null to empty
      }));

    // Combine with system message first
    return [systemMessage, ...conversationMessages];
  }

  // --- Placeholder function for tool execution ---
  function executeGenerateTable(args: {
    headers: string[];
    rows: string[][];
  }): string {
    console.log("[executeGenerateTable] Called with args:", args);
    // Simple markdown table simulation
    let table = "";
    if (args.headers && args.rows) {
      table += `| ${args.headers.join(" | ")} |\n`;
      table += `| ${args.headers.map(() => "---").join(" | ")} |\n`;
      args.rows.forEach((row) => {
        table += `| ${row.join(" | ")} |\n`;
      });
    } else {
      return "Error: Missing headers or rows for table generation.";
    }
    return table;
  }
  // --- End placeholder function ---

  // Define keywords for intent detection
  const WEB_SEARCH_KEYWORDS = [
    "search",
    "current",
    "news",
    "latest",
    "today",
    "recent",
    "now?", // Keep specific case for now
  ];

  const TABLE_KEYWORDS = ["table", "chart"]; // Combine related terms
  const DIAGRAM_KEYWORDS = ["diagram", "graph", "visualize"];
  const JSON_KEYWORDS = ["json", "data"];

  // Function to detect intent based on keywords
  function detectIntent(text: string): {
    needsWebSearch: boolean;
    needsTableTool: boolean;
    needsDiagramTool: boolean; // Add other intents as needed
    needsJsonTool: boolean;
  } {
    const lowerText = text.toLowerCase();
    const needsWebSearch = WEB_SEARCH_KEYWORDS.some((kw) =>
      lowerText.includes(kw),
    );
    const needsTableTool = TABLE_KEYWORDS.some((kw) => lowerText.includes(kw));
    const needsDiagramTool = DIAGRAM_KEYWORDS.some((kw) =>
      lowerText.includes(kw),
    );
    const needsJsonTool = JSON_KEYWORDS.some((kw) => lowerText.includes(kw));

    return {
      needsWebSearch,
      needsTableTool,
      needsDiagramTool,
      needsJsonTool,
    };
  }

  /**
   * Handle sending a user message and generating an AI response
   * @param content The message content to send
   * @param useStreaming Whether to use streaming for the AI response
   */
  async function handleMessage(content: string, useStreaming = true) {
    if (!content.trim() || isLoading || isStreaming) return;

    const chatId = getActiveChat()?.id;
    if (!chatId) {
      error = "No active chat found";
      return;
    }

    const userMessageId = crypto.randomUUID();

    // Create user message
    const userMessage: Message = {
      id: userMessageId,
      role: "user", // Use role
      content,
      timestamp: new Date().toISOString(),
      status: "sent",
      index: messages.length,
    };

    // Update local messages - add a clone to avoid reactivity issues
    messages.push({ ...userMessage });

    // Save to store
    try {
      await addMessageToStore(content, "user", chatId);

      // Detect intent using keyword mapping
      const {
        needsWebSearch,
        needsTableTool,
        needsDiagramTool,
        needsJsonTool,
      } = detectIntent(content);

      // Determine if any tool-requiring intent is detected (excluding web search for now)
      // TODO: Expand this logic if diagram/json tools are added
      const needsFunctionTool = needsTableTool; // || needsDiagramTool || needsJsonTool;

      // Determine if we should attempt streaming
      // Force non-streaming if advanced options (tools other than web search) are needed,
      // or if web search (Responses API) is triggered (as tool path doesn't stream).
      let attemptStreaming =
        useStreaming && !needsFunctionTool && !needsWebSearch;

      // Choose the API approach based on content
      if (attemptStreaming) {
        await handleStreamingResponse(content, chatId);
      } else {
        // Prepare options for the standard response
        const options: OpenAIRequestOptions = {
          // Use imported type
          useStream: false,
        };

        // Pass Responses API flag and tools if needed (already determined above)
        if (needsWebSearch) {
          options.useResponsesAPI = true;
          options.tools = [{ type: "web_search_preview" }];
        }
        // Add function tool if needed (e.g., for table generation)
        else if (needsFunctionTool) {
          // Define the tool structure more precisely if possible
          type FunctionTool = {
            type: "function";
            function: {
              name: string;
              description: string;
              parameters: Record<string, any>;
            };
          };
          options.tools = [
            {
              type: "function",
              function: {
                name: "generateTable",
                description:
                  "Generate a markdown table with the specified data",
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
            } as FunctionTool, // Ensure type consistency
          ];
        }

        // *** Log the options before calling the API ***
        console.log(
          "[ChatLogic] Options for generateAIResponse:",
          JSON.stringify(options),
        );

        // Await the response and assert its type for standard calls
        const aiApiResponse = await generateAIResponse(
          formatMessagesForAPI(),
          options, // Pass the prepared options
        );
        await handleStandardResponse(aiApiResponse, chatId);
      }
    } catch (err) {
      console.error("Error handling message:", err);
      error = err instanceof Error ? err.message : String(err);
    }
  }

  /**
   * Handle a standard (non-streaming) AI response
   * Accepts the structured response from generateAIResponse
   */
  async function handleStandardResponse(
    aiApiResponse: UnifiedAIResponseType, // Use the imported unified type
    chatId: string,
  ) {
    isLoading = true;
    let finalMessageContent: string | null = null; // Declare variable to hold the final content

    try {
      // Access properties from the correctly typed response (passed as argument)
      const responseMessage = aiApiResponse.response.message;
      const originalMessageContent = responseMessage.content; // Store original content
      const toolCalls = responseMessage.tool_calls;

      // Check if AI requested tool calls
      if (toolCalls && toolCalls.length > 0) {
        console.log("[ChatLogic] AI requested tool calls:", toolCalls);

        // Add the initial AI message (requesting the tool) to the history first
        // Make sure to handle null content appropriately (e.g., use placeholder)
        const initialAiResponseContent =
          originalMessageContent ??
          `[Requesting tools: ${toolCalls.map((tc) => tc.function.name).join(", ")}]`;
        const initialAiMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: initialAiResponseContent,
          timestamp: new Date().toISOString(),
          status: "sent", // Mark as sent, even though it leads to a tool call
          index: messages.length,
        };
        messages.push({ ...initialAiMessage });
        // Save this initial response to the store as well
        await addMessageToStore(initialAiResponseContent, "assistant", chatId);

        // Prepare history for the next API call (including the assistant's tool request message)
        const messagesForNextApiCall = formatMessagesForAPI(); // Gets current history + user message
        messagesForNextApiCall.push({
          role: "assistant",
          content: originalMessageContent,
          tool_calls: toolCalls,
        }); // Add assistant message with tool_calls

        const toolMessages: OpenAIMessage[] = [];

        // Execute tools and collect results
        for (const call of toolCalls) {
          if (call.type === "function") {
            const functionName = call.function.name;
            const functionArgs = JSON.parse(call.function.arguments);
            let functionResult = "Error: Unknown function";

            console.log(
              `[ChatLogic] Executing tool function: ${functionName}`,
              functionArgs,
            );

            if (functionName === "generateTable") {
              // Call placeholder/actual function execution
              functionResult = executeGenerateTable(functionArgs);
            } // Add else if for other functions here

            toolMessages.push({
              role: "tool",
              content: functionResult,
              tool_call_id: call.id,
            });
          }
        }

        // Call API again with tool results
        console.log(
          "[ChatLogic] Calling AI again with tool results:",
          toolMessages,
        );
        const finalApiResponse = await generateAIResponse(
          [...messagesForNextApiCall, ...toolMessages], // Add tool results to history
          { useStream: false }, // Tools generally don't support streaming for the final response
        );

        // Process the FINAL response after tool execution
        finalMessageContent = finalApiResponse.response.message.content; // Assign to outer variable
      } else {
        // Original path: No tool calls requested
        finalMessageContent = originalMessageContent; // Assign to outer variable
      }

      // Ensure content is at least an empty string if still null/undefined for safety
      if (finalMessageContent === null || finalMessageContent === undefined) {
        // If tool calls were made, this might be expected, otherwise warn
        if (!(toolCalls && toolCalls.length > 0)) {
          console.warn(
            "Received null/undefined content from AI without tool calls.",
          );
        }
        finalMessageContent = ""; // Default to empty string
      }

      // Only add a new message if there wasn't a tool call loop OR if the final content is not empty
      if (!(toolCalls && toolCalls.length > 0) || finalMessageContent) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: finalMessageContent, // Use final content variable
          timestamp: new Date().toISOString(),
          status: "sent",
          index: messages.length,
        };

        messages.push({ ...aiMessage });

        // Save final response to store (only if it wasn't the initial tool request message)
        if (!(toolCalls && toolCalls.length > 0)) {
          await addMessageToStore(finalMessageContent, "assistant", chatId); // Use final content variable
        }
      }
      // Handle case where tool call resulted in empty final message
      else if (toolCalls && toolCalls.length > 0 && !finalMessageContent) {
        console.log(
          "[ChatLogic] Tool call execution resulted in empty final content.",
        );
      }
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      isLoading = false;
    }
  }

  /**
   * Handle a streaming AI response
   */
  async function handleStreamingResponse(content: string, chatId: string) {
    // Set reactive state to indicate streaming using helpers
    isStreaming = true;
    streamingContent = "";

    try {
      // Prepare the complete conversation history
      const apiMessages = formatMessagesForAPI();

      // Add a placeholder message for the streaming content
      const aiMessageId = crypto.randomUUID();
      const aiMessage: Message = {
        id: aiMessageId,
        role: "assistant", // Use role
        content: "",
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
        await addMessageToStore(finalMessage.content, "assistant", chatId); // Use 'assistant' role
      }
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      isStreaming = false;
      streamingContent = "";
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
