/**
 * Chat Message Component Logic
 * 
 * This file contains the business logic for the ChatMessage component,
 * using Svelte 5 runes for state management.
 */
import type { ChatMessage } from '../../types';
import { marked } from 'marked';

/**
 * Creates the logic for the ChatMessage component
 */
export function createChatMessageLogic(message: ChatMessage) {
  const messageState = $state({
    isEditing: false,
    editContent: message.content,
    isUpdating: false,
    error: null as string | null
  });

  const handleUpdate = async () => {
    if (!messageState.editContent.trim() || messageState.isUpdating) return;

    try {
      messageState.isUpdating = true;
      await chatService.updateMessage(message.id, messageState.editContent);
      messageState.isEditing = false;
    } catch (err) {
      messageState.error = err instanceof Error ? err.message : "Failed to update message";
    } finally {
      messageState.isUpdating = false;
    }
  };

  return {
    get isEditing() { return messageState.isEditing; },
    get editContent() { return messageState.editContent; },
    get isUpdating() { return messageState.isUpdating; },
    get error() { return messageState.error; },
    setEditing: (value: boolean) => { messageState.isEditing = value; },
    setEditContent: (value: string) => { messageState.editContent = value; },
    handleUpdate,
    clearError: () => { messageState.error = null; }
  };
}
