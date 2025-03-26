<!--
  Chat Input Component
  
  Input field for typing and sending chat messages.
-->
<script module>
// This makes the Tailwind parser happy
const __CHAT_INPUT_DEFAULT__ = "default";
// Note: We can't use export default in a Svelte component
</script>

<script lang="ts">
  import { createChatInputLogic } from './ChatInput.svelte.ts';
  
  // Props using Svelte 5 runes
  let { 
    onSend, 
    placeholder = 'Type your message...', 
    disabled = false,
    initialValue = ''
  } = $props<{
    onSend: (content: string) => void;
    placeholder?: string;
    disabled?: boolean;
    initialValue?: string;
  }>();
  
  // Initialize chat input logic - use a more explicit approach to avoid Tailwind issues
  // @ts-ignore - Workaround for Tailwind parser
  const inputLogic = createChatInputLogic();
  
  // Local state that's safe for Tailwind
  let content = $state(initialValue || '');
  let isSubmitting = $state(false);
  let isFocused = $state(false);
  
  // Set initial value if provided
  if (initialValue) {
    inputLogic.setContent(initialValue);
    content = initialValue;
  }
  
  // Keep content in sync with the logic
  $effect(() => {
    content = inputLogic.content;
  });
  
  // Compute if we can send a message
  const canSend = $derived(content.trim().length > 0 && !isSubmitting && !disabled);
  
  // Update state when logic changes
  $effect(() => {
    isSubmitting = inputLogic.isSubmitting;
  });
  
  // Handle sending the message
  function handleSend() {
    if (!canSend) return;
    
    onSend(content);
    inputLogic.setContent('');
    content = '';
  }
  
  // Handle input changes
  function handleInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    content = textarea.value;
    inputLogic.setContent(textarea.value);
  }
  
  // Handle keyboard events
  function handleKeyDown(e: KeyboardEvent) {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }
  
  // Focus and blur handlers
  function handleFocus() {
    isFocused = true;
  }
  
  function handleBlur() {
    isFocused = false;
  }
  
  // IME composition event handlers for better internationalization support
  let isComposing = $state(false);
  
  function handleCompositionStart() {
    isComposing = true;
  }
  
  function handleCompositionEnd() {
    isComposing = false;
  }
</script>

<div class=" bottom-0 w-full border-t border-surface-700 bg-surface-900/50 p-1 sticky backdrop-blur-sm ">
  <div class="flex items-center gap-2 bg-surface-800/50 border rounded-lg p-2 transition-all duration-200
              {isFocused 
                ? 'border-primary-500/50 shadow-[0_0_0_2px_rgba(var(--color-primary-500-rgb),0.2)]' 
                : 'border-surface-700'}">
    <div class="flex items-center gap-1 px-2">
      <button 
        class="p-2 text-surface-400 hover:text-primary-400 rounded-full transition-colors"
        aria-label="Add attachment"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
      <button 
        class="p-2 text-surface-400 hover:text-primary-400 rounded-full transition-colors"
        aria-label="Suggested prompts"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand"><path d="M15 4V2"></path><path d="M15 16v-2"></path><path d="M8 9h2"></path><path d="M20 9h2"></path><path d="M17.8 11.8 19 13"></path><path d="M15 9a3 3 0 1 0-3 3h-2"></path><path d="M17.5 8a2.5 2.5 0 1 0-5 0v0a2.5 2.5 0 1 0 5 0Z"></path><path d="M8.5 16.5a1.5 1.5 0 0 0 3 0v-1a1.5 1.5 0 0 0-3 0Z"></path><path d="M14 19.5a1.5 1.5 0 0 0 3 0v-1a1.5 1.5 0 0 0-3 0Z"></path><path d="M8.5 13a1.5 1.5 0 0 0 3 0v-1a1.5 1.5 0 0 0-3 0Z"></path></svg>
      </button>
    </div>

    <textarea
      value={content}
      oninput={handleInput}
      {placeholder}
      disabled={disabled}
      onkeydown={handleKeyDown}
      onfocus={handleFocus}
      onblur={handleBlur}
      oncompositionstart={handleCompositionStart}
      oncompositionend={handleCompositionEnd}
      rows="1"
      class="flex-1 py-3 px-3 bg-transparent border-none resize-none text-base leading-normal max-h-[150px] min-h-[24px] focus:outline-none text-surface-50
             {disabled ? 'opacity-70 cursor-not-allowed bg-surface-800' : ''}"
    ></textarea>
    
    <button 
      onclick={handleSend}
      disabled={!canSend || disabled}
      class="flex items-center justify-center rounded-full w-10 h-10 flex-shrink-0 transition-colors
             {!canSend || disabled
               ? 'bg-surface-700 text-surface-400 cursor-not-allowed'
               : 'bg-primary-600 text-white hover:bg-primary-500'}"
      title="Send message"
      aria-label="Send message"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
    </button>
  </div>
</div>