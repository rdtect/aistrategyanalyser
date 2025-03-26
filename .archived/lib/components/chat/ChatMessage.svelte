<script lang="ts">
  import type { Message } from '$lib/types/chat';
  import { marked } from 'marked';
  
  // Define the expected props
  let { message } = $props<{
    message: Message;
  }>();
  
  // Use an object for state that needs to be modified
  const contentState = $state({
    formatted: ''
  });
  
  // Update formatted content whenever message changes
  $effect(() => {
    updateFormattedContent(message.content);
  });
  
  // Function to update formatted content
  async function updateFormattedContent(content: string) {
    if (!content || !content.trim()) {
      contentState.formatted = '';
      return;
    }
    
    try {
      // Parse markdown and update content
      const parsed = await marked.parse(content);
      contentState.formatted = parsed;
    } catch (e) {
      console.error('Error parsing markdown:', e);
      contentState.formatted = content;
    }
  }
  
  // Compute message classes
  const messageClass = $derived.by(() => {
    const senderClass = message.sender === 'user' ? 'user-message' : 'ai-message';
    const statusClass = message.status || '';
    return `message ${senderClass} ${statusClass}`;
  });
</script>

<div class={messageClass}>
  <div class="message-content {message.sender === 'user' ? 'bg-primary-800/20' : 'bg-surface-800/20'}">
    {#if message.sender === 'system'}
      <div class="system-message bg-surface-700/30">
        {message.content}
      </div>
    {:else}
      <div class="sender">{message.sender === 'user' ? 'You' : 'AI'}</div>
      <div class="content">
        {@html contentState.formatted}
      </div>
      <div class="timestamp text-surface-400">{new Date(message.timestamp).toLocaleTimeString()}</div>
    {/if}
  </div>
</div>

<style>
  .message {
    margin-bottom: 16px;
  }
  
  .user-message {
    display: flex;
    justify-content: flex-end;
  }
  
  .ai-message {
    display: flex;
    justify-content: flex-start;
  }
  
  .system-message {
    background-color: rgba(82, 82, 91, 0.3);
    color: #666;
    padding: 8px;
    border-radius: 4px;
    text-align: center;
    font-style: italic;
  }
  
  .message-content {
    max-width: 80%;
    padding: 10px;
    border-radius: 8px;
  }
  
  .streaming .message-content {
    border: 1px solid #ccc;
  }
  
  .error .message-content {
    background-color: rgba(127, 29, 29, 0.2);
    color: #f87171;
  }
  
  .sender {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .timestamp {
    font-size: 0.8em;
    color: #94a3b8;
    text-align: right;
    margin-top: 4px;
  }
</style> 