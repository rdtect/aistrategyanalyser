<!--
  Chat Message Component
  
  Displays a single chat message with appropriate styling based on sender.
-->
<script lang="ts">
  import { createChatMessageLogic } from './ChatMessage.svelte.ts';
  import type { ChatMessage } from '../../types/chat';
  import { marked } from 'marked';
  import { createEventDispatcher } from 'svelte';
  
  // Event dispatcher for message actions
  const dispatch = createEventDispatcher<{
    regenerate: { messageId: string, previousUserMessageId: string | null };
  }>();
  
  // Props using Svelte 5 runes
  let { message, previousUserMessageId = null } = $props<{ 
    message: ChatMessage;
    previousUserMessageId?: string | null;
  }>();
  
  // Create message logic
  const messageLogic = createChatMessageLogic(message);
  
  // Format the timestamp for display
  function formatTimestamp(timestamp: string | number): string {
    if (!timestamp) return '';
    const date = typeof timestamp === 'string' 
      ? new Date(timestamp) 
      : new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
  
  // Process the content for markdown
  function processContent(content: string, sender: string): string {
    if (sender === 'user') return content;
    // Use marked to parse markdown for AI and system messages
    try {
      // marked.parse can return either a string or a Promise<string>
      // Handle synchronously to avoid the Promise being displayed
      const result = marked.parse(content);
      // If it's a Promise, just return the raw content for now
      if (result instanceof Promise) {
        console.warn('Marked returned a Promise, using raw content instead');
        return content;
      }
      return result;
    } catch (e) {
      console.error('Error parsing markdown:', e);
      return content;
    }
  }
  
  // Handle regenerate button click
  function handleRegenerate() {
    dispatch('regenerate', { 
      messageId: message.id,
      previousUserMessageId
    });
  }
  
  // Local state for hover effects
  let isHovered = $state(false);
</script>

<!-- Message Container with class based positioning -->
<div 
  class="flex {message.sender === 'user' ? 'justify-end' : message.sender === 'ai' ? 'justify-start' : 'justify-center'} mb-4 mx-2 px-2"
  onmouseenter={() => isHovered = true}
  onmouseleave={() => isHovered = false}
>
  <div class="max-w-[95%] rounded-lg relative 
              {message.sender === 'user' 
                ? 'bg-primary-800/20 text-surface-50 min-w-[20%]' 
                : message.sender === 'ai'
                  ? message.status === 'regenerating' 
                    ? 'bg-primary-900/30 text-surface-50 border border-primary-700/30' 
                    : 'bg-surface-800/20 text-surface-50'
                  : 'bg-surface-700/30 text-surface-300 px-4 py-1 text-center italic'
              }
              {message.sender !== 'system' && 'p-2 backdrop-blur-sm'}"
  >
    <!-- Sender label for non-system messages -->
    {#if message.sender !== 'system'}
      <div class="text-[0.75 rem] font-medium mb-1 {message.sender === 'user' ? 'text-primary-300/50' : 'text-surface-300/50'}">
        {message.sender === 'user' ? 'You' : 'AI Assistant'}
      </div>
    {/if}
    
    <!-- Message Content -->
    <div class="mb-2">
      {#if message.sender === 'ai' || message.sender === 'system'}
        <div class="prose prose-invert prose-sm min-w-[2.5rem]">
          {@html processContent(message.content, message.sender)}
        </div>
      {:else}
        <div class="whitespace-pre-wrap prose prose-invert prose-sm min-w-[2.5rem]">
          {@html processContent(message.content, message.sender)}
        </div>
      {/if}
      
      <!-- Debug content - remove in production -->
      {#if import.meta.env.DEV && message.sender === 'ai' && message.content.includes('function')}
        <details class="mt-4 p-2 bg-red-900/30 border border-dashed border-red-600 rounded text-xs">
          <summary class="cursor-pointer font-bold text-red-400">Debug Info</summary>
          <pre class="mt-2 whitespace-pre-wrap break-all font-mono max-h-[200px] overflow-y-auto bg-surface-900 p-2 rounded text-red-300">{message.content}</pre>
        </details>
      {/if}
    </div>
    
    <!-- Message Footer with Actions -->
    {#if message.sender !== 'system'}
      <div class="flex justify-between items-center text-[0.75rem] text-surface-400">
        <!-- Message Actions -->
        {#if message.sender === 'ai' && isHovered}
          <div class="flex gap-2 transition-opacity duration-200 opacity-100">
            <button 
              onclick={handleRegenerate}
              class="text-surface-400 hover:text-primary-400 transition-colors flex items-center gap-1"
              title="Regenerate response"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
              <span>Regenerate</span>
            </button>
          </div>
        {:else}
          <div class="w-4"></div> <!-- Spacer -->
        {/if}
        
        <!-- Timestamp -->
        <span class="opacity-80">{formatTimestamp(message.timestamp)}</span>
      </div>
    {/if}
    
    <!-- Visual indicator for message type -->
    {#if message.sender === 'user'}
      <div class="absolute top-0 right-0 h-1 w-16 bg-primary-600/50 rounded-tr-lg"></div>
    {:else if message.sender === 'ai'}
      <div class="absolute top-0 left-0 h-1 w-16 bg-surface-400/50 rounded-tl-lg"></div>
    {/if}
  </div>
</div>