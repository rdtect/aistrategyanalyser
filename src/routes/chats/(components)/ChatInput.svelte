<script lang="ts">
  import IconSend from '@lucide/svelte/icons/send';
  import IconInfo from '@lucide/svelte/icons/info';
  import IconPaperclip from '@lucide/svelte/icons/paperclip';
  import { onMount } from 'svelte';
  
  let { onSend, disabled = false, maxLength = 4000 } = $props<{
    onSend: (content: string) => Promise<void>;
    disabled?: boolean;
    maxLength?: number;
  }>();

  // State
  let content = $state('');
  let isSubmitting = $state(false);
  let textareaElement = $state<HTMLTextAreaElement | null>(null);
  let showTips = $state(false);

  // Auto-resize textarea as content changes
  $effect(() => {
    if (textareaElement) {
      // Reset height to get the correct scrollHeight
      textareaElement.style.height = 'auto';
      
      // Set to scrollHeight to fit content (min 40px, max 200px)
      const newHeight = Math.min(200, Math.max(40, textareaElement.scrollHeight));
      textareaElement.style.height = `${newHeight}px`;
    }
  });

  async function handleSubmit() {
    if (!content.trim() || isSubmitting || disabled) return;
    
    isSubmitting = true;
    try {
      await onSend(content.trim());
      content = '';
      
      // Reset height after sending
      if (textareaElement) {
        textareaElement.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      isSubmitting = false;
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
  
  function toggleTips() {
    showTips = !showTips;
  }
</script>

<div class="border-t border-surface-500/20 p-4 bg-surface-100-800-token/30">
  <div>
    <div class="input-group grid-cols-[auto_1fr_auto] rounded-container-token">
      <div class="ig-cell preset-tonal">
        <IconPaperclip size={18} />
      </div>
      
      <textarea
        bind:value={content}
        bind:this={textareaElement}
        placeholder="Type your message..."
        rows="1"
        disabled={disabled || isSubmitting}
        onkeydown={handleKeydown}
        maxlength={maxLength}
        class="ig-input bg-transparent resize-none overflow-hidden"
      ></textarea>
      
      <button
        type="button"
        disabled={disabled || isSubmitting || !content.trim()}
        onclick={handleSubmit}
        class="ig-btn {disabled || isSubmitting || !content.trim() ? 'preset-tonal' : 'preset-filled-primary'}"
        aria-label="Send message"
        data-tooltip="Send message (Enter)"
      >
        {#if isSubmitting}
          <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        {:else}
          <IconSend size={20} />
        {/if}
      </button>
    </div>
    
    <div class="flex justify-between items-center mt-2">
      <button 
        type="button" 
        class="text-xs flex items-center gap-1 text-surface-500 hover:text-primary-500" 
        onclick={toggleTips}
      >
        <IconInfo size={14} />
        <span>Tips</span>
      </button>
      
      {#if content.length > maxLength * 0.7}
        <div class="text-xs {content.length > maxLength * 0.9 ? 'text-warning-500' : 'text-surface-500'}">
          {content.length}/{maxLength}
        </div>
      {/if}
    </div>
    
    {#if showTips}
      <div class="mt-2 p-3 bg-surface-500/10 rounded-container-token text-xs text-surface-500">
        <ul class="list-disc list-inside space-y-1">
          <li>Press <kbd class="kbd kbd-xs">Enter</kbd> to send</li>
          <li>Press <kbd class="kbd kbd-xs">Shift+Enter</kbd> for a new line</li>
          <li>Be specific about your business strategy questions</li>
          <li>You can provide context about your industry or company for more tailored analysis</li>
        </ul>
      </div>
    {/if}
  </div>
</div> 