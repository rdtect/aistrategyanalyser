<script lang="ts">
  import type { Message } from '$lib/types';
  import { marked } from 'marked';
  import { slide } from 'svelte/transition';
  import { sineIn } from 'svelte/easing';
  import IconUser from '@lucide/svelte/icons/user';
  import IconBrain from '@lucide/svelte/icons/brain';
  import { Avatar } from '@skeletonlabs/skeleton-svelte';

  let { message } = $props<{
    message: Message;
  }>();

  // Ensure content is always a string before passing to marked
  const safeContent = $derived(message.content || ''); 

  // Compute message type
  const isUserMessage = $derived(message.role === 'user');
  const isAiMessage = $derived(message.role === 'assistant');
  const isSystemMessage = $derived(message.role === 'system');
  
  // Format timestamp (more robust check)
  function formatTime(timestamp: string | undefined): string {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleString('en-US', {
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return ''; // Handle invalid date strings
    }
  }
  
  // Formatted HTML content
  const formattedContent = $derived(marked(safeContent)); 
</script>

{#if isUserMessage}
  <!-- User Message (Right Aligned) -->
  <div class="grid grid-cols-[1fr_auto] gap-2 mb-4" transition:slide|local={{ duration: 300, easing: sineIn }}>
    <div class="card p-4 rounded-tr-none space-y-2 preset-tonal-primary">
      <header class="flex justify-between items-center">
        <p class="font-bold">You</p>
        <small class="opacity-50">{formatTime(message.timestamp)}</small>
      </header>
      <div class="message-content prose prose-sm dark:prose-invert max-w-none break-words">
        {@html formattedContent}
      </div>
    </div>
    <div class="flex items-start">
       <!-- User Avatar Wrapper -->
       <div class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-primary-500/20 text-primary-700 dark:text-primary-300">
         <Avatar name="User">
           <IconUser size="24" />
         </Avatar>
       </div>
    </div>
  </div>
{:else if isAiMessage}
  <!-- AI Message (Left Aligned) -->
  <div class="grid grid-cols-[auto_1fr] gap-2 mb-4" transition:slide|local={{ duration: 300, easing: sineIn }}>
     <div class="flex items-start">
       <!-- AI Avatar Wrapper -->
       <div class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-tertiary-500/20 text-tertiary-700 dark:text-tertiary-300">
         <Avatar name="Assistant">
           <IconBrain size="24" />
         </Avatar>
       </div>
    </div>
    <div class="card p-4 rounded-tl-none space-y-2 preset-tonal">
      <header class="flex justify-between items-center">
        <p class="font-bold">Assistant</p>
        <small class="opacity-50">{formatTime(message.timestamp)}</small>
      </header>
      <div class="message-content prose prose-sm dark:prose-invert max-w-none break-words">
        {@html formattedContent}
      </div>
    </div>
  </div>
{:else if isSystemMessage}
  <!-- System Message (Centered) -->
  <div class="flex justify-center mb-4 text-center" transition:slide|local={{ duration: 300, easing: sineIn }}>
    <div class="message-content prose prose-xs dark:prose-invert text-surface-500 italic break-words">
       {@html formattedContent}
    </div>
  </div>
{/if}

<style>
  .message-content {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }
  :global(.prose) {
    max-width: none; 
  }
  /* Ensure card takes available space but respects grid */
  .card {
    min-width: 0; 
  }
</style> 