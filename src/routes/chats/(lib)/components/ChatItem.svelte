<script lang="ts">
  import type { Chat } from "$lib/types";
  import { formatTime } from "$lib/utils/formatters";
  import { chatManager } from '../ChatManager.svelte.ts';

  // Icons
  import IconTrash from "@lucide/svelte/icons/trash-2";
  import IconMessageCircle from "@lucide/svelte/icons/message-circle";

  // Props definition
  let {
    chat,
    isActive = false,
    showDeleteConfirm = false,
    hasUnread = false,
    snippet,
    onSelect,
    onDeleteClick,
    onConfirmDelete,
    onCancelDelete,
  } = $props<{
    chat: Chat;
    isActive?: boolean;
    showDeleteConfirm?: boolean;
    hasUnread?: boolean;
    snippet: string;
    onSelect: (id: string) => void;
    onDeleteClick: (id: string, event: Event) => void;
    onConfirmDelete: (id: string) => void;
    onCancelDelete: () => void;
  }>();

  // Use derived value for time formatting
  const displayTime = $derived(formatTime(chat.updatedAt));

  // Prevent event propagation for delete button
  function handleDeleteClick(e: Event) {
    e.stopPropagation();
    onDeleteClick(chat.id, e);
  }
</script>

{#if showDeleteConfirm}
  <div class="card glass-warning p-3 w-full mb-2 shadow-sm">
    <p class="text-xs mb-2 font-medium">Delete this analysis?</p>
    <div class="flex gap-2 justify-end">
      <button onclick={onCancelDelete} class="btn btn-sm glass-surface">
        Cancel
      </button>
      <button
        onclick={() => onConfirmDelete(chat.id)}
        class="btn btn-sm glass-warning"
      >
        Delete
      </button>
    </div>
  </div>
{:else}
  <div
    class="card w-full mb-2 chat-card {isActive
      ? 'glass-primary active'
      : 'glass-surface'}"
    class:shadow-md={isActive}
  >
    <!-- Main clickable area for selecting the chat -->
    <div
      class="grid grid-cols-[auto_1fr_auto] gap-3 p-3 items-center cursor-pointer"
      onclick={() => onSelect(chat.id)}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(chat.id);
        }
      }}
      role="button"
      tabindex="0"
      aria-label="Select chat {chat.name}"
    >
      <!-- Icon Column -->
      <div class="flex-none">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center {isActive
            ? 'bg-primary-500/30'
            : 'bg-surface-500/20'}"
        >
          <IconMessageCircle size={16} />
        </div>
      </div>

      <!-- Content Column -->
      <div class="min-w-0 flex flex-col justify-center">
        <div class="flex items-center gap-1 mb-0.5">
          <h4
            class="text-sm font-medium truncate {isActive
              ? 'text-primary-700 dark:text-primary-300'
              : ''}"
          >
            {chat.name}
          </h4>
          {#if hasUnread}
            <div class="w-2 h-2 rounded-full bg-primary-500"></div>
          {/if}
        </div>
        <p class="text-xs truncate opacity-70">{snippet}</p>
      </div>

      <!-- Time/Actions Column -->
      <div class="flex flex-col items-end justify-between h-full">
        <span class="text-xs opacity-60 mb-1">{displayTime}</span>

        <!-- Delete button - stopPropagation prevents triggering the parent's onclick -->
        <button
          type="button"
          onclick={(e) => {
            e.stopPropagation();
            handleDeleteClick(e);
          }}
          class="delete-btn p-1.5 rounded-full hover:glass-surface"
          aria-label="Delete chat"
        >
          <IconTrash size={14} />
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Card hover effect */
  .chat-card {
    transition:
      transform 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;
  }

  .chat-card:hover:not(.active) {
    transform: translateY(-1px);
    box-shadow: var(--theme-shadow-sm);
  }

  /* Delete button animation */
  .delete-btn {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .chat-card:hover .delete-btn {
    opacity: 0.7;
  }

  .delete-btn:hover {
    opacity: 1 !important;
  }
</style>
