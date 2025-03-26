/**
 * Chat Store
 *
 * This file re-exports the chat store from the Chat component
 * to provide a consistent import path for all components.
 */

import { browser } from "$app/environment";
import type {
  Chat,
  Message,
  HealthStatus,
  MessageStatus,
  MessageSender,
  Source,
} from "$lib/_archived/lib/types/chat";
// import { createOpenAIClient } from "$lib/services/openaiClient.svelte";

// Create the openAI client only in browser context
// const openai = browser ? createOpenAIClient() : null;

// ** Add a flag to track if init has been run **
let isChatStoreInitialized = false;

const MAX_CHATS_IN_MEMORY = 20; // Example limit

// Declare state variables directly using runes
// For arrays and objects, we can modify their properties
const chats = $state<Chat[]>([]);

// For primitive values, wrap them in objects so we can modify their properties
const chatState = $state({
  currentChatId: null as string | null,
  isLoading: false,
  settings: {
    model: "gpt-4",
    webSearch: false,
    webSearchContextSize: "medium",
    reasoning: false,
  },
  status: {
    isActive: false,
    lastChecked: new Date().toISOString(),
    openai: {
      connected: false,
      model: undefined as string | undefined,
      error: undefined as string | undefined,
    },
  } as HealthStatus,
});

// Add derived values using the wrapped state
const currentChat = $derived.by(() => {
  return chatState.currentChatId
    ? chats.find((chat) => chat.id === chatState.currentChatId)
    : null;
});

// Helper function to create a new message
function createMessage(
  content: string,
  sender: MessageSender,
  status: MessageStatus = "sent",
): Message {
  return {
    id: crypto.randomUUID(),
    content,
    sender,
    timestamp: new Date(),
    status,
    sources: [],
  };
}

// Function to add a message to a chat
function addMessage(content: string, chatId: string) {
  const chat = chats.find((c) => c.id === chatId);
  if (!chat) return;

  // Add user message
  const userMessage = createMessage(content, "user", "sent");
  chat.messages.push(userMessage);
}

// Function to add a system message to a chat
function addSystemMessage(content: string, chatId: string) {
  const chat = chats.find((c) => c.id === chatId);
  if (!chat) return;

  // Add system message
  const systemMessage = createMessage(content, "system", "sent");
  chat.messages.push(systemMessage);
}

// ** Define placeholder generateResponse function to fix linter error **
async function generateResponse(
  content: string,
): Promise<{ content: string; sources?: Source[] }> {
  console.warn(
    "generateResponse function is a placeholder. Implement actual API call.",
  );
  return { content: "This is a placeholder response.", sources: [] }; // Placeholder response
}

/**
 * Initialize the chat store with data
 */
function init(initialChats: Chat[]): boolean {
  if (isChatStoreInitialized) {
    console.warn(
      "Chat store init() called multiple times, but already initialized. Ignoring.",
    );
    return false;
  }

  try {
    // Immediately set flag to prevent concurrent calls during async operations
    isChatStoreInitialized = true;

    $inspect(
      initialChats.length,
      "Initializing chat store with chats from input",
    );

    // Start with provided initial chats (create a deep clone to avoid reference issues)
    let allChatsArray = initialChats.map((chat) => ({
      ...chat,
      messages: [...(chat.messages || [])],
    }));

    // If in browser, try to load additional user chats from localStorage
    if (browser) {
      try {
        const userChatsJson = localStorage.getItem("userChats");
        if (userChatsJson) {
          const userChats = JSON.parse(userChatsJson);
          const existingIds = new Set(allChatsArray.map((c) => c.id));

          // Only add chats that don't already exist
          const newChats = userChats
            .filter((userChat: Chat) => !existingIds.has(userChat.id))
            .map((userChat: Chat) => ({
              ...userChat,
              messages: [...(userChat.messages || [])],
            }));

          // Add new chats to array
          if (newChats.length > 0) {
            allChatsArray = [...allChatsArray, ...newChats];
          }
        } else {
          // Initialize localStorage with empty array if it doesn't exist
          localStorage.setItem("userChats", JSON.stringify([]));
        }
      } catch (error) {
        console.error("Error loading chats from localStorage:", error);
      }
    }

    // Load settings from localStorage
    if (browser) {
      try {
        const settingsJson = localStorage.getItem("chatSettings");
        if (settingsJson) {
          const settings = JSON.parse(settingsJson);

          // Only update settings that exist in the JSON
          if (settings.model) {
            chatState.settings.model = settings.model;
          }
        }
      } catch (error) {
        console.error("Error loading settings from localStorage:", error);
      }
    }

    // Sort chats by createdAt date (newest first)
    allChatsArray.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    // Set all chats in one atomic operation
    chats.splice(0, chats.length, ...allChatsArray);

    // Select first chat if none is selected
    if (allChatsArray.length > 0 && !chatState.currentChatId) {
      chatState.currentChatId = allChatsArray[0].id;
    }

    return true;
  } catch (error) {
    console.error("Error initializing chat store:", error);
    // Reset flag on error so initialization can be retried
    isChatStoreInitialized = false;
    return false;
  }
}

