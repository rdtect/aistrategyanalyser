<script lang="ts">
  import { onMount } from 'svelte';
  import { chatStore } from '../stores/ChatStore';
  
  // Import UI components with correct paths
  import Button from '$lib/components/ui/Button.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import { cn } from '$lib/core/utils';
  
  // Props
  let { 
    chatId,
    placeholder = 'Type your message...',
    disabled = false,
    useStreaming = true
  } = $props<{
    chatId: string;
    placeholder?: string;
    disabled?: boolean;
    useStreaming?: boolean;
  }>();
  
  // Local state using runes
  let message = $state('');
  let isSubmitting = $state(false);
  let textareaRef = $state<HTMLTextAreaElement | null>(null);
  
  // Derived values
  const canSubmit = $derived(
    message.trim().length > 0 && !isSubmitting && !disabled
  );
  
  // Methods
  async function handleSubmit() {
    if (!canSubmit) return;
    
    try {
      isSubmitting = true;
      
      if (useStreaming) {
        await chatStore.streamMessage(chatId, message, (chunk) => {
          // Optional callback for handling streaming chunks
          // This could be used for analytics or other side effects
        });
      } else {
        await chatStore.sendMessage(chatId, message);
      }
      
      // Clear the input after successful submission
      message = '';
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      isSubmitting = false;
      
      // Focus the textarea after sending
      if (textareaRef) {
        textareaRef.focus();
      }
    }
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    // Submit on Enter (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
  
  // Auto-resize textarea as user types
  function autoResizeTextarea() {
    if (!textareaRef) return;
    
    // Reset height to auto to get the correct scrollHeight
    textareaRef.style.height = 'auto';
    
    // Set the height to the scrollHeight
    const newHeight = Math.min(textareaRef.scrollHeight, 200);
    textareaRef.style.height = `${newHeight}px`;
  }
  
  // Watch for message changes to auto-resize
  $effect(() => {
    if (message !== undefined) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(autoResizeTextarea, 0);
    }
  });
  
  // Lifecycle
  onMount(() => {
    // Focus the textarea on mount
    if (textareaRef) {
      textareaRef.focus();
    }
  });
</script>

<form 
  class="flex flex-col gap-2 bg-card p-4 rounded-lg border shadow-sm"
  onsubmit={handleSubmit}
>
  <div class="relative">
    <textarea
      bind:this={textareaRef}
      bind:value={message}
      placeholder={placeholder}
      disabled={disabled || isSubmitting}
      onkeydown={handleKeyDown}
      class={cn(
        "min-h-[60px] resize-none pr-12 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      rows="1"
    ></textarea>
    
    <Button
      type="submit"
      size="icon"
      class="absolute bottom-2 right-2"
      disabled={!canSubmit}
      aria-label="Send message"
    >
      {#if isSubmitting}
        <div class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send">
          <path d="m22 2-7 20-4-9-9-4Z"></path>
          <path d="M22 2 11 13"></path>
        </svg>
      {/if}
    </Button>
  </div>
  
  <div class="flex justify-between items-center text-xs text-muted-foreground">
    <div>
      Press <kbd class="px-1 py-0.5 bg-muted rounded">Enter</kbd> to send, <kbd class="px-1 py-0.5 bg-muted rounded">Shift+Enter</kbd> for new line
    </div>
    
    {#if useStreaming}
      <div class="flex items-center gap-1">
        <span class="h-2 w-2 rounded-full bg-success animate-pulse"></span>
        <span>Streaming enabled</span>
      </div>
    {/if}
  </div>
</form>