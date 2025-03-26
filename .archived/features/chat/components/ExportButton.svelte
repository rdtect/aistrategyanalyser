<!-- Export Button Component for Chat -->
<script lang="ts">
  import { getChatStore } from "$lib/features/chat/stores";
  import type { Chat, ChatMessage, Source } from "$lib/features/chat/types/chat";

  let { chatId } = $props<{ chatId?: string }>();

  // Initialize chat store
  const chatStore = getChatStore();
  let storeState = $state<{chats: Record<string, Chat>, activeChat: string | null}>({chats: {}, activeChat: null});
  
  // Subscribe to store updates
  $effect(() => {
    const unsubscribe = chatStore.subscribe((state) => {
      storeState = state || {chats: {}, activeChat: null};
    });
    
    return unsubscribe;
  });

  // Get current chat ID if none provided
  const currentChatId = $derived(chatId || storeState.activeChat);

  let isExporting = $state(false);

  async function exportChat() {
    try {
      isExporting = true;
      
      // Simply access the current chat from the store's state
      // First check if we have a specific chatId provided
      let activeChat = null;
      
      if (currentChatId) {
        // Get chat from store if it exists there
        activeChat = storeState.chats[currentChatId];
      } else if (storeState.activeChat) {
        // Use the current active chat in the store
        activeChat = storeState.chats[storeState.activeChat];
      }
      
      if (!activeChat) {
        console.error('No chat selected to export');
        return;
      }
      
      // Generate markdown export
      const markdown = generateMarkdownExport(activeChat);
      
      // Create a blob and download link
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      
      // Create and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeChat.name || 'chat'}-export.md`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export chat:', error);
      // Handle error appropriately
    } finally {
      isExporting = false;
    }
  }

  // Helper function to generate markdown export
  function generateMarkdownExport(chat: Chat) {
    if (!chat) return '';
    
    // Generate markdown
    let markdown = `# ${chat.name || 'Untitled Chat'}\n\n`;
    
    // Add context if available
    if (chat.context) {
      markdown += `## Context\n`;
      if (chat.context.company) markdown += `- Company: ${chat.context.company}\n`;
      if (chat.context.industry) markdown += `- Industry: ${chat.context.industry}\n`;
      if (chat.context.region) markdown += `- Region: ${chat.context.region}\n`;
      if (chat.context.additionalInfo) markdown += `\n${chat.context.additionalInfo}\n`;
      markdown += '\n';
    }
    
    // Add messages
    markdown += `## Conversation\n\n`;
    
    if (chat.messages && chat.messages.length > 0) {
      chat.messages.forEach((msg: ChatMessage) => {
        const sender = msg.sender === 'user' ? 'User' : (msg.sender === 'ai' ? 'AI' : 'System');
        const timestamp = new Date(msg.timestamp).toLocaleString();
        
        markdown += `### ${sender} (${timestamp})\n\n${msg.content}\n\n`;
        
        // Add sources if available
        if (msg.sources && msg.sources.length > 0) {
          markdown += `Sources:\n`;
          msg.sources.forEach((source: Source) => {
            markdown += `- [${source.title}](${source.url || '#'})\n`;
          });
          markdown += '\n';
        }
      });
    } else {
      markdown += `No messages in this conversation yet.\n\n`;
    }
    
    return markdown;
  }
</script>

<button 
  class="btn variant-filled-surface" 
  onclick={exportChat}
  disabled={!currentChatId}
>
  {#if isExporting}
    Exporting...
  {:else}
    Export
  {/if}
</button> 