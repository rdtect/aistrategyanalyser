<script lang="ts">
  import type { Message, Chat } from '$lib/types';
  import ChatMessage from './ChatMessage.svelte';
  import { chatManager } from '../ChatManager.svelte.ts';

  let messageInput = $state("");
  let messagesEndRef: HTMLDivElement | null = $state(null);
  let chatMessagesContainer: HTMLDivElement | null = $state(null);

  $effect(() => {
    const chat = getChat();
    if (chatMessagesContainer && chat) {
      chatMessagesContainer.scrollTop = chatMessagesContainer?.scrollHeight ?? 0;
    }
  });

  function getChat(): Chat | null {
    // activeChat is a $derived property, not a function
    return chatManager.activeChat;
  }

  async function handleSendMessage() {
    const chat = getChat();
    if (!messageInput.trim() || !chat || chatManager.isStreaming) return;
    await chatManager.sendMessage(messageInput.trim());
    messageInput = "";
    if (chatMessagesContainer) chatMessagesContainer.style.height = "auto";
  }
</script>

<section class="flex flex-col min-h-[90vh] max-h-[90vh] h-[90vh]">
  {#if getChat()}
    <div class="flex-1 overflow-y-auto p-4 space-y-2" data-testid="chat-messages" bind:this={chatMessagesContainer}>
      {#if getChat()?.messages?.length}
        {#each getChat()?.messages ?? [] as msg (msg.id || msg.index)}
          <ChatMessage message={msg} />
        {/each}
      {:else}
        <div class="text-surface-500 text-center mt-6">No messages yet.</div>
      {/if}
      {#if chatManager.isStreaming}
        <div class="flex items-center gap-2 animate-pulse px-4 py-2">
          <span>{chatManager.streamingContent || '...typing'}</span>
        </div>
      {/if}
      <div bind:this={messagesEndRef}></div>
    </div>
    <form class="mt-2 flex gap-2" onsubmit={e => { e.preventDefault(); handleSendMessage(); }}>
      <textarea
        bind:value={messageInput}
        placeholder="Type your message..."
        class="flex-1 rounded-lg border px-3 py-2"
        rows="1"
        autocomplete="off"
        disabled={chatManager.isStreaming}
      ></textarea>
      <button class="btn btn-primary" type="submit" disabled={chatManager.isStreaming || !messageInput.trim()}>
        Send
      </button>
    </form>
  {:else}
    <div class="flex-1 flex flex-col items-center justify-center">
      <div class="text-surface-500 text-center">No chat selected.</div>
    </div>
  {/if}
</section>
