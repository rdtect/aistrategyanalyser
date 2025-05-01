<script lang="ts">
  import IconSend from "@lucide/svelte/icons/send";
  import IconInfo from "@lucide/svelte/icons/info";
  import IconPaperclip from "@lucide/svelte/icons/paperclip";
  import { chatManager } from '../ChatManager.svelte.ts';
  import type { Message, Chat } from '$lib/types';

  let input = $state("");
  let textareaElement: HTMLTextAreaElement | null = null;
  let showTips = $state(false);

  $effect(() => {
    void showTips;
  });

  function getActiveChat(): Chat | null {
    return chatManager.activeChat;
  }

  async function sendMessage() {
    const chat: Chat | null = getActiveChat();
    if (!input.trim() || !chat || chatManager.isStreaming) return;
    await chatManager.sendMessage(input.trim());
    input = "";
    if (textareaElement) textareaElement.style.height = "auto";
  }

  async function handleSend(e: SubmitEvent) {
    e.preventDefault();
    await sendMessage();
  }

  function handleKeydown(e: KeyboardEvent) {
    // Fix for textarea: only submit on Enter if not composing (IME) and no modifier keys
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey && !e.isComposing) {
      e.preventDefault();
      sendMessage();
    }
  }

  function toggleTips() {
    showTips = !showTips;
  }
</script>

<div class="border-t border-surface-500/20 p-4 glass-surface">
  <form class="flex items-end gap-2" onsubmit={handleSend}>
    <div class="hidden md:flex items-center">
      <button class="p-2 rounded-lg hover:bg-surface-700 transition-colors" aria-label="Attach file">
        <IconPaperclip size={20} />
      </button>
    </div>
    <div class="relative flex-1">
      <textarea
        bind:value={input}
        bind:this={textareaElement}
        placeholder="Type your message..."
        rows="2"
        disabled={chatManager.isStreaming}
        onkeydown={handleKeydown}
        class="w-full rounded-lg px-4 py-2 bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500 focus:bg-white dark:focus:bg-surface-900 focus:text-primary-800 dark:focus:text-primary-100 focus:outline-none resize-none shadow-md border border-surface-300 dark:border-surface-700 transition-colors h-[56px]"
        style="transition: box-shadow 0.2s, background 0.2s;"
        autocomplete="off"
        aria-label="Message input"
      ></textarea>
      <div class="absolute right-2 bottom-2 flex gap-1">
        <button
          type="button"
          class="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none"
          onclick={toggleTips}
          aria-label="Show tips"
        >
          <IconInfo size={16} />
        </button>
      </div>
    </div>
    <button
      class="btn btn-surface flex items-center gap-1 px-4 py-2 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      type="submit"
      disabled={chatManager.isStreaming || !input.trim()}
      aria-label="Send message"
    >
      <IconSend size={18} />
      <span class="sr-only">Send</span>
    </button>
  </form>
  {#if showTips}
    <div class="mt-2 p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-xs text-surface-700 dark:text-surface-300 shadow border border-surface-200 dark:border-surface-700">
      <b>Tip:</b> Press <kbd>Enter</kbd> to send. (No multiline input)
    </div>
  {/if}
</div>

<style>
  textarea:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .btn-surface {
    background: var(--color-surface-200);
    color: var(--color-surface-900);
    border: 1px solid var(--color-surface-400);
    transition: background 0.2s, color 0.2s;
  }
  .btn-surface:hover:not(:disabled) {
    background: var(--color-surface-300);
    color: var(--color-primary-700);
  }
  .btn-surface:disabled {
    background: var(--color-surface-100);
    color: var(--color-surface-400);
    cursor: not-allowed;
  }
  @media (max-width: 640px) {
    .px-4 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  }
</style>
