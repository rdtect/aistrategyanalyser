<script lang="ts">
  import { page } from "$app/state";
  import { chatManager } from "../(lib)/ChatManager.svelte.ts";
  import ChatWindow from "../(lib)/components/ChatWindow.svelte";

  let { data } = $props();

  // Svelte 5 runes: use $derived for reactivity
  const isLoading = $derived(chatManager.isLoading);
  const chatInitError = $derived(chatManager.error);
  const hasActiveChat = $derived(() => !!chatManager.activeChat);

  // Effect to set the active chat based on the URL parameter
  $effect(() => {
    const currentChatIdFromUrl = page.params.id;
    const currentActiveChatIdFromState = chatManager.activeChatId;
    console.log(
      `[id]/+page $effect: URL ID=${currentChatIdFromUrl}, State ID=${currentActiveChatIdFromState}`,
    );
    if (
      currentChatIdFromUrl &&
      currentChatIdFromUrl !== currentActiveChatIdFromState
    ) {
      console.log(
        `[id]/+page.svelte: Triggering selectChat for ${currentChatIdFromUrl}`,
      );
      chatManager.selectChat(currentChatIdFromUrl);
    }
  });
</script>

<!-- Use local state for conditional rendering -->
{#if isLoading}
  <div class="p-4 text-center text-surface-400">Loading chat...</div>
{:else if chatInitError}
  <div class="p-4 text-center text-error-400">{chatInitError}</div>
{:else if hasActiveChat()}
  <ChatWindow />
{:else}
  <div class="p-4 text-center text-surface-500">
    {#if page.params.id}
      Chat {page.params.id} not found or loading...
    {:else}
      No chat selected.
    {/if}
  </div>
{/if}
