import {
  type OpenAIMessage,
  type OpenAIRequestOptions,
  type UnifiedAIResponseType,
  OpenAIService,
} from "$lib/services/OpenAIService";
import { chatManager } from "../../ChatManager.svelte.ts";
import type { Chat } from "$lib/types";
import {
  categoryQuestionsData,
  type Question,
} from "../../data/category_question_prompts";
import { v4 as uuidv4 } from "uuid";
import {
  getAnalysisError,
  getIsAnalyzing as getIsAnalysisStateAnalyzing,
} from "./analysisState.svelte";

// Create an instance of OpenAIService
const openAIService = new OpenAIService();

// Helper to prepare tasks (can remain internal)
function _prepareAutomatedAnalysisTasks(chat: Chat) {
  const analysisTasks: { question: any; apiMessages: OpenAIMessage[] }[] = [];
  const systemPrompt =
    chat.context?.system_prompt || "You are a helpful assistant.";
  for (const [categoryName, questions] of Object.entries(
    categoryQuestionsData,
  )) {
    for (const question of questions) {
      const userPromptContent =
        question.prompt?.["Task Description"] || question.question || "";
      if (!userPromptContent) continue;
      const apiMessages: OpenAIMessage[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPromptContent },
      ];
      analysisTasks.push({ question, apiMessages });
    }
  }
  return analysisTasks;
}

// Helper to execute tasks (can remain internal)
async function _executeAnalysisTasksInParallel(
  tasks: { apiMessages: OpenAIMessage[] }[],
) {
  console.log(`Executing ${tasks.length} analysis prompts in parallel...`);
  return await Promise.allSettled(
    tasks.map((task) =>
      openAIService.generateAIResponse(task.apiMessages, {
        model: "gpt-4o",
        useStream: false,
        useResponsesAPI: true,
        tools: [{ type: "web_search_preview" }],
      }),
    ),
  );
}

// Helper to process results (can remain internal)
async function _processAnalysisResults(
  results: PromiseSettledResult<UnifiedAIResponseType>[],
  tasks: { question: any }[],
  chatId: string,
) {
  let errorOccurred = false;
  try {
    for (let i = 0; i < results.length; i += 1) {
      const result = results[i];
      const task = tasks[i];
      let assistantAnswerMessage = "";
      if (result.status === "fulfilled") {
        const aiResponse = result.value;
        const aiAnswerText =
          aiResponse.response?.message?.content?.trim() ??
          "No answer received or answer was empty.";
        assistantAnswerMessage = `Answer: ${aiAnswerText}`;
      } else {
        console.error(
          `Error analyzing question "${task.question.question}":`,
          result.reason,
        );
        assistantAnswerMessage = `Answer: Error processing this question. (${result.reason?.message || "Unknown error"})`;
        errorOccurred = true;
      }
      try {
        // Only one argument: content string
        await chatManager.sendMessage(assistantAnswerMessage);
      } catch (addError) {
        console.error(
          `Error adding assistant answer message: ${task.question.question}`,
          addError,
        );
      }
    }
    console.log("Finished adding all analysis answers.");
  } catch (processingError) {
    console.error("Error processing analysis results:", processingError);
    errorOccurred = true;
    try {
      await chatManager.sendMessage(
        "Analysis Error: Could not process all analysis results."
      );
    } catch (error) {
      console.error("Failed to add error message to chat:", error);
    }
  }
  return errorOccurred; // Return if any error happened during processing
}

export async function triggerAutomatedAnalysis() {
  // This function assumes it's called within a context where
  // analysis state (like isAnalyzing) is already managed (e.g., by runAnalysis).
  // It focuses *only* on performing the automated multi-question analysis.
  console.log("Executing automated analysis tasks...");

  try {
    // Retrieve the active chat correctly - activeChat is a property, not a method
    const currentActiveChat = chatManager.activeChat;

    if (!currentActiveChat) {
      throw new Error("No active chat found to run automated analysis.");
    }
    // Use as Chat object (cast via unknown for TS safety)
    const chatId = (currentActiveChat as unknown as Chat).id;

    console.log(`Starting analysis for chat: ${chatId}`);
    // Use the internal helpers to perform the analysis
    const analysisTasks = _prepareAutomatedAnalysisTasks(
      currentActiveChat as unknown as Chat,
    );
    if (analysisTasks.length === 0) {
      console.log("No analysis tasks prepared.");
      return { success: true, message: "No tasks to run." };
    }

    // ...existing code...

    const results = await _executeAnalysisTasksInParallel(analysisTasks);
    const errorOccurred = await _processAnalysisResults(
      results,
      analysisTasks,
      chatId,
    );

    if (errorOccurred) {
      console.warn(
        "Automated analysis completed with errors for some questions.",
      );
      // Return success=true because the process ran, but include error info
      return {
        success: true,
        error: "Analysis completed with errors for some questions.",
      };
    } else {
      console.log("Automated analysis completed successfully.");
      return { success: true };
    }
  } catch (error) {
    console.error(
      "Critical error during automated analysis orchestration:",
      error,
    );
    // Return an error structure that runAnalysis expects
    return { error: error instanceof Error ? error.message : String(error) };
  }
}
