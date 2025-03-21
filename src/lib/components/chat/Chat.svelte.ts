import { marked } from "marked";
import {
  AI_MODELS,
  type AIModel,
  type SearchContextSize,
} from "$lib/config/aiModels";
import type { Chat, Message, MessageStatus } from "$lib/types/chat";
import { browser } from "$app/environment";
import { checkHealth } from "$lib/components/chat/healthCheck";

// Create default values
const defaultChat: Chat = {
  id: "",
  name: "New Chat",
  messages: [],
  createdAt: new Date(),
  company: "",
  industry: "",
  region: "",
};

// Initialize state with proper typing
let chats = $state<Chat[]>([]);
let currentChatId = $state<string | null>(null);
let isLoading = $state(false);

// Settings
let settings = $state({
  model: Object.keys(AI_MODELS)[0] as AIModel,
  webSearch: false,
  webSearchContextSize: "medium" as SearchContextSize,
  reasoning: false,
});

interface ChatStatus {
  isActive: boolean;
  lastChecked: string;
  openai?: {
    connected: boolean;
    model?: string;
    error?: string;
  };
  error?: string;
}

let status = $state<ChatStatus>({
  isActive: false,
  lastChecked: new Date().toISOString(),
  openai: {
    connected: false,
    model: undefined,
  },
});

// Helper functions
function formatMessage(text: string): string {
  try {
    return marked.parse(text) as string;
  } catch (error) {
    console.error("Error parsing markdown:", error);
    return text;
  }
}

function getTimestamp(): Date {
  return new Date();
}

function generateMessageId(messages: Message[]): string {
  return crypto.randomUUID();
}

async function generateAIResponse(message: string, context?: unknown) {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to generate AI response");
  }

  return (await response.json()).response;
}

// Export store with initialization method
export const chatStore = {
  init(initialChats: Chat[]) {
    // Start with provided initial chats
    let allChats = [...initialChats];

    // If in browser, try to load additional user chats from localStorage
    if (browser) {
      try {
        const storedChats = JSON.parse(
          localStorage.getItem("userChats") || "[]"
        );
        // Add any stored chats that don't exist in initialChats
        storedChats.forEach((storedChat: Chat) => {
          if (!allChats.find((c) => c.id === storedChat.id)) {
            allChats.push(storedChat);
          }
        });
      } catch (error) {
        console.error("Failed to load chats from localStorage:", error);
      }
    }

    chats = allChats;
    currentChatId = allChats[0]?.id ?? null;
  },

  get chats() {
    return chats;
  },
  get currentChatId() {
    return currentChatId;
  },
  get isLoading() {
    return isLoading;
  },
  get settings() {
    return settings;
  },
  get status() {
    return status;
  },

  get currentChat() {
    return chats.find((chat) => chat?.id === currentChatId) ?? defaultChat;
  },

  get messages() {
    return this.currentChat?.messages ?? [];
  },

  async createNewChat(options: {
    name: string;
    company: string;
    industry: string;
    region: string;
    context?: string;
  }): Promise<string> {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      messages: [],
      createdAt: new Date(),
      company: options.company,
      industry: options.industry,
      region: options.region,
      name: options.name,
    };
    chats = [...chats, newChat];
    currentChatId = newChat.id;

    // Store in localStorage if in browser
    if (browser) {
      try {
        const storedChats = JSON.parse(
          localStorage.getItem("userChats") || "[]"
        );
        localStorage.setItem(
          "userChats",
          JSON.stringify([...storedChats, newChat])
        );

        // Dispatch event to notify that user chats have been updated
        window.dispatchEvent(
          new CustomEvent("userChatsUpdated", {
            detail: { newChatId: newChat.id },
          })
        );
      } catch (error) {
        console.error("Failed to store chat in localStorage:", error);
      }
    }

    return newChat.id;
  },

  switchChat(id: string): void {
    currentChatId = id;
  },

  async handleMessageSubmit(messageContent: string): Promise<void> {
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: generateMessageId(this.messages),
      content: messageContent,
      sender: "user",
      timestamp: getTimestamp(),
      status: "sending",
    };

    chats = chats.map((chat) =>
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    );

    isLoading = true;
    try {
      const aiResponse = await generateAIResponse(
        messageContent,
        this.currentChat
      );
      const aiMessage: Message = {
        id: generateMessageId(this.messages),
        content: formatMessage(aiResponse),
        sender: "ai",
        timestamp: getTimestamp(),
        status: "sent",
      };

      chats = chats.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, aiMessage] }
          : chat
      );
    } catch (error) {
      console.error("AI Response Error:", error);
    } finally {
      isLoading = false;
    }
  },
  async handleAIResponse(response: string): Promise<void> {
    if (!response || !this.currentChat) return;

    // Rather than formatting the response, we'll use it directly
    // since it's coming formatted from our application, not the API
    const aiMessage: Message = {
      id: crypto.randomUUID(),
      content: response,
      sender: "ai",
      timestamp: new Date(),
      status: "sent",
    };

    chats = chats.map((chat) =>
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, aiMessage] }
        : chat
    ) as Chat[];
  },
  deleteChat(id: string): void {
    chats = chats.filter((chat) => chat.id !== id) as Chat[];
    if (currentChatId === id) {
      currentChatId = chats[0]?.id || null;
    }
  },
  async cancelCurrentRequest() {
    // Only run in browser environment
    if (!browser) return;

    try {
      // Cancel any ongoing fetch requests
      if (typeof window !== "undefined" && window._currentChatRequest) {
        window._currentChatRequest.abort();
      }
      // Reset any ongoing streams
      if (typeof window !== "undefined" && window._currentChatStream) {
        window._currentChatStream.cancel();
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
    }
  },
  async processQuestion(
    chatId: string,
    questionData: { question: string; prompt: string }
  ) {
    // Only run in browser environment
    if (!browser) return null;

    try {
      // Create an AbortController for this specific request
      if (typeof window !== "undefined") {
        window._currentChatRequest = new AbortController();
        return await generateAIResponse(questionData.prompt, {
          chatId,
          question: questionData.question,
          signal: window._currentChatRequest.signal,
        });
      }
      return null;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "AbortError"
      ) {
        return null;
      }
      throw error;
    }
  },
  async checkApiStatus() {
    if (!browser) return;
    try {
      // Include the current model in the request
      const response = await fetch(`/api/health?model=${settings.model}`);
      const data = await response.json();

      // Update the status with the response
      status = {
        isActive: data.status === "ok",
        lastChecked: data.timestamp,
        openai: {
          connected: data.openai.connected,
          model: data.openai.model,
        },
      };

      return status;
    } catch (error) {
      status = {
        isActive: false,
        lastChecked: new Date().toISOString(),
        openai: {
          connected: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
      throw error;
    }
  },
  async updateModel(model: AIModel) {
    settings.model = model;
    await this.checkApiStatus();
  },
  exportToMarkdown() {
    const markdown = this.messages
      .map((msg) => {
        const role = msg.sender === "user" ? "User" : "Assistant";
        return `### ${role} (${msg.timestamp})\n\n${msg.content}\n`;
      })
      .join("\n");
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${new Date().toISOString()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  },
  formatMessage,
  generateMessageId,
  getTimestamp,
};

// Add these to the window type
declare global {
  interface Window {
    _currentChatRequest: AbortController;
    _currentChatStream: { cancel: () => void };
  }
}

// Ensure browser-specific code only runs in the browser
if (browser) {
  setTimeout(() => chatStore.checkApiStatus(), 1000);
} else {
  // SSR safe initialization - nothing to do here
  console.log("Running in SSR mode");
}