/**
 * Generate a unique ID for messages
 */
function generateMessageId(): string {
  return crypto.randomUUID();
}

/**
 * Create a new chat
 */
async function createNewChat(options: {
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

  console.log(`Creating new chat: ${newChat.name} (${newChat.id})`);

  // Push the new chat to the array
  chats.push(newChat);
  // Update the property of chatState instead of reassigning currentChatId
  chatState.currentChatId = newChat.id;

  // Store in localStorage if in browser
  if (browser) {
    try {
      // Get existing chats from localStorage or initialize with empty array
      const existingChatsJson = localStorage.getItem("userChats");
      const existingChats = existingChatsJson
        ? JSON.parse(existingChatsJson)
        : [];

      // Add new chat to existing chats
      localStorage.setItem(
        "userChats",
        JSON.stringify([...existingChats, newChat]),
      );
      console.log(`Saved chat ${newChat.id} to localStorage`);

      // Dispatch event to notify that user chats have been updated
      notifyChatsUpdated({ newChatId: newChat.id });
      console.log("Dispatched userChatsUpdated event");
    } catch (error) {
      console.error("Failed to store chat in localStorage:", error);
    }
  }

  return newChat.id;
}

/**
 * Switch to a different chat
 */
function switchChat(id: string): void {
  // Update the property instead of reassigning
  chatState.currentChatId = id;
}

/**
 * Handle a new user message submission
 */
async function handleMessageSubmit(messageContent: string): Promise<void> {
  console.log("[chatStore] handleMessageSubmit called with:", messageContent);

  if (!messageContent?.trim() || !chatState.currentChatId) {
    console.error("[chatStore] Invalid message or no chat selected");
    return;
  }

  // Find current chat
  const chatIndex = chats.findIndex(
    (chat) => chat.id === chatState.currentChatId,
  );
  if (chatIndex === -1) {
    console.error(
      "[chatStore] Could not find chat with ID:",
      chatState.currentChatId,
    );
    return;
  }

  // Create user message
  const userMessage: Message = {
    id: generateMessageId(),
    content: messageContent,
    sender: "user",
    timestamp: new Date(),
    status: "sending",
  };

  // IMPORTANT: Create a new array instead of modifying the existing one
  const chatToUpdate = chats[chatIndex];
  const updatedUserMessages = [...chatToUpdate.messages, userMessage];

  // Single atomic update
  chats[chatIndex] = {
    ...chatToUpdate,
    messages: updatedUserMessages,
  };

  // Update localStorage with the latest chats to prevent double-processing
  if (browser) {
    try {
      localStorage.setItem("userChats", JSON.stringify(chats));
    } catch (error) {
      console.error("Failed to update localStorage:", error);
    }
  }

  // Set loading state
  chatState.isLoading = true;

  try {
    // NULL CHECK: Check if openaiClient is available
    if (!openaiClient) {
      throw new Error("OpenAI client not initialized");
    }

    const { stream, cancel } = await openaiClient.generateStreamingResponse(
      messageContent,
      { model: chatState.settings.model },
    );

    if (!stream) throw new Error("Failed to get stream response");

    // Create AI message
    const aiMessage: Message = {
      id: generateMessageId(),
      content: "",
      sender: "ai",
      timestamp: new Date(),
      status: "streaming",
    };

    // Find the current chat again in case it changed during the await
    const currentChatIndex = chats.findIndex(
      (chat) => chat.id === chatState.currentChatId,
    );

    if (currentChatIndex !== -1) {
      const currentChat = chats[currentChatIndex];
      // Create a completely new array and object
      chats[currentChatIndex] = {
        ...currentChat,
        messages: [...currentChat.messages, aiMessage],
      };
    }

    // Process the stream with throttled updates
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let streamedContent = "";
    let lastUpdateTime = Date.now();
    const UPDATE_THRESHOLD_MS = 100; // Increase throttle to 10 updates per second max

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      if (value) {
        streamedContent += decoder.decode(value);

        // Throttle updates more aggressively to prevent infinite loops
        const now = Date.now();
        if (now - lastUpdateTime > UPDATE_THRESHOLD_MS || done) {
          lastUpdateTime = now;

          // Update message with throttled frequency using immutable updates
          const updatedChatIndex = chats.findIndex(
            (chat) => chat.id === chatState.currentChatId,
          );

          if (updatedChatIndex !== -1) {
            const chat = chats[updatedChatIndex];
            const messageIndex = chat.messages.findIndex(
              (msg) => msg.id === aiMessage.id,
            );

            if (messageIndex !== -1) {
              // Create a completely new messages array
              const newMessages = [...chat.messages];
              // Update the specific message
              newMessages[messageIndex] = {
                ...newMessages[messageIndex],
                content: streamedContent,
              };

              // Update the chat with the new messages in a single atomic operation
              chats[updatedChatIndex] = {
                ...chat,
                messages: newMessages,
              };
            }
          }
        }
      }
    }

    // Finalize the AI message as a single operation
    const finalChatIndex = chats.findIndex(
      (chat) => chat.id === chatState.currentChatId,
    );

    if (finalChatIndex !== -1) {
      const chat = chats[finalChatIndex];
      const messageIndex = chat.messages.findIndex(
        (msg) => msg.id === aiMessage.id,
      );

      if (messageIndex !== -1) {
        // Create completely new arrays and objects
        const newMessages = [...chat.messages];
        newMessages[messageIndex] = {
          ...newMessages[messageIndex],
          status: "sent",
        };

        chats[finalChatIndex] = {
          ...chat,
          messages: newMessages,
        };
      }
    }
  } catch (error) {
    console.error("AI Response Error:", error);

    // Add error message as a single operation with immutable updates
    const errorMessage: Message = {
      id: generateMessageId(),
      content:
        "Sorry, there was an error generating a response. Please try again.",
      sender: "system",
      timestamp: new Date(),
      status: "error",
    };

    const errorChatIndex = chats.findIndex(
      (chat) => chat.id === chatState.currentChatId,
    );

    if (errorChatIndex !== -1) {
      const chat = chats[errorChatIndex];
      chats[errorChatIndex] = {
        ...chat,
        messages: [...chat.messages, errorMessage],
      };
    }
  } finally {
    chatState.isLoading = false;

    // Update localStorage with the final state in a single operation
    if (browser) {
      try {
        // Use a setTimeout to defer the localStorage update
        setTimeout(() => {
          localStorage.setItem("userChats", JSON.stringify(chats));
          // Notify of updates with a delay to avoid triggering effects
          setTimeout(() => {
            notifyChatsUpdated();
          }, 50);
        }, 50);
      } catch (error) {
        console.error("Failed to update localStorage:", error);
      }
    }
  }
}

