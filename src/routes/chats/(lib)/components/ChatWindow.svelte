<script lang="ts">
  import { chatManager } from '../ChatManager.svelte.ts';
  import type { Message, Chat } from '$lib/types';
  import ChatMessage from './ChatMessage.svelte';
  let messageInput = $state("");
  let messagesEndRef = $state<HTMLDivElement | null>(null);
  let chatMessagesContainer = $state<HTMLDivElement | null>(null);

  async function handleSend(event: SubmitEvent) {
    event.preventDefault();
    if (!messageInput.trim()) return;
    await chatManager.sendMessage(messageInput);
    messageInput = "";
  }

  $effect(() => {
    // Scroll to bottom when messages change
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  });
</script>

<section class="flex flex-col min-h-[90vh] max-h-[90vh] h-[90vh]">
  {#if chatManager.activeChat}
    <div class="flex-1 overflow-y-auto p-4 space-y-2" data-testid="chat-messages" bind:this={chatMessagesContainer}>
      {#if chatManager.activeChat.messages?.length}
        {#each chatManager.activeChat.messages as msg (msg.id || msg.index)}
          <ChatMessage message={msg} />
        {/each}
      {:else}
        <div class="text-surface-400 italic">No messages found for this chat.</div>
      {/if}
      {#if chatManager.isStreaming}
        <div class="rounded px-3 py-2 glass-primary animate-pulse">
          <span class="block text-xs font-semibold mb-1">AI</span>
          <span>{chatManager.streamingContent || '...typing'}</span>
        </div>
      {/if}
      <div bind:this={messagesEndRef}></div>
    </div>
    <form class="flex gap-2 mt-2" onsubmit={handleSend}>
      <input
        class="flex-1 rounded px-3 py-2 bg-surface-800 text-white placeholder:text-surface-400 focus:bg-surface-900 focus:text-primary-100 focus:outline-none"
        placeholder="Type your message..."
        bind:value={messageInput}
        autocomplete="off"
        aria-label="Message input"
      />
      <button class="btn btn-primary" type="submit" disabled={chatManager.isStreaming || !messageInput.trim()}>
        Send
      </button>
    </form>
  {:else}
    <div class="flex-1 flex items-center justify-center text-surface-400">
      <span>Select a chat to start messaging.</span>
    </div>
  {/if}
</section>
