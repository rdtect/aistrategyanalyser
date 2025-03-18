import { chatStore } from "../Chat.svelte.ts";
import { browser } from "$app/environment";

interface AnalysisQuestion {
  id: string;
  question: string;
  prompt: string;
  answer?: string;
  status: "pending" | "processing" | "completed" | "error";
}

interface AnalysisStateType {
  step: number;
  companyInfo: {
    company: string;
    region: string;
    industry: string;
    context: string;
  };
  selectedQuestions: Record<string, boolean>;
  analysisProgress: {
    questions: AnalysisQuestion[];
    currentIndex: number;
    completed: number;
    total: number;
  };
}

import categoryQuestionPrompts from "$lib/data/category_question_prompts.json";

function findQuestionById(id: string): { question: string; prompt: string } {
  for (const [category, questions] of Object.entries(categoryQuestionPrompts)) {
    const question = questions.find((q) => q.id === id);
    if (question) {
      return {
        question: question.question,
        prompt: `
                    Role: ${question.prompt["Role Definition"]}
                    
                    Context:
                    Company: ${analysisState.companyInfo.company}
                    Industry: ${analysisState.companyInfo.industry}
                    Region: ${analysisState.companyInfo.region}
                    Additional Context: ${analysisState.companyInfo.context}
                    
                    Question: ${question.question}
                    Task: ${question.prompt["Task Description"]}
                    
                    Format your response as follows:
                    ${question.prompt["Output Format"]}
                `.trim(),
      };
    }
  }
  throw new Error(`Question with ID ${id} not found`);
}

function createPrompt(
  basePrompt: string,
  companyInfo: AnalysisStateType["companyInfo"]
): string {
  return `
        Company: ${companyInfo.company}
        Industry: ${companyInfo.industry}
        Region: ${companyInfo.region}
        Context: ${companyInfo.context}
        
        ${basePrompt}
    `.trim();
}

export const analysisState = $state<AnalysisStateType>({
  step: 1,
  companyInfo: {
    company: "",
    region: "",
    industry: "",
    context: "",
  },
  selectedQuestions: {},
  analysisProgress: {
    questions: [],
    currentIndex: 0,
    completed: 0,
    total: 0,
  },
});

export async function initializeAnalysis(): Promise<string> {
  const selectedQuestionIds = Object.entries(analysisState.selectedQuestions)
    .filter(([, selected]) => selected)
    .map(([id]) => id);

  console.log("Selected Question IDs:", selectedQuestionIds);

  // Create new chat first
  const chatId = await chatStore.createNewChat({
    name: `Analysis: ${analysisState.companyInfo.company}`,
    company: analysisState.companyInfo.company,
    industry: analysisState.companyInfo.industry,
    region: analysisState.companyInfo.region,
    context: analysisState.companyInfo.context,
  });

  console.log("New Chat ID:", chatId);
  console.log("Current Chat Store State:", {
    chats: chatStore.chats,
    currentChat: chatStore.currentChat,
    currentChatId: chatStore.currentChatId,
  });

  // Switch to the new chat
  chatStore.switchChat(chatId);

  console.log("After Switch - Current Chat:", chatStore.currentChat);

  // Prepare questions with explicit status type and proper Responses API format
  const preparedQuestions: AnalysisQuestion[] = selectedQuestionIds.map(
    (id) => {
      // Find the original question to get the detailed prompt information
      let originalQuestionData;
      for (const [category, categoryQuestions] of Object.entries(
        categoryQuestionPrompts
      )) {
        const foundQuestion = categoryQuestions.find((q) => q.id === id);
        if (foundQuestion) {
          originalQuestionData = foundQuestion;
          break;
        }
      }

      if (!originalQuestionData) {
        throw new Error(`Question with ID ${id} not found in category prompts`);
      }

      // Format for Responses API
      const instructions = `
Role: ${originalQuestionData.prompt["Role Definition"]}

Context:
Company: ${analysisState.companyInfo.company}
Industry: ${analysisState.companyInfo.industry}
Region: ${analysisState.companyInfo.region}
Additional Context: ${analysisState.companyInfo.context}

Task: ${originalQuestionData.prompt["Task Description"]}

Format your response as follows:
${originalQuestionData.prompt["Output Format"]}
`.trim();

      return {
        id,
        question: originalQuestionData.question,
        prompt: instructions, // Store the formatted instructions prompt
        status: "pending" as const,
      };
    }
  );

  console.log("Prepared Questions:", preparedQuestions);

  // Update analysis progress state
  analysisState.analysisProgress = {
    questions: preparedQuestions,
    currentIndex: 0,
    completed: 0,
    total: selectedQuestionIds.length,
  };

  // Add initial message to the chat using the Responses API format
  await chatStore.handleAIResponse(`# Analysis Started for ${analysisState.companyInfo.company}

## Company Information
- Industry: ${analysisState.companyInfo.industry}
- Region: ${analysisState.companyInfo.region}

Processing ${preparedQuestions.length} analysis questions...`);

  console.log("Final Chat State:", {
    chats: chatStore.chats,
    currentChat: chatStore.currentChat,
    messages: chatStore.messages,
  });

  return chatId;
}