/**
 * Delete a chat
 */
function deleteChat(id: string): void {
  // Find index of chat to delete
  const chatIndex = chats.findIndex((chat) => chat.id === id);

  // If found, remove it
  if (chatIndex !== -1) {
    chats.splice(chatIndex, 1);
  }

  // Update current chat ID if necessary - update property, not reassign
  if (chatState.currentChatId === id) {
    chatState.currentChatId = chats.length > 0 ? chats[0].id : null;
  }
}

/**
 * Check API status
 */
async function checkApiStatus(): Promise<HealthStatus | undefined> {
  if (!browser) return;

  try {
    // NULL CHECK: Check if openaiClient is available
    if (!openaiClient) {
      throw new Error("OpenAI client not initialized");
    }

    const healthData = await openaiClient.checkHealth(chatState.settings.model);

    // Update status properties directly without reassigning status
    chatState.status.isActive = healthData.status === "ok";
    chatState.status.lastChecked = healthData.timestamp;

    // Initialize openai object if it doesn't exist
    if (!chatState.status.openai) {
      chatState.status.openai = {
        connected: false,
        model: undefined,
        error: undefined,
      };
    }

    // Now safely update the openai properties
    chatState.status.openai.connected = healthData.openai.connected;
    chatState.status.openai.model = healthData.openai.model;
    chatState.status.openai.error = healthData.openai.error;

    return chatState.status;
  } catch (error) {
    // Initialize openai object if it doesn't exist
    if (!chatState.status.openai) {
      chatState.status.openai = {
        connected: false,
        model: undefined,
        error: undefined,
      };
    }

    // Update status properties directly without reassigning status
    chatState.status.isActive = false;
    chatState.status.lastChecked = new Date().toISOString();
    chatState.status.openai.connected = false;
    chatState.status.openai.model = undefined;
    chatState.status.openai.error =
      error instanceof Error ? error.message : "Unknown error";

    throw error;
  }
}

