<script lang="ts">
  import { sampleChats } from "$lib/data/sampleChats";
  import type { Chat as ChatType } from "$lib/types/chat";
  import { goto } from "$app/navigation";

  // Convert sample chats to match the expected type format
  function convertSampleChats(chats: typeof sampleChats): ChatType[] {
    return chats.map((chat) => ({
      id: String(chat.id),
      name: chat.name,
      company: chat.company,
      industry: chat.industry,
      region: chat.region,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.createdAt),
      messages: chat.messages.map((msg) => ({
        id: String(msg.id),
        content: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp),
        status: "sent" as const,
        sources: [],
      })),
    }));
  }

  // Convert the sample data
  const typedChats = convertSampleChats(sampleChats);

  // Navigate to individual chat page
  function goToChat(chatId: string) {
    goto(`/chats/${chatId}`);
  }

  // Handle keyboard navigation
  function handleKeydown(event: KeyboardEvent, chatId: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToChat(chatId);
    }
  }
</script>

<div class="container mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">AI Strategy Bot</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each typedChats as chat}
      <button
        aria-label={`Chat ${chat.name}`}
        class="text-left outline-1 bg-primary-800/20 rounded-lg p-4 hover:outline-primary-500 hover:shadow-lg transition-shadow cursor-pointer border-0"
        onclick={() => goToChat(chat.id)}
        onkeydown={(e) => handleKeydown(e, chat.id)}
      >
        <h2 class="text-xl font-semibold mb-2">{chat.name}</h2>
        <div class="text-sm text-surface-200 space-y-1">
          {#if chat.company}
            <div><span class="font-medium">Company:</span> {chat.company}</div>
          {/if}
          {#if chat.industry}
            <div>
              <span class="font-medium">Industry:</span>
              {chat.industry}
            </div>
          {/if}
          {#if chat.region}
            <div><span class="font-medium">Region:</span> {chat.region}</div>
          {/if}
        </div>
        <div class="mt-4 text-xs text-surface-400">
          Created: {chat.createdAt.toLocaleDateString()}
        </div>
      </button>
    {/each}
  </div>

  <div class="mt-8 text-center">
    <a
      href="/chats/new"
      class="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
    >
      Create New Analysis
    </a>
  </div>
</div>
