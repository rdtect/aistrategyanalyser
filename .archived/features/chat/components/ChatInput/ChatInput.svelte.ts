/**
 * Chat Input Component Logic
 *
 * This file contains the business logic for the ChatInput component,
 * using Svelte 5 runes for state management.
 */

import { chatService } from '$lib/features/chat/services/chatService';

/**
 * Creates the logic for the ChatInput component
 */
export function createChatInputLogic() {
  const inputState = $state({
    content: '',
    isSubmitting: false,
    error: null as string | null
  });

  const handleSubmit = async () => {
    if (!inputState.content.trim() || inputState.isSubmitting) return;

    try {
      inputState.isSubmitting = true;
      await chatService.submitMessage(inputState.content);
      inputState.content = '';
    } catch (err) {
      inputState.error = err instanceof Error ? err.message : "Failed to submit message";
    } finally {
      inputState.isSubmitting = false;
    }
  };

  return {
    get content() { return inputState.content; },
    get isSubmitting() { return inputState.isSubmitting; },
    get error() { return inputState.error; },
    setContent: (value: string) => { inputState.content = value; },
    handleSubmit,
    clearError: () => { inputState.error = null; }
  };
}