/**
 * Update model setting
 */
async function updateModel(model: string): Promise<void> {
  // Prevent multiple calls
  if (chatState.settings.model === model) {
    return;
  }

  // Update model property directly
  const previousModel = chatState.settings.model;
  chatState.settings.model = model;

  try {
    // Save to localStorage to persist the setting
    if (browser) {
      try {
        const settingsJson = localStorage.getItem("chatSettings");
        const settings = settingsJson ? JSON.parse(settingsJson) : {};
        settings.model = model;
        localStorage.setItem("chatSettings", JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save model setting to localStorage:", error);
      }
    }

    // Check API status separately, don't wait for it
    setTimeout(async () => {
      try {
        await checkApiStatus();
      } catch (error) {
        console.error("Error checking API status after model update:", error);
      }
    }, 100);
  } catch (error) {
    // Revert to previous model on error
    chatState.settings.model = previousModel;
    throw error;
  }
}

/**
 * Export chat to markdown
 */
function exportToMarkdown(): void {
  if (!browser || !chatState.currentChatId) return;

  const chat = chats.find((c: Chat) => c.id === chatState.currentChatId);
  if (!chat) return;

  const markdown = chat.messages
    .map((msg: Message) => {
      const role = msg.sender === "user" ? "User" : "Assistant";
      return `### ${role} (${msg.timestamp})\n\n${msg.content}\n`;
    })
    .join("\n");

  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chat-${chat.name}-${new Date().toISOString()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// Add initialization method to the chatStore
function initialize() {
  if (browser && openaiClient) {
    openaiClient.initialize();
  }
}

// Replace the problematic cleanup function
function cleanup() {
  // Only call the openaiClient's cancelRequest method
  if (openaiClient && "cancelRequest" in openaiClient) {
    openaiClient.cancelRequest();
  }

  // Don't attempt to modify abortController or isStreaming directly
  // Those belong to the openaiClient's scope
}

/**
 * Ensure the chat store is initialized
 */
function ensureInitialized(initialChats: Chat[] = []): boolean {
  // Don't initialize on server side
  if (!browser) {
    console.log("Skipping chat store initialization on server");
    return false;
  }

  if (isChatStoreInitialized) {
    return true; // Already initialized, nothing to do
  }
  return init(initialChats); // Only initialize if needed
}

// Export the interface to expose state variables and methods
export interface ChatStoreInterface {
  chats: typeof chats;
  currentChatId: typeof chatState.currentChatId;
  isLoading: typeof chatState.isLoading;
  status: typeof chatState.status;
  settings: typeof chatState.settings;
  currentChat: typeof currentChat;
  init: typeof init;
  createNewChat: typeof createNewChat;
  switchChat: typeof switchChat;
  handleMessageSubmit: typeof handleMessageSubmit;
  deleteChat: typeof deleteChat;
  checkApiStatus: typeof checkApiStatus;
  updateModel: typeof updateModel;
  exportToMarkdown: typeof exportToMarkdown;
  addMessage: typeof addMessage;
  addSystemMessage: typeof addSystemMessage;
  createMessage: typeof createMessage;
  initialize: typeof initialize;
  cleanup: typeof cleanup;
  ensureInitialized: typeof ensureInitialized;
}

// Export the store instance
export const chatStore: ChatStoreInterface = {
  // Direct state variable references
  chats,
  currentChatId: chatState.currentChatId,
  isLoading: chatState.isLoading,
  status: chatState.status,
  settings: chatState.settings,
  currentChat,

  // Methods
  init,
  createNewChat,
  switchChat,
  handleMessageSubmit,
  deleteChat,
  checkApiStatus,
  updateModel,
  exportToMarkdown,
  addMessage,
  addSystemMessage,
  createMessage,
  cleanup,

  // Add initialize method
  initialize,

  // Add ensureInitialized method
  ensureInitialized,
};

export type { ChatStoreInterface as ChatStore };

// Improve notifyChatsUpdated to be more resilient
let debounceTimer: number | null = null;
let lastNotifyTime = 0;
const NOTIFY_THROTTLE_MS = 500; // Increase debounce to 500ms to prevent rapid updates

function notifyChatsUpdated(detail = {}) {
  // Check if window is defined (browser environment)
  if (!browser) return;

  // Throttle notifications to prevent cascading updates
  const now = Date.now();
  if (now - lastNotifyTime < NOTIFY_THROTTLE_MS) {
    // Clear any pending debounce
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new debounce with remaining time plus a buffer
    const remainingTime = NOTIFY_THROTTLE_MS - (now - lastNotifyTime) + 100;
    debounceTimer = setTimeout(() => {
      lastNotifyTime = Date.now();
      // Use requestAnimationFrame to ensure we're not in the middle of a render cycle
      requestAnimationFrame(() => {
        if (browser) {
          // Double-check browser context
          window.dispatchEvent(new CustomEvent("userChatsUpdated", { detail }));
        }
      });
      debounceTimer = null;
    }, remainingTime) as unknown as number;

    return;
  }

  // Normal debounce logic
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    lastNotifyTime = Date.now();
    // Use requestAnimationFrame to ensure we're not in the middle of a render cycle
    requestAnimationFrame(() => {
      if (browser) {
        // Double-check browser context
        window.dispatchEvent(new CustomEvent("userChatsUpdated", { detail }));
      }
    });
    debounceTimer = null;
  }, 200) as unknown as number; // Increase to 200ms for more debouncing
}

// Skip TypeScript errors for archived code
const openaiClient = /* istanbul ignore next */ {
  initialize: () => {},
  cancelRequest: () => {},
  generateStreamingResponse: async (_message: string, _options: any) => {
    // Return a mock response that matches the expected type shape
    return {
      stream: {
        getReader: () => ({
          read: async () => ({ done: true, value: new Uint8Array() }),
        }),
      },
      cancel: () => {},
    };
  },
  checkHealth: async (_model?: string) => {
    // Return an object that matches the expected health data shape
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      openai: {
        connected: false,
        model: "mock-model",
        error: undefined,
      },
    };
  },
};
