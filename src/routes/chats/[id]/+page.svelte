<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import ChatMessage from "$lib/components/chat/ChatMessage.svelte";
  import type { PageData } from "./$types";

  // Data from page load function
  let { data, form } = $props<{ data: PageData; form: any }>();

  // UI state
  let messageText = $state("");
  let isSubmitting = $state(false);
  let messagesContainer = $state<HTMLElement | null>(null);
  let streamingResponse = $state("");
  let isStreaming = $state(false);

  // Check for error status and redirect if needed
  $effect(() => {
    if (data?.status === 404 || data?.status === 500) {
      goto("/");
    }
  });

  // Auto-scroll when messages change or during streaming
  $effect(() => {
    if (messagesContainer && (data?.messages?.length > 0 || isStreaming)) {
      setTimeout(() => {
        messagesContainer?.scrollTo({
          top: messagesContainer?.scrollHeight || 0,
          behavior: "smooth",
        });
      }, 10);
    }
  });

  // Handle keyboard shortcuts
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      if (messageText.trim()) {
        handleSubmit();
      }
      event.preventDefault();
    }
  }

  // Handle form submission with streaming
  async function handleSubmit() {
    if (!messageText.trim() || isSubmitting) return;

    const messageContent = messageText.trim();
    messageText = "";
    isSubmitting = true;
    isStreaming = true;
    streamingResponse = "";

    try {
      // Create user message
      const userMessage = {
        id: crypto.randomUUID(),
        content: messageContent,
        sender: "user",
        timestamp: new Date(),
        status: "sent",
      };

      // Update local state with user message
      data = {
        ...data,
        messages: [...(data.messages || []), userMessage],
      };

      // Call streaming API
      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          chatId: data.chat.id,
        }),
      });

      if (!response.ok) {
        throw new Error("API error: " + response.status);
      }

      // Process streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is not readable");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamingResponse += chunk;
      }

      // Save both messages to database
      await fetch(`/api/messages?chatId=${data.chat.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: messageContent,
          aiResponse: streamingResponse,
        }),
      });

      // Update local state with AI response
      const aiMessage = {
        id: crypto.randomUUID(),
        content: streamingResponse,
        sender: "ai",
        timestamp: new Date(),
        status: "sent",
      };

      data = {
        ...data,
        messages: [...(data.messages || []), aiMessage],
      };
    } catch (error) {
      console.error("Error:", error);
      streamingResponse = "Sorry, there was an error generating a response.";
    } finally {
      isSubmitting = false;
      isStreaming = false;
      streamingResponse = "";
    }
  }
</script>

<div class="flex flex-col h-full overflow-hidden px-4 py-2">
  {#if data?.chat}
    <!-- Header with reduced height -->
    <header class="mx-4 border-b bg-surface-100-800-token">
      <h1 class="text-lg font-bold truncate">{data.chat.name || "Chat"}</h1>
      <div class="my-2 flex gap-2 text-xs text-surface-300 truncate">
        {#if data.chat.company}
          <span>{data.chat.company}</span>
        {/if}
        {#if data.chat.industry}
          <span>• {data.chat.industry}</span>
        {/if}
        {#if data.chat.region}
          <span>• {data.chat.region}</span>
        {/if}
      </div>
    </header>

    <!-- Messages container takes remaining space -->
    <div
      class="flex-1 overflow-y-auto py-4 space-y-4 min-h-0"
      bind:this={messagesContainer}
    >
      {#if data.messages && data.messages.length > 0}
        <div class="pb-1">
          {#each data.messages as message}
            <ChatMessage {message} />
          {/each}
        </div>
      {:else}
        <div class="flex h-full items-center justify-center text-surface-500">
          <div class="text-center">
            <h3 class="text-lg font-semibold">Start Your Analysis</h3>
            <p>
              Begin by asking about business strategy or specific 4C's framework
              questions
            </p>
          </div>
        </div>
      {/if}

      {#if isStreaming && streamingResponse}
        <div class="mb-2">
          <ChatMessage
            message={{
              id: "streaming",
              content: streamingResponse,
              sender: "ai",
              timestamp: new Date(),
              status: "streaming",
            }}
          />
        </div>
      {/if}
    </div>

    <!-- Input bar with fixed height -->
    <div class="border-t bg-surface-100-800-token py-2 shrink-0">
      {#if data.chat?.id}
        <div class="input-group grid grid-cols-[1fr_auto]">
          <textarea
            class="input rounded-l resize-none text-sm py-2"
            placeholder="Type your message..."
            bind:value={messageText}
            onkeydown={handleKeydown}
            disabled={isSubmitting}
            rows="2"
          ></textarea>
          <button
            type="button"
            class="btn variant-filled-primary bg-primary-500/20 rounded-r h-full text-sm px-3"
            disabled={isSubmitting || !messageText.trim()}
            onclick={handleSubmit}
          >
            {#if isSubmitting}
              <span class="loading loading-spinner loading-sm"></span>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><line x1="22" y1="2" x2="11" y2="13"></line><polygon
                  points="22 2 15 22 11 13 2 9 22 2"
                ></polygon></svg
              >
            {/if}
          </button>
        </div>
      {/if}
    </div>
  {:else}
    <div class="flex h-full items-center justify-center text-surface-500">
      <div class="text-center card p-6 variant-filled">
        <h3 class="text-lg font-semibold">Chat not found</h3>
        <p class="my-4">This chat may have been deleted or may not exist.</p>
        <a href="/" class="btn variant-filled">Return to Home</a>
      </div>
    </div>
  {/if}
</div>
