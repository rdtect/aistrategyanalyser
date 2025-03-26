<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<script>
  import { onMount } from 'svelte';
  import { state, derived } from 'svelte';
  import type { ChatMessage } from '../types/chat';
  import { Avatar } from '$lib/components/ui/avatar';
  import { cn } from '$lib/utils';
  
  // Props
  export let message: ChatMessage;
  export let isLastMessage = false;
  
  // Local state using runes
  const isExpanded = state(false);
  const hasRendered = state(false);
  
  // Derived values
  const messageClasses = derived(() => {
    const baseClasses = "flex gap-3 p-4 rounded-lg";
    const userClasses = "bg-primary-100 dark:bg-primary-900 ml-auto";
    const aiClasses = "bg-secondary-100 dark:bg-secondary-900";
    const systemClasses = "bg-warning-100 dark:bg-warning-900 border border-warning-200 dark:border-warning-800";
    
    if (message.sender === 'user') {
      return cn(baseClasses, userClasses);
    } else if (message.sender === 'system') {
      return cn(baseClasses, systemClasses);
    } else {
      return cn(baseClasses, aiClasses);
    }
  });
  
  const avatarInitials = derived(() => {
    if (message.sender === 'user') return 'U';
    if (message.sender === 'system') return 'S';
    return 'AI';
  });
  
  const avatarClasses = derived(() => {
    const baseClasses = "h-10 w-10 text-white";
    const userClasses = "bg-primary-500";
    const aiClasses = "bg-secondary-500";
    const systemClasses = "bg-warning-500";
    
    if (message.sender === 'user') {
      return cn(baseClasses, userClasses);
    } else if (message.sender === 'system') {
      return cn(baseClasses, systemClasses);
    } else {
      return cn(baseClasses, aiClasses);
    }
  });
  
  const formattedTime = derived(() => {
    try {
      const date = new Date(message.timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  });
  
  // Methods
  function toggleExpand() {
    isExpanded.set(!isExpanded());
  }
  
  // Lifecycle
  onMount(() => {
    // Mark as rendered after a small delay to allow for animations
    setTimeout(() => {
      hasRendered.set(true);
    }, 100);
    
    // Auto-expand if this is the last message
    if (isLastMessage) {
      isExpanded.set(true);
    }
  });
</script>

<div 
  class={messageClasses()}
  class:opacity-40={message.status === 'error'}
  class:animate-pulse={message.status === 'thinking' || message.status === 'streaming'}
  class:slide-in-from-bottom-5={!hasRendered()}
  class:duration-300={!hasRendered()}
>
  <div class="flex-shrink-0">
    <Avatar.Root>
      <Avatar.Image src={message.sender === 'ai' ? '/images/ai-avatar.png' : undefined} alt={message.sender} />
      <Avatar.Fallback class={avatarClasses()}>{avatarInitials()}</Avatar.Fallback>
    </Avatar.Root>
  </div>
  
  <div class="flex-1 space-y-2">
    <div class="flex justify-between items-center">
      <div class="font-semibold capitalize">
        {message.sender === 'ai' ? 'AI Assistant' : message.sender}
      </div>
      <div class="text-xs text-muted-foreground">
        {formattedTime()}
      </div>
    </div>
    
    <div class="prose dark:prose-invert max-w-none">
      {#if message.status === 'thinking'}
        <div class="flex gap-1 items-center">
          <span>Thinking</span>
          <span class="animate-bounce delay-0">.</span>
          <span class="animate-bounce delay-100">.</span>
          <span class="animate-bounce delay-200">.</span>
        </div>
      {:else if message.content}
        <div class:line-clamp-3={!isExpanded() && message.content.length > 300}>
          {@html message.content}
        </div>
        
        {#if message.content.length > 300}
          <button 
            class="text-sm text-primary hover:underline mt-1"
            on:click={toggleExpand}
          >
            {isExpanded() ? 'Show less' : 'Show more'}
          </button>
        {/if}
      {/if}
    </div>
    
    {#if message.sources && message.sources.length > 0}
      <div class="mt-4 pt-2 border-t border-muted">
        <div class="text-sm font-medium mb-1">Sources:</div>
        <ul class="text-sm space-y-1">
          {#each message.sources as source}
            <li>
              {#if source.url}
                <a href={source.url} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
                  {source.title}
                </a>
              {:else}
                <span>{source.title}</span>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    
    {#if message.status === 'error'}
      <div class="text-sm text-destructive mt-2">
        Error: Failed to process message
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  /* Animation delays for the thinking dots */
  .delay-0 {
    animation-delay: 0ms;
  }
  
  .delay-100 {
    animation-delay: 100ms;
  }
  
  .delay-200 {
    animation-delay: 200ms;
  }
  
  /* Ensure proper markdown rendering */
  :global(.prose pre) {
    @apply bg-muted p-4 rounded-md overflow-x-auto;
  }
  
  :global(.prose code) {
    @apply bg-muted px-1 py-0.5 rounded text-sm;
  }
  
  :global(.prose h1, .prose h2, .prose h3, .prose h4) {
    @apply font-semibold mt-4 mb-2;
  }
  
  :global(.prose ul, .prose ol) {
    @apply my-2 pl-6;
  }
  
  :global(.prose p) {
    @apply my-2;
  }
  
  :global(.prose a) {
    @apply text-primary hover:underline;
  }
</style>