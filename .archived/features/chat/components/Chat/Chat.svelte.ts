/**
 * Chat Component Logic using Svelte 5 Runes
 *
 * This file implements the UI logic for the Chat component following the
 * pattern described in the chat-feature-reorganization-plan.md.
 */
import type { Chat, ChatMessage } from "../../types/chat";
import { browser } from "$app/environment";
import { chatStore } from "../../stores/chatStore.svelte";
import * as storageService from "../../services/storageService";
import { aiClientService } from "../../services/aiClientService";
import { tick } from "svelte";

/**
 * Creates and returns the chat component logic
 */
export function createChatLogic() {
  // Component state using runes
  let chats = $state<Record<string, Chat>>({});
  let activeChatId = $state<string | null>(null);
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let messageInput = $state("");
  let autoScroll = $state(true);
  let viewport = $state<HTMLElement | null>(null);
  let messagesContainer = $state<HTMLElement | null>(null);
  let isGeneratingResponse = $state(false);

  // Helper functions
  function getActiveChatData(): Chat | null {
    if (!activeChatId) return null;
    return chats[activeChatId] || null;
  }

  // Derived values
  const activeChat = $derived(getActiveChatData());
  const messages = $derived(activeChat?.messages || []);
  const sortedMessages = $derived(
    [...messages].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    ),
  );

  // Initialize component effects
  $effect(() => {
    if (!browser) return;

    // Subscribe to store changes
    const unsubscribe = chatStore.subscribe((chatState) => {
      if (chatState) {
        chats = chatState.chats || {};

        // Only update activeChatId if it's different to avoid unnecessary rerenders
        if (chatState.activeChatId !== activeChatId) {
          activeChatId = chatState.activeChatId;
        }
      }
    });

    // Listen for chat update events
    const handleChatsUpdated = async () => {
      if (activeChatId) {
        try {
          const updatedChat = await storageService.getChat(activeChatId);
          if (updatedChat) {
            chats = { ...chats, [activeChatId]: updatedChat };
          }
        } catch (err) {
          console.error("Error refreshing active chat:", err);
        }
      }
    };

    window.addEventListener("userChatsUpdated", handleChatsUpdated);

    // Return cleanup function
    return () => {
      unsubscribe();
      window.removeEventListener("userChatsUpdated", handleChatsUpdated);
    };
  });

  // Autoscroll effect - runs before DOM updates
  $effect.pre(() => {
    // Only run when messages change
    sortedMessages;

    if (!viewport) return;

    const isNearBottom =
      viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;

    if (isNearBottom || autoScroll) {
      tick().then(() => {
        if (viewport) {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    }
  });

  // Resize observer for message container
  $effect(() => {
    if (!messagesContainer) return;

    const observer = new ResizeObserver(() => {
      if (autoScroll && viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    });

    observer.observe(messagesContainer);
    return () => observer.disconnect();
  });

  // Message handling
  async function handleSendMessage(e: Event) {
    e?.preventDefault();
    const currentMessageInput = messageInput.trim();

    if (!currentMessageInput || isLoading || isGeneratingResponse) return;

    try {
      isLoading = true;
      error = null;
      messageInput = ""; // Clear input early for better UX

      if (!activeChatId) {
        throw new Error("No active chat");
      }

      // Create user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: currentMessageInput,
        sender: "user",
        timestamp: new Date().toISOString(),
        status: "sent",
      };

      // Add user message to chat
      await addMessage(userMessage);

      // Generate AI response
      await generateAIResponse(currentMessageInput);
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to send message";
      console.error("Error sending message:", err);
    } finally {
      isLoading = false;
    }
  }

  // Generate AI response
  async function generateAIResponse(userMessageContent: string) {
    if (!activeChatId || !activeChat) return;

    try {
      isGeneratingResponse = true;

      // Create a temporary "thinking" message
      const thinkingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: "Thinking...",
        sender: "ai",
        timestamp: new Date().toISOString(),
        status: "thinking",
      };

      // Add thinking message (optional - can be removed if not needed)
      // await addMessage(thinkingMessage);

      // Generate AI response using the service
      const aiResponse = await aiClientService.generateAIResponse(
        activeChat,
        userMessageContent,
      );

      // Remove thinking message if it was added
      // if (activeChat.messages.find(m => m.id === thinkingMessage.id)) {
      //   await removeMessage(thinkingMessage.id);
      // }

      // Add the real AI response
      await addMessage(aiResponse);
    } catch (err) {
      error =
        err instanceof Error ? err.message : "Failed to generate AI response";
      console.error("Error generating AI response:", err);

      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: "Sorry, I couldn't generate a response. Please try again.",
        sender: "system",
        timestamp: new Date().toISOString(),
        status: "error",
      };

      await addMessage(errorMessage);
    } finally {
      isGeneratingResponse = false;
    }
  }

  // Handle regenerate response
  async function handleRegenerateResponse(
    messageId: string,
    previousUserMessageId: string | null,
  ) {
    if (!activeChatId || !activeChat) {
      error = "No active chat found";
      return;
    }

    try {
      isLoading = true;
      error = null;

      // Find the message to regenerate
      const messageToRegenerate = activeChat.messages.find(
        (m) => m.id === messageId,
      );
      if (!messageToRegenerate || messageToRegenerate.sender !== "ai") {
        throw new Error("Invalid message to regenerate");
      }

      // Set status to regenerating
      const updatedMessage: ChatMessage = {
        ...messageToRegenerate,
        status: "regenerating",
      };

      // Update the message in the chat
      const updatedMessages = activeChat.messages.map((m) =>
        m.id === messageId ? updatedMessage : m,
      );

      // Update the chat with the updated message
      const updatedChat: Chat = {
        ...activeChat,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      };

      // Update local state
      chats = {
        ...chats,
        [activeChatId]: updatedChat,
      };

      // Update store
      chatStore.updateChat(activeChatId, updatedChat);

      // Find the user message that triggered this AI response
      let userMessageContent = "";

      if (previousUserMessageId) {
        const userMessage = activeChat.messages.find(
          (m) => m.id === previousUserMessageId,
        );
        if (userMessage && userMessage.sender === "user") {
          userMessageContent = userMessage.content;
        }
      }

      if (!userMessageContent) {
        // If we couldn't find the user message, look for the most recent user message before this AI message
        const messageIndex = activeChat.messages.findIndex(
          (m) => m.id === messageId,
        );
        if (messageIndex > 0) {
          for (let i = messageIndex - 1; i >= 0; i--) {
            if (activeChat.messages[i].sender === "user") {
              userMessageContent = activeChat.messages[i].content;
              break;
            }
          }
        }
      }

      if (!userMessageContent) {
        throw new Error(
          "Could not find user message to regenerate response for",
        );
      }

      // Remove the current AI message
      await removeMessage(messageId);

      // Generate a new AI response
      await generateAIResponse(userMessageContent);
    } catch (err) {
      error =
        err instanceof Error ? err.message : "Failed to regenerate response";
      console.error("Error regenerating response:", err);
    } finally {
      isLoading = false;
    }
  }

  // Add message to chat
  async function addMessage(message: ChatMessage) {
    if (!activeChatId) {
      error = "No active chat found";
      return false;
    }

    try {
      // Add message to storage
      const updatedChat = await storageService.addMessageToChat(
        activeChatId,
        message,
      );

      if (updatedChat) {
        // Update local state with immutable pattern
        chats = {
          ...chats,
          [activeChatId]: updatedChat,
        };

        // Update store
        chatStore.updateChat(activeChatId, updatedChat);

        return true;
      }

      return false;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to add message";
      return false;
    }
  }

  // Remove message from chat (used for temporary messages)
  async function removeMessage(messageId: string) {
    if (!activeChatId || !activeChat) {
      return false;
    }

    try {
      // Filter out the message
      const updatedMessages = activeChat.messages.filter(
        (m) => m.id !== messageId,
      );

      // Create updated chat
      const updatedChat: Chat = {
        ...activeChat,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      };

      // Save to storage
      await storageService.saveChat(updatedChat);

      // Update local state
      chats = {
        ...chats,
        [activeChatId]: updatedChat,
      };

      // Update store
      chatStore.updateChat(activeChatId, updatedChat);

      return true;
    } catch (err) {
      console.error("Error removing message:", err);
      return false;
    }
  }

  // Set active chat
  async function setActiveChat(id: string) {
    if (!id) {
      console.error("No chat ID provided to setActiveChat");
      return false;
    }

    try {
      // Update local state
      activeChatId = id;

      // Update store
      chatStore.setActiveChat(id);

      // If chat not in local state, load from storage
      if (!chats[id]) {
        try {
          const chat = await storageService.getChat(id);
          if (chat) {
            // Update local state with immutable pattern
            chats = { ...chats, [id]: chat };
            return true;
          } else {
            error = `Chat ${id} not found`;
            return false;
          }
        } catch (err) {
          error =
            err instanceof Error ? err.message : `Error loading chat ${id}`;
          return false;
        }
      }

      return true;
    } catch (err) {
      error =
        err instanceof Error ? err.message : `Error setting active chat ${id}`;
      return false;
    }
  }

  // Update message input
  function updateMessageInput(value: string) {
    messageInput = value;
  }

  // Clear error
  function clearError() {
    error = null;
  }

  // Return the public interface
  return {
    // State getters
    get isLoading() {
      return isLoading || isGeneratingResponse;
    },
    get error() {
      return error;
    },
    get messageInput() {
      return messageInput;
    },
    get messages() {
      return sortedMessages;
    },
    get activeChat() {
      return activeChat;
    },

    // Methods
    updateMessageInput,
    handleSendMessage,
    handleRegenerateResponse,
    clearError,
    setActiveChat,

    // Element refs
    setViewport: (node: HTMLElement) => {
      viewport = node;
      return {};
    },
    setMessagesContainer: (node: HTMLElement) => {
      messagesContainer = node;
      return {};
    },
  };
}