import type { Chat } from "$lib/data/sampleChats";

// Create reactive state with runes
let chats = $state<Chat[]>([]);
let currentChatId = $state(0);

// Derived state for current chat
const currentChat = $derived(chats.find((chat) => chat.id === currentChatId));

export async function processAnalysis() {
  const { questions } = analysisState.analysisProgress;
  const results = await Promise.all(
    questions.map(async (question) => {
      // Get the original question details to access full prompt data
      let originalQuestionData;
      for (const [category, categoryQuestions] of Object.entries(
        categoryQuestionPrompts
      )) {
        const foundQuestion = categoryQuestions.find(
          (q) => q.id === question.id
        );
        if (foundQuestion) {
          originalQuestionData = foundQuestion;
          break;
        }
      }

      if (!originalQuestionData) {
        throw new Error(`Question with ID ${question.id} not found`);
      }

      // Format the specific instructions for this question using the Responses API format
      const instructions = `
Role: ${originalQuestionData.prompt["Role Definition"]}

Context:
Company: ${analysisState.companyInfo.company}
Industry: ${analysisState.companyInfo.industry}
Region: ${analysisState.companyInfo.region}
Additional Context: ${analysisState.companyInfo.context}

Task: ${originalQuestionData.prompt["Task Description"]}

Format your response as follows:
${originalQuestionData.prompt["Output Format"]}
`.trim();

      // Call the API with the Responses format
      const response = await fetch("/api/ai/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: question.question, // The actual question as input
          options: {
            instructions: instructions, // Question-specific instructions
            context: analysisState.companyInfo,
            model: "gpt-4o",
          },
        }),
      });

      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();

      return {
        question: question.question,
        answer: data.response.content, // Updated to match the response format
      };
    })
  );

  // Create new chat with string ID
  const newChatId = crypto.randomUUID();
  const newChat: Chat = {
    id: newChatId,
    name: `Analysis: ${analysisState.companyInfo.company}`,
    messages: [
      {
        id: 0,
        content: `# Company Analysis: ${analysisState.companyInfo.company}

## Company Information
- Industry: ${analysisState.companyInfo.industry}
- Region: ${analysisState.companyInfo.region}

## Analysis Results
${results
  .map(
    (r) => `
### ${r.question}
${r.answer}
`
  )
  .join("\n")}`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
        status: "sent",
      },
    ],
    createdAt: new Date().toISOString(),
    company: analysisState.companyInfo.company,
    industry: analysisState.companyInfo.industry,
    region: analysisState.companyInfo.region,
  };

  // Update state directly
  chats = [...chats, newChat];
  currentChatId = newChat.id;

  // Store the new chat in localStorage to persist it
  if (browser) {
    try {
      const storedChats = JSON.parse(localStorage.getItem("userChats") || "[]");
      localStorage.setItem(
        "userChats",
        JSON.stringify([...storedChats, newChat])
      );

      // Dispatch a custom event to notify that user chats have been updated
      window.dispatchEvent(
        new CustomEvent("userChatsUpdated", {
          detail: { newChatId },
        })
      );
    } catch (error) {
      console.error("Failed to store chat in localStorage:", error);
    }
  }

  return newChat.id;
}
