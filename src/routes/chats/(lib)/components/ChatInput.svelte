<script lang="ts">
  import IconSend from "@lucide/svelte/icons/send";
  import IconInfo from "@lucide/svelte/icons/info";
  import IconPaperclip from "@lucide/svelte/icons/paperclip";

  let {
    onSend,
    disabled = false,
    maxLength = 4000,
  } = $props<{
    onSend: (content: string) => Promise<void>;
    disabled?: boolean;
    maxLength?: number;
  }>();

  // State
  let content = $state("");
  let isSubmitting = $state(false);
  let textareaElement = $state<HTMLTextAreaElement | null>(null);
  let showTips = $state(false);

  // Auto-resize textarea as content changes
  $effect(() => {
    if (textareaElement) {
      // Reset height to get the correct scrollHeight
      textareaElement.style.height = "auto";

      // Set to scrollHeight to fit content (min 40px, max 200px)
      const newHeight = Math.min(
        200,
        Math.max(40, textareaElement.scrollHeight),
      );
      textareaElement.style.height = `${newHeight}px`;
    }
  });

  async function handleSubmit() {
    if (!content.trim() || isSubmitting || disabled) return;

    isSubmitting = true;
    try {
      await onSend(content.trim());
      content = "";

      // Reset height after sending
      if (textareaElement) {
        textareaElement.style.height = "auto";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      isSubmitting = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function toggleTips() {
    showTips = !showTips;
  }
</script>

<div class="border-t border-surface-500/20 p-4 glass-surface">
  <div class="flex items-end gap-2">
    <div class="hidden md:flex items-center">
      <button class="p-2 rounded-lg hover:bg-surface-700 transition-colors" aria-label="Attach file">
        <IconPaperclip size={20} />
      </button>
    </div>
    <div class="relative flex-1">
      <textarea
        bind:value={content}
        bind:this={textareaElement}
        placeholder="Type your message..."
        rows="1"
        disabled={disabled || isSubmitting}
        onkeydown={handleKeydown}
        class="w-full rounded-lg px-4 py-2 bg-surface-800 text-white placeholder:text-surface-400 focus:bg-surface-900 focus:text-primary-100 focus:outline-none resize-none shadow-md border border-surface-700 transition-colors min-h-[40px] max-h-[200px]"
        style="transition: box-shadow 0.2s, background 0.2s;"
        autocomplete="off"
        aria-label="Message input"
      ></textarea>
      <div class="absolute right-2 bottom-2 flex gap-1">
        <button
          type="button"
          class="p-1 rounded hover:bg-surface-700 text-surface-400 hover:text-primary-400 focus:outline-none"
          onclick={toggleTips}
          aria-label="Show tips"
        >
          <IconInfo size={16} />
        </button>
      </div>
    </div>
    <button
      class="btn btn-primary flex items-center gap-1 px-4 py-2 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
      onclick={handleSubmit}
      disabled={isSubmitting || disabled || !content.trim()}
      aria-label="Send message"
    >
      <IconSend size={18} />
      <span class="hidden md:inline">Send</span>
    </button>
  </div>
  {#if showTips}
    <div class="mt-2 text-xs bg-surface-900 text-primary-100 rounded-lg px-3 py-2 shadow-lg border border-surface-700 animate-fade-in">
      <b>Tips:</b> Shift+Enter for newline. <br />Markdown supported. <br />Use <kbd>/</kbd> for quick commands.
    </div>
  {/if}
</div>
