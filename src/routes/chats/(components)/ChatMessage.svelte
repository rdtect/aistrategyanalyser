<script lang="ts">
  import type { Message } from '../types';
  import { marked } from 'marked';
  import IconUser from '@lucide/svelte/icons/user';
  import IconBrain from '@lucide/svelte/icons/brain';
  import { Avatar } from '@skeletonlabs/skeleton-svelte';
  
  let { message } = $props<{
    message: Message;
  }>();

  // Compute message type
  const isUserMessage = $derived(message.sender === 'user');
  const isAiMessage = $derived(message.sender === 'ai');
  const isSystemMessage = $derived(message.sender === 'system');
  
  // Format timestamp
  function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  }
  
  // Determine avatar image and color based on sender
  const avatarInitial = $derived(() => {
    if (isUserMessage) return 'Y';
    if (isAiMessage) return 'A';
    return 'S';
  });
  
  const avatarColor = $derived(() => {
    if (isUserMessage) return 'preset-tonal-primary';
    if (isAiMessage) return 'preset-tonal-tertiary';
    return 'preset-tonal';
  });
</script>

{#if isUserMessage}
  <!-- User message (right-aligned) -->
  <div class="grid grid-cols-[1fr_auto] gap-2 mb-4">
    <div class="card p-4 rounded-tr-none space-y-2 preset-tonal-primary">
      <header class="flex justify-between items-center">
        <p class="font-bold">You</p>
        <small class="opacity-50">{formatTime(message.timestamp)}</small>
      </header>
      <div class="prose prose-sm dark:prose-invert max-w-none">
        {@html marked.parse(message.content)}
      </div>
    </div>
    
    <div class="avatar flex items-start">
      <div class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-primary-500/20 text-primary-700 dark:text-primary-300">
        <IconUser />
      </div>
    </div>
  </div>
{:else if isAiMessage}
  <!-- AI message (left-aligned) -->
  <div class="grid grid-cols-[auto_1fr] gap-2 mb-4">
    <div class="avatar flex items-start">
      <div class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-tertiary-500/20 text-tertiary-700 dark:text-tertiary-300">
        <IconBrain />
      </div>
    </div>
    
    <div class="card p-4 preset-tonal rounded-tl-none space-y-2">
      <header class="flex justify-between items-center">
        <p class="font-bold">AI Assistant</p>
        <small class="opacity-50">{formatTime(message.timestamp)}</small>
      </header>
      <div class="prose prose-sm dark:prose-invert max-w-none">
        {@html marked.parse(message.content)}
      </div>
    </div>
  </div>
{:else}
  <!-- System message (centered) -->
  <div class="flex justify-center mb-4">
    <div class="card p-3 max-w-[85%] bg-surface-500/10 border border-surface-500/20">
      <div class="text-sm text-center text-surface-500">
        {@html marked.parse(message.content)}
      </div>
    </div>
  </div>
{/if} 