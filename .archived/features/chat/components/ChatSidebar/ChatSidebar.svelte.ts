/**
 * Chat Sidebar Component Logic
 * 
 * This file contains the business logic for the ChatSidebar component,
 * using Svelte 5 runes for state management.
 */
import type { Chat } from '../../types';
import { goto } from '$app/navigation';

/**
 * Creates the logic for the ChatSidebar component
 */
export function createChatSidebarLogic(
  chats: Chat[],
  activeChatId: string | null,
  onCreateChat: () => string,
  onDeleteChat: (id: string) => boolean,
  onSelectChat: (id: string) => boolean
) {
  // State
  let isCreatingChat = $state(false);
  let showConfirmDelete = $state<string | null>(null);
  let searchQuery = $state('');
  
  // Derived values
  const filteredChats = $derived.by(() => {
    if (!searchQuery.trim()) return chats;
    
    const query = searchQuery.toLowerCase().trim();
    return chats.filter(chat => {
      const nameMatch = chat.name.toLowerCase().includes(query);
      const companyMatch = chat.company?.toLowerCase().includes(query) || false;
      return nameMatch || companyMatch;
    });
  });
  
  /**
   * Handle chat creation
   */
  function handleCreateChat() {
    isCreatingChat = true;
    const newChatId = onCreateChat();
    isCreatingChat = false;
    
    // Navigate to the new chat
    goto(`/chats/${newChatId}`);
  }
  
  /**
   * Show delete confirmation for a chat
   */
  function confirmDelete(chatId: string, event: Event) {
    // Prevent triggering chat selection
    event.stopPropagation();
    showConfirmDelete = chatId;
  }
  
  /**
   * Cancel delete confirmation
   */
  function cancelDelete(event: Event) {
    event.stopPropagation();
    showConfirmDelete = null;
  }
  
  /**
   * Handle chat deletion
   */
  function handleDeleteChat(chatId: string, event: Event) {
    event.stopPropagation();
    
    const success = onDeleteChat(chatId);
    showConfirmDelete = null;
    
    return success;
  }
  
  /**
   * Handle chat selection
   */
  function handleSelectChat(chatId: string) {
    if (chatId === activeChatId) return true;
    
    const success = onSelectChat(chatId);
    
    if (success) {
      // Navigate to the selected chat
      goto(`/chats/${chatId}`);
    }
    
    return success;
  }
  
  /**
   * Clear search query
   */
  function clearSearch() {
    searchQuery = '';
  }
  
  return {
    // State
    isCreatingChat,
    showConfirmDelete,
    searchQuery,
    
    // Derived
    filteredChats,
    
    // Methods
    handleCreateChat,
    confirmDelete,
    cancelDelete,
    handleDeleteChat,
    handleSelectChat,
    clearSearch
  };
}